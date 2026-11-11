import type { ReactNode } from 'react'
import type { View } from '../App'

const items: { id: View; label: string }[] = [
  { id: 'dashboard', label: 'Panel' },
  { id: 'parts', label: 'Recambios' },
  { id: 'invoices', label: 'Facturas' },
  { id: 'customers', label: 'Clientes' },
]

type Props = {
  view: View
  onNavigate: (view: View) => void
  children: ReactNode
}

export function Layout({ view, onNavigate, children }: Props) {
  return (
    <div className="app-shell">
      <aside className="side-nav" aria-label="Navegación principal">
        <div className="brand">
          <div className="brand-mark">
            PI<span>RA</span>
          </div>
          <p className="brand-sub">Recambios y facturas</p>
        </div>
        <nav className="nav-list">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`nav-btn${view === item.id ? ' active' : ''}`}
              aria-current={view === item.id ? 'page' : undefined}
              onClick={() => onNavigate(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <p className="nav-foot">Solunit · MVP local</p>
      </aside>
      <main className="main">{children}</main>
    </div>
  )
}
