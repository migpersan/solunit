import { readFile, writeFile } from 'node:fs/promises'
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

try {
  const { render } = await vite.ssrLoadModule('/src/entry-server.tsx')
  // renderToString antepone <link rel="preload"> de las <img>.
  // En el cliente no son hijos de #root (el <head> ya precarga el símbolo),
  // así que se retiran para que la hidratación coincida.
  const appHtml = render().replace(
    /^(?:<link rel="preload" as="image"[^>]*>)+/,
    '',
  )

  if (!appHtml.startsWith('<a class="skip-link"') || appHtml.includes('<script')) {
    throw new Error(
      `El HTML prerenderizado no empieza por el enlace de salto. Inicio: ${appHtml.slice(0, 240)}`,
    )
  }

  const html = template.replace(
    rootPattern,
    () => `<div id="root" ${marker}>${appHtml}</div>`,
  )

  if (!html.includes('id="hero-title"') || !html.includes(heroTitle)) {
    throw new Error('El prerender no incluye el titular del hero.')
  }
  if (!html.includes('hola@solunit.es')) {
    throw new Error('El prerender no incluye el email de contacto.')
  }

  await writeFile(indexFile, html)
  console.log(`Prerender: ${indexFile} (${html.length} bytes)`)
} finally {
  await vite.close()
}
