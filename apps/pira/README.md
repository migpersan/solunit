# Pira — recambios y facturas

MVP de gestión de recambios (stock) y facturas al estilo Gira, embebido en el monorepo Solunit.

## Stack

**Vite + React 19 + TypeScript**, el mismo enfoque que la landing de Solunit.

No se usó REA ni Ghidra: son herramientas de ingeniería inversa y no aparecen en este repo ni encajan en una app de almacén/facturación.

Persistencia: `localStorage` en el navegador (sin backend en este MVP).

## Arranque local

Desde la raíz del repo:

```bash
cd apps/pira
pnpm install
pnpm dev
```

Abre [http://localhost:5174](http://localhost:5174).

```bash
pnpm build
pnpm preview
```

## Qué incluye

- **Recambios**: alta/edición, búsqueda, stock mínimo, entradas/salidas manuales
- **Facturas**: borrador con líneas ligadas a recambios → emisión (descuenta stock) → anulación (restaura stock)
- **Clientes**: ficha mínima para facturar
- **Panel**: alertas de stock y facturación reciente
- Datos de demostración y botón «Restaurar demo»

## Fuera de alcance (siguiente iteración)

- Backend / multi-usuario / Auth
- IVA, series Verifactu, PDF e impresión fiscal
- Pedidos, albaranes, proveedores, multi-almacén
- Integración con la landing o despliegue en subdominio
