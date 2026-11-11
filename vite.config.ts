import { spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'

const projectRoot = fileURLToPath(new URL('.', import.meta.url))

function prerenderLanding(): Plugin {
  let indexFile = path.join(projectRoot, 'dist', 'index.html')

  return {
    name: 'solunit-prerender',
    apply: 'build',
    configResolved(config) {
      indexFile = path.join(config.build.outDir, 'index.html')
    },
    closeBundle() {
      if (!existsSync(indexFile)) return

      const result = spawnSync(
        process.execPath,
        [path.join(projectRoot, 'scripts', 'prerender.mjs'), indexFile],
        { cwd: projectRoot, stdio: 'inherit', env: process.env },
      )

      if (result.status !== 0) {
        throw new Error('El prerender de la landing falló.')
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), prerenderLanding()],
})
