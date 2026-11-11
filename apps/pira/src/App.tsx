import { useState } from 'react'
import { CustomersView } from './components/CustomersView'
import { Dashboard } from './components/Dashboard'
import { InvoicesView } from './components/InvoicesView'
import { Layout } from './components/Layout'
import { PartsView } from './components/PartsView'
import { resetDemoData } from './lib/store'

export type View = 'dashboard' | 'parts' | 'invoices' | 'customers'

export default function App() {
  const [view, setView] = useState<View>('dashboard')

  return (
    <Layout view={view} onNavigate={setView}>
      {view === 'dashboard' && <Dashboard onNavigate={setView} />}
      {view === 'parts' && <PartsView />}
      {view === 'invoices' && <InvoicesView />}
      {view === 'customers' && <CustomersView />}
      <p className="muted" style={{ marginTop: '2rem', fontSize: '0.8rem' }}>
        Datos en este navegador (localStorage).{' '}
        <button
          type="button"
          className="btn ghost"
          style={{ padding: '0.2rem 0.5rem', fontSize: '0.8rem' }}
          onClick={() => {
            if (window.confirm('¿Restaurar datos de demostración? Se perderán los cambios locales.')) {
              resetDemoData()
            }
          }}
        >
          Restaurar demo
        </button>
      </p>
    </Layout>
  )
}
