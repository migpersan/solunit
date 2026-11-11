import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import App from './App.tsx'
import type { PageId } from './data/pages.ts'

export function render(page: PageId = 'home') {
  return renderToString(
    <StrictMode>
      <App page={page} />
    </StrictMode>,
  )
}
