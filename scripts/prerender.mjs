import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'

const root = fileURLToPath(new URL('..', import.meta.url))
const indexFile = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.join(root, 'dist', 'index.html')

const marker = 'data-prerendered="true"'
const heroTitle = 'Tecnología a medida para empresas que quieren llegar más lejos.'

const template = await readFile(indexFile, 'utf8')
const markFile = await readFile(new URL('../public/mark.svg', import.meta.url), 'utf8')
const markPaths = [...markFile.matchAll(/\sd="([^"]+)"/g)].map((match) => match[1])
if (markPaths.length !== 2) {
  throw new Error('public/mark.svg no tiene los dos trazos de la marca.')
}

if (template.includes(marker)) {
  console.log('Prerender: el HTML ya incluye la landing.')
  process.exit(0)
}

const rootPattern = /<div id="root">\s*<\/div>/
if (!rootPattern.test(template)) {
  throw new Error(`No se encontró <div id="root"> vacío en ${indexFile}`)
}

const vite = await createServer({
  root,
  appType: 'custom',
  server: { middlewareMode: true },
  logLevel: 'error',
})

function replaceOnce(html, pattern, replacement, label) {
  if (!pattern.test(html)) throw new Error(`Prerender: no se pudo actualizar ${label}`)
  pattern.lastIndex = 0
  return html.replace(pattern, replacement)
}

