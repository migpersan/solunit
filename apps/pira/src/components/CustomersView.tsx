import { useMemo, useState, type FormEvent } from 'react'
import { uid } from '../lib/format'
import { upsertCustomer } from '../lib/store'
import type { Customer } from '../lib/types'
import { useStore } from '../lib/useStore'

const blank = (): Customer => ({
  id: '',
  name: '',
  taxId: '',
  email: '',
  phone: '',
})

export function CustomersView() {
  const { customers, invoices } = useStore()
  const [query, setQuery] = useState('')
  const [editing, setEditing] = useState<Customer | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return customers
    return customers.filter((c) =>
      [c.name, c.taxId, c.email, c.phone].join(' ').toLowerCase().includes(q),
    )
  }, [customers, query])

  function onSubmit(event: FormEvent) {
    event.preventDefault()
    if (!editing?.name.trim()) return
    upsertCustomer({
      ...editing,
      id: editing.id || uid('cust'),
      name: editing.name.trim(),
      taxId: editing.taxId.trim(),
      email: editing.email.trim(),
      phone: editing.phone.trim(),
    })
    setMessage('Cliente guardado.')
    setEditing(null)
  }

  return (
    <>
      <header className="page-head">
        <div>
          <h1>Clientes</h1>
          <p>Agenda mínima para asociar facturas. Sin CRM: nombre, NIF y contacto.</p>
        </div>
        <button
          type="button"
          className="btn"
          onClick={() => {
            setMessage(null)
            setEditing({ ...blank(), id: uid('cust') })
          }}
        >
          Nuevo cliente
        </button>
      </header>

      {message && <div className="flash ok">{message}</div>}

      <div className="toolbar">
        <input
          className="search"
          type="search"
          placeholder="Buscar cliente…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Buscar clientes"
        />
      </div>

      <section className="panel">
        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>NIF/CIF</th>
                <th>Contacto</th>
                <th>Facturas</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => {
                const count = invoices.filter((i) => i.customerId === c.id).length
                return (
                  <tr
                    key={c.id}
                    className="clickable"
                    tabIndex={0}
                    onClick={() => {
                      setMessage(null)
                      setEditing(c)
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        setEditing(c)
                      }
                    }}
                  >
                    <td>{c.name}</td>
                    <td className="ref">{c.taxId || '—'}</td>
                    <td>
                      <div>{c.email || '—'}</div>
                      <div className="muted">{c.phone}</div>
                    </td>
                    <td>{count}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>

      {editing && (
        <section className="panel" style={{ marginTop: '1rem' }}>
          <div className="panel-head">
            <h2>Ficha de cliente</h2>
            <button type="button" className="btn ghost" onClick={() => setEditing(null)}>
              Cerrar
            </button>
          </div>
          <form onSubmit={onSubmit}>
            <div className="form-grid">
              <label className="field full">
                Nombre
                <input
                  required
                  value={editing.name}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                />
              </label>
              <label className="field">
                NIF / CIF
                <input
                  value={editing.taxId}
                  onChange={(e) => setEditing({ ...editing, taxId: e.target.value })}
                />
              </label>
              <label className="field">
                Teléfono
                <input
                  value={editing.phone}
                  onChange={(e) => setEditing({ ...editing, phone: e.target.value })}
                />
              </label>
              <label className="field full">
                Email
                <input
                  type="email"
                  value={editing.email}
                  onChange={(e) => setEditing({ ...editing, email: e.target.value })}
                />
              </label>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn">
                Guardar
              </button>
            </div>
          </form>
        </section>
      )}
    </>
  )
}
