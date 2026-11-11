import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

const root = document.getElementById('root')

if (!root) {
  throw new Error('No se encontró #root')
}

const app = (
  <StrictMode>
    <App />
  </StrictMode>
)

if (root.dataset.prerendered === 'true') {
  hydrateRoot(root, app)
} else {
  createRoot(root).render(app)
}
