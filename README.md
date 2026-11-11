# Solunit

Landing corporativa de **Solunit — Soluciones Únicas Tecnológicas**.

## Desarrollo

```bash
pnpm install
pnpm dev
```

```bash
pnpm build
pnpm preview
```

## Contenido

El copy vive en `src/data/content.ts`. Las reglas de marca para agentes están en `AGENTS.md`.

## Despliegue

Producción: [solunit.es](https://solunit.es).

Vercel está conectado al repo `migpersan/solunit`. Cada merge a `main` crea un deployment de Production. Framework: Vite. Build: `pnpm build`. Output: `dist`.

Si el dominio sirve un build antiguo (Google Fonts, `#root` vacío, sin `data-prerendered`), el tip de `main` no se ha desplegado: hace falta un nuevo push a `main` o un Redeploy en Vercel.

## Apps

- **Pira** (`apps/pira`): MVP de gestión de recambios y facturas (estilo Gira). Ver `apps/pira/README.md`. Arranque: `cd apps/pira && pnpm install && pnpm dev` → http://localhost:5174

## Pendiente (revisión humana)

- Casos de proyecto reales y métricas verificables
- El contacto público es `info@kedai.es` hasta que `hola@solunit.es` tenga buzón
- Formulario de contacto con envío real (sin mailto)