function applyHead(html, meta, jsonLd) {
  let next = replaceOnce(html, /<title>[^<]*<\/title>/, `<title>${meta.title}</title>`, 'title')
  next = replaceOnce(
    next,
    /(<meta\s+name="description"\s+content=")[^"]*(")/,
    `$1${meta.description}$2`,
    'description',
  )
  next = replaceOnce(
    next,
    /(<link rel="canonical" href=")[^"]*(")/,
    `$1${meta.canonical}$2`,
    'canonical',
  )
  next = replaceOnce(
    next,
    /(<meta property="og:title" content=")[^"]*(")/,
    `$1${meta.title}$2`,
    'og:title',
  )
  next = replaceOnce(
    next,
    /(<meta\s+property="og:description"\s+content=")[^"]*(")/,
    `$1${meta.description}$2`,
    'og:description',
  )
  next = replaceOnce(
    next,
    /(<meta property="og:url" content=")[^"]*(")/,
    `$1${meta.canonical}$2`,
    'og:url',
  )
  next = replaceOnce(
    next,
    /(<meta name="twitter:title" content=")[^"]*(")/,
    `$1${meta.title}$2`,
    'twitter:title',
  )
  next = replaceOnce(
    next,
    /(<meta\s+name="twitter:description"\s+content=")[^"]*(")/,
    `$1${meta.description}$2`,
    'twitter:description',
  )
  const json = JSON.stringify(jsonLd, null, 2)
    .split('\n')
    .map((line, index) => (index === 0 ? line : `      ${line}`))
    .join('\n')
  next = replaceOnce(
    next,
    /<script type="application\/ld\+json">[\s\S]*?<\/script>/,
    `<script type="application/ld+json">\n      ${json}\n    </script>`,
    'json-ld',
  )
  return next
}

function pageHtml(appHtml) {
  return appHtml.replace(/^(?:<link rel="preload" as="image"[^>]*>)+/, '')
}

try {
  const { render } = await vite.ssrLoadModule('/src/entry-server.tsx')
  const { pageMeta, pageJsonLd, pageHeading } = await vite.ssrLoadModule('/src/data/pages.ts')
  const { owner } = await vite.ssrLoadModule('/src/data/legal.ts')
  const { hero, services } = await vite.ssrLoadModule('/src/data/content.ts')

  const outputs = [
    { id: 'home', file: indexFile },
    { id: 'aviso-legal', file: path.join(path.dirname(indexFile), 'aviso-legal', 'index.html') },
    { id: 'privacidad', file: path.join(path.dirname(indexFile), 'privacidad', 'index.html') },
  ]

  for (const output of outputs) {
    const meta = pageMeta[output.id]
    const appHtml = pageHtml(render(output.id))

    if (!appHtml.startsWith('<a class="skip-link"') || appHtml.includes('<script')) {
      throw new Error(
        `El HTML de ${output.id} no empieza por el enlace de salto. Inicio: ${appHtml.slice(0, 240)}`,
      )
    }

    // La cabecera, el hero y el pie llevan el símbolo en el HTML.
    // Pedir /mark.svg otra vez retrasa la marca y compite con las fuentes.
    if (appHtml.includes('/mark.svg') || markPaths.some((d) => !appHtml.includes(d))) {
      throw new Error(`La página ${output.id} tiene que dibujar public/mark.svg y no pedirlo.`)
    }

    let html = applyHead(template, meta, pageJsonLd(output.id))
    html = html.replace(rootPattern, () => `<div id="root" ${marker}>${appHtml}</div>`)

    const ldMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)
    if (!ldMatch) throw new Error(`La página ${output.id} no tiene JSON-LD.`)
    const ld = JSON.parse(ldMatch[1])
    const graph = Array.isArray(ld['@graph']) ? ld['@graph'] : []
    const node = (type) => graph.find((item) => item['@type'] === type)
    const webpage = node('WebPage')
    const organization = node('Organization')
    if (ld['@context'] !== 'https://schema.org' || !webpage || !organization || !node('WebSite')) {
      throw new Error(`El JSON-LD de ${output.id} tiene que describir la página, la organización y el sitio.`)
    }
    if (
      webpage.name !== meta.title ||
      webpage.description !== meta.description ||
      webpage.url !== meta.canonical
    ) {
      throw new Error(`La ficha de ${output.id} no coincide con su WebPage.`)
    }
    if (organization.email !== owner.email || organization.description !== hero.support) {
      throw new Error('La organización del JSON-LD no coincide con el titular público.')
    }
    if (JSON.stringify(ld).includes(owner.idDocument)) {
      throw new Error('El JSON-LD no debe incluir el documento de identidad.')
    }

    if (output.id === 'home') {
      const names = (node('ItemList')?.itemListElement ?? []).map((item) => item.item?.name)
      const expected = services.map((service) => service.title)
      if (names.length !== expected.length || names.some((name, index) => name !== expected[index])) {
        throw new Error('El JSON-LD de la home no lista los servicios que se ven en la página.')
      }
    } else if (node('ItemList')) {
      throw new Error(`La página ${output.id} no muestra los servicios: no deben ir en su JSON-LD.`)
    }

    if (output.id === 'home') {
      if (!html.includes('id="hero-title"') || !html.includes(heroTitle)) {
        throw new Error('El prerender no incluye el titular del hero.')
      }
      // La descripción de búsqueda, Open Graph y Twitter tienen que decir el oficio.
      // Si el prerender las deja en el título, la tarjeta social repite la marca y no el trabajo.
      const descriptionMarks = [
        `name="description" content="${meta.description}"`,
        `property="og:description" content="${meta.description}"`,
        `name="twitter:description" content="${meta.description}"`,
      ]
      const flat = html.replace(/\s+/g, ' ')
      if (descriptionMarks.some((mark) => !flat.includes(mark))) {
        throw new Error('La descripción de la home no llega igual a la ficha, a Open Graph y a Twitter.')
      }
      if (!html.includes(`"description": ${JSON.stringify(meta.description)}`)) {
        throw new Error('La descripción del JSON-LD de la home no coincide con la ficha.')
      }
      if (webpage.dateModified || node('BreadcrumbList')) {
        throw new Error('La home no es un documento fechado y no lleva migas.')
      }
      if (!html.includes(owner.email) || !html.includes('/aviso-legal') || !html.includes('/privacidad')) {
        throw new Error('El prerender de la home no incluye el contacto ni las páginas legales.')
      }
      if (html.includes(owner.idDocument)) {
        throw new Error('La home no debe incluir el documento de identidad. Está en el aviso legal.')
      }
      // Chrome trata action="mailto:" del formulario visible como contenido
      // mixto. El envío con JavaScript no usa ese action. Sin JavaScript
      // sigue habiendo un formulario mailto, solo dentro de noscript.
      const outsideNoscript = html.replace(/<noscript>[\s\S]*?<\/noscript>/g, '')
      if (outsideNoscript.includes('action="mailto:')) {
        throw new Error('El formulario visible no debe usar action mailto.')
      }
      if (!outsideNoscript.includes('method="dialog"')) {
        throw new Error('El formulario visible tiene que usar method dialog para no enviar datos al servidor.')
      }
      const noscript = html.match(/<noscript>[\s\S]*?<\/noscript>/g) ?? []
      if (!noscript.some((block) => block.includes(`action="mailto:${owner.email}"`))) {
        throw new Error('Sin JavaScript el formulario tiene que seguir abriendo el correo.')
      }
      // Servicios, método, ejemplo y contacto tienen que estar en el HTML a plena tinta.
      // Ocultarlos hasta hacer scroll deja el foco y la búsqueda sobre texto invisible.
      if (html.includes('data-reveal') || html.includes('reveal-ready')) {
        throw new Error('La home no debe ocultar secciones hasta que entren en pantalla.')
      }
    } else {
      if (html.includes('id="hero-title"')) {
        throw new Error(`La página ${output.id} ha prerenderizado la home.`)
      }
      if (!html.includes(owner.name) || !html.includes(owner.idDocument) || !html.includes(owner.address)) {
        throw new Error(`La página ${output.id} no incluye la identidad del titular.`)
      }
      if (!html.includes(`data-nosnippet="">DNI ${owner.idDocument}`)) {
        throw new Error(`El documento de ${output.id} tiene que seguir en la página y fuera del extracto.`)
      }
      const headEnd = html.indexOf('<body')
      const head = headEnd === -1 ? html : html.slice(0, headEnd)
      if (head.includes(owner.idDocument)) {
        throw new Error(
          `La cabecera de ${output.id} no debe incluir el documento de identidad. Va en el texto de la página.`,
        )
      }
      if (!html.includes(`<title>${meta.title}</title>`) || !html.includes(meta.canonical)) {
        throw new Error(`La cabecera de ${output.id} no coincide con su ficha.`)
      }
      if (!html.includes(`content="${meta.description}"`)) {
        throw new Error(`La ficha de ${output.id} no llega a la descripción.`)
      }
      if (webpage.dateModified !== owner.updated) {
        throw new Error(`La página ${output.id} no declara la fecha de actualización.`)
      }
      const crumbNames = (node('BreadcrumbList')?.itemListElement ?? []).map((item) => item.name)
      if (crumbNames[0] !== 'Inicio' || crumbNames[1] !== pageHeading[output.id]) {
        throw new Error(`Las migas de ${output.id} no coinciden con la ruta visible.`)
      }
      // React SSR escribe dateTime. En HTML el nombre es insensible a mayúsculas
      // y un analizador lo lee como datetime.
      const visibleMarks = [
        html.includes('aria-label="Ruta"'),
        html.includes('aria-current="page"'),
        new RegExp(`<h1\\b[^>]*>\\s*${pageHeading[output.id]}\\s*</h1>`).test(html),
        html.includes(`dateTime="${owner.updated}"`),
        html.includes(`>${owner.updatedLabel}<`),
      ]
      if (visibleMarks.some((ok) => !ok)) {
        throw new Error(`La ruta o la fecha visible de ${output.id} no coinciden con el marcado.`)
      }
    }

    await mkdir(path.dirname(output.file), { recursive: true })
    await writeFile(output.file, html)
    console.log(`Prerender: ${output.file} (${html.length} bytes)`)
  }

  const sitemapFile = path.join(path.dirname(indexFile), 'sitemap.xml')
  const sitemap = await readFile(sitemapFile, 'utf8')
  const dated = [`aviso-legal`, `privacidad`]
  for (const id of dated) {
    const loc = pageMeta[id].canonical
    const block = sitemap.split('<url>').find((part) => part.includes(`<loc>${loc}</loc>`))
    if (!block || !block.includes(`<lastmod>${owner.updated}</lastmod>`)) {
      throw new Error(`El sitemap no fecha ${loc} con la actualización del documento.`)
    }
  }
} finally {
  await vite.close()
}
