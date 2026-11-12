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
  const { pageMeta } = await vite.ssrLoadModule('/src/data/pages.ts')
  const { organizationJsonLd, owner } = await vite.ssrLoadModule('/src/data/legal.ts')
  const jsonLd = organizationJsonLd()

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

    let html = applyHead(template, meta, jsonLd)
    html = html.replace(rootPattern, () => `<div id="root" ${marker}>${appHtml}</div>`)

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
    }

    await mkdir(path.dirname(output.file), { recursive: true })
    await writeFile(output.file, html)
    console.log(`Prerender: ${output.file} (${html.length} bytes)`)
  }
} finally {
  await vite.close()
}
