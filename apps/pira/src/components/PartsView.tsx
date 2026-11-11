import { useMemo, useState, type FormEvent } from 'react'
import { money, qty, uid } from '../lib/format'
import {
  adjustStock,
  deletePart,
  getData,
  upsertPart,
} from '../lib/store'
import type { Part } from '../lib/types'
import { useStore } from '../lib/useStore'

const emptyForm = (): Omit<Part, 'updatedAt'> => ({
  id: '',
  reference: '',
  name: '',
  brand: '',
  family: '',
  location: '',
  stock: 0,
  minStock: 0,
  cost: 0,
  price: 0,
  notes: '',
})

export function PartsView() {
  const { parts } = useStore()
  const [query, setQuery] = useState('')
  const [editing, setEditing] = useState<Omit<Part, 'updatedAt'> | null>(null)
  const [stockDelta, setStockDelta] = useState('1')
  const [message, setMessage] = useState<{ type: 'ok' | 'error'; text: string } | null>(
    null,
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return parts
    return parts.filter((p) =>
      [p.reference, p.name, p.brand, p.family, p.location]
        .join(' ')
        .toLowerCase()
        .includes(q),
    )
  }, [parts, query])

  function openNew() {
    setMessage(null)
    setEditing({ ...emptyForm(), id: uid('part') })
  }

  function openEdit(part: Part) {
    setMessage(null)
    setEditing({
      id: part.id,
      reference: part.reference,
      name: part.name,
      brand: part.brand,
      family: part.family,
      location: part.location,
      stock: part.stock,
      minStock: part.minStock,
      cost: part.cost,
      price: part.price,
      notes: part.notes,
    })
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault()
    if (!editing) return
    if (!editing.reference.trim() || !editing.name.trim()) {
      setMessage({ type: 'error', text: 'Referencia y nombre son obligatorios.' })
      return
    }
    const dup = parts.find(
      (p) =>
        p.reference.toLowerCase() === editing.reference.trim().toLowerCase() &&
        p.id !== editing.id,
    )
    if (dup) {
      setMessage({ type: 'error', text: 'Ya existe un recambio con esa referencia.' })
      return
    }
    upsertPart({
      ...editing,
      reference: editing.reference.trim().toUpperCase(),
      name: editing.name.trim(),
      brand: editing.brand.trim(),
      family: editing.family.trim(),
      location: editing.location.trim(),
      notes: editing.notes.trim(),
    })
    setMessage({ type: 'ok', text: 'Recambio guardado.' })
    setEditing(null)
  }

  function onDelete(id: string) {
    try {
      deletePart(id)
      setEditing(null)
      setMessage({ type: 'ok', text: 'Recambio eliminado.' })
    } catch (err) {
      setMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'No se pudo eliminar',
      })
    }
  }

  function onAdjust(partId: string, sign: 1 | -1) {
    try {
      const n = Number(stockDelta)
      if (!Number.isFinite(n) || n <= 0) {
        setMessage({ type: 'error', text: 'Indica una cantidad positiva.' })
        return
      }
      adjustStock(partId, sign * n, sign > 0 ? 'Entrada manual' : 'Salida manual')
      setMessage({
        type: 'ok',
        text: sign > 0 ? 'Entrada de stock registrada.' : 'Salida de stock registrada.',
      })
      const part = getData().parts.find((p) => p.id === partId)
      if (part && editing?.id === partId) openEdit(part)
    } catch (err) {
      setMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'No se pudo ajustar el stock',
      })
    }
  }

  return (
    <>
      <header className="page-head">
        <div>
          <h1>Recambios</h1>
          <p>Busca por referencia, marca o ubicación. Controla stock mínimo y PVP.</p>
        </div>
        <button type="button" className="btn" onClick={openNew}>
          Nuevo recambio
        </button>
      </header>

      {message && <div className={`flash ${message.type}`}>{message.text}</div>}

      <div className="toolbar">
        <input
          className="search"
          type="search"
          placeholder="Buscar referencia, nombre, marca…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Buscar recambios"
        />
        <span className="muted">{qty(filtered.length)} resultados</span>
      </div>

      <section className="panel">
        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th>Referencia</th>
                <th>Nombre</th>
                <th>Familia</th>
                <th>Ubicación</th>
                <th>Stock</th>
                <th>PVP</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <p className="empty">No hay recambios con ese criterio.</p>
                  </td>
                </tr>
              ) : (
                filtered.map((part) => (
                  <tr
                    key={part.id}
                    className="clickable"
                    onClick={() => openEdit(part)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        openEdit(part)
                      }
                    }}
                    tabIndex={0}
                  >
                    <td className="ref">{part.reference}</td>
                    <td>
                      <div>{part.name}</div>
                      <div className="muted">{part.brand}</div>
                    </td>
                    <td>{part.family || '—'}</td>
                    <td className="ref">{part.location || '—'}</td>
                    <td>
                      <span
                        className={`badge ${
                          part.stock === 0
                            ? 'danger'
                            : part.stock <= part.minStock
                              ? 'warn'
                              : 'ok'
                        }`}
                      >
                        {qty(part.stock)}
                      </span>
                    </td>
                    <td>{money(part.price)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {editing && (
        <section className="panel" style={{ marginTop: '1rem' }} aria-label="Editar recambio">
          <div className="panel-head">
            <h2>
              {parts.some((p) => p.id === editing.id) ? 'Editar recambio' : 'Nuevo recambio'}
            </h2>
            <button type="button" className="btn ghost" onClick={() => setEditing(null)}>
              Cerrar
            </button>
          </div>
          <form onSubmit={onSubmit}>
            <div className="form-grid">
              <label className="field">
                Referencia
                <input
                  required
                  value={editing.reference}
                  onChange={(e) => setEditing({ ...editing, reference: e.target.value })}
                />
              </label>
              <label className="field">
                Nombre
                <input
                  required
                  value={editing.name}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                />
              </label>
              <label className="field">
                Marca
                <input
                  value={editing.brand}
                  onChange={(e) => setEditing({ ...editing, brand: e.target.value })}
                />
              </label>
              <label className="field">
                Familia
                <input
                  value={editing.family}
                  onChange={(e) => setEditing({ ...editing, family: e.target.value })}
                />
              </label>
              <label className="field">
                Ubicación
                <input
                  value={editing.location}
                  onChange={(e) => setEditing({ ...editing, location: e.target.value })}
                />
              </label>
              <label className="field">
                Stock mínimo
                <input
                  type="number"
                  min={0}
                  value={editing.minStock}
                  onChange={(e) =>
                    setEditing({ ...editing, minStock: Number(e.target.value) || 0 })
                  }
                />
              </label>
              <label className="field">
                Coste
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  value={editing.cost}
                  onChange={(e) =>
                    setEditing({ ...editing, cost: Number(e.target.value) || 0 })
                  }
                />
              </label>
              <label className="field">
                PVP
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  value={editing.price}
                  onChange={(e) =>
                    setEditing({ ...editing, price: Number(e.target.value) || 0 })
                  }
                />
              </label>
              <label className="field full">
                Notas
                <textarea
                  rows={2}
                  value={editing.notes}
                  onChange={(e) => setEditing({ ...editing, notes: e.target.value })}
                />
              </label>
            </div>

            {parts.some((p) => p.id === editing.id) && (
              <div className="form-actions">
                <span className="muted">
                  Stock actual: <strong className="ref">{qty(editing.stock)}</strong>
                </span>
                <input
                  className="search"
                  style={{ maxWidth: 100 }}
                  type="number"
                  min={1}
                  value={stockDelta}
                  onChange={(e) => setStockDelta(e.target.value)}
                  aria-label="Cantidad de ajuste"
                />
                <button
                  type="button"
                  className="btn secondary"
                  onClick={() => onAdjust(editing.id, 1)}
                >
                  Entrada
                </button>
                <button
                  type="button"
                  className="btn secondary"
                  onClick={() => onAdjust(editing.id, -1)}
                >
                  Salida
                </button>
              </div>
            )}

            <div className="form-actions">
              <button type="submit" className="btn">
                Guardar
              </button>
              {parts.some((p) => p.id === editing.id) && (
                <button
                  type="button"
                  className="btn danger"
                  onClick={() => onDelete(editing.id)}
                >
                  Eliminar
                </button>
              )}
            </div>
          </form>
        </section>
      )}
    </>
  )
}
