import { useMemo, useState, type FormEvent } from 'react'
import { dateEs, invoiceTotal, money, qty, uid } from '../lib/format'
import {
  deleteDraftInvoice,
  emitInvoice,
  saveInvoiceDraft,
  voidInvoice,
} from '../lib/store'
import type { Invoice, InvoiceLine, Part } from '../lib/types'
import { useStore } from '../lib/useStore'

type DraftLine = {
  key: string
  partId: string
  quantity: number
  unitPrice: number
}

function linesFromInvoice(inv: Invoice): DraftLine[] {
  return inv.lines.map((line) => ({
    key: line.id,
    partId: line.partId,
    quantity: line.quantity,
    unitPrice: line.unitPrice,
  }))
}

function blankLine(parts: Part[]): DraftLine {
  const first = parts[0]
  return {
    key: uid('dl'),
    partId: first?.id ?? '',
    quantity: 1,
    unitPrice: first?.price ?? 0,
  }
}

export function InvoicesView() {
  const { invoices, customers, parts } = useStore()
  const [query, setQuery] = useState('')
  const [mode, setMode] = useState<'list' | 'edit' | 'detail'>('list')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [draftId, setDraftId] = useState<string | undefined>()
  const [customerId, setCustomerId] = useState(customers[0]?.id ?? '')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [notes, setNotes] = useState('')
  const [lines, setLines] = useState<DraftLine[]>([blankLine(parts)])
  const [message, setMessage] = useState<{ type: 'ok' | 'error'; text: string } | null>(
    null,
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return invoices
    return invoices.filter((inv) =>
      [inv.number, inv.customerName, inv.status].join(' ').toLowerCase().includes(q),
    )
  }, [invoices, query])

  const selected = invoices.find((i) => i.id === selectedId) ?? null

  function startNew() {
    setMessage(null)
    setDraftId(undefined)
    setCustomerId(customers[0]?.id ?? '')
    setDate(new Date().toISOString().slice(0, 10))
    setNotes('')
    setLines([blankLine(parts)])
    setMode('edit')
  }

  function startEdit(inv: Invoice) {
    if (inv.status !== 'borrador') {
      setSelectedId(inv.id)
      setMode('detail')
      return
    }
    setMessage(null)
    setDraftId(inv.id)
    setCustomerId(inv.customerId)
    setDate(inv.date)
    setNotes(inv.notes)
    setLines(linesFromInvoice(inv))
    setMode('edit')
  }

  function openDetail(inv: Invoice) {
    setSelectedId(inv.id)
    setMode('detail')
    setMessage(null)
  }

  function updateLine(key: string, patch: Partial<DraftLine>) {
    setLines((prev) =>
      prev.map((line) => {
        if (line.key !== key) return line
        const next = { ...line, ...patch }
        if (patch.partId) {
          const part = parts.find((p) => p.id === patch.partId)
          if (part) next.unitPrice = part.price
        }
        return next
      }),
    )
  }

  function buildPayloadLines(): Omit<InvoiceLine, 'id'>[] {
    return lines
      .filter((l) => l.partId && l.quantity > 0)
      .map((l) => {
        const part = parts.find((p) => p.id === l.partId)
        return {
          partId: l.partId,
          reference: part?.reference ?? '',
          description: part?.name ?? '',
          quantity: l.quantity,
          unitPrice: l.unitPrice,
        }
      })
  }

  function onSave(event: FormEvent) {
    event.preventDefault()
    try {
      const payloadLines = buildPayloadLines()
      if (payloadLines.length === 0) {
        setMessage({ type: 'error', text: 'Añade al menos una línea con cantidad.' })
        return
      }
      const inv = saveInvoiceDraft({
        id: draftId,
        customerId,
        date,
        notes,
        lines: payloadLines,
      })
      setMessage({ type: 'ok', text: `Borrador ${inv.number} guardado.` })
      setSelectedId(inv.id)
      setMode('detail')
    } catch (err) {
      setMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'No se pudo guardar',
      })
    }
  }

  function onEmit(id: string) {
    try {
      const inv = emitInvoice(id)
      setMessage({
        type: 'ok',
        text: `${inv.number} emitida. Stock descontado de las líneas.`,
      })
      setSelectedId(id)
      setMode('detail')
    } catch (err) {
      setMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'No se pudo emitir',
      })
    }
  }

  function onVoid(id: string) {
    try {
      const inv = voidInvoice(id)
      setMessage({
        type: 'ok',
        text:
          inv.status === 'anulada'
            ? `${inv.number} anulada. Stock restaurado si estaba emitida.`
            : 'Factura actualizada.',
      })
    } catch (err) {
      setMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'No se pudo anular',
      })
    }
  }

  function onDeleteDraft(id: string) {
    try {
      deleteDraftInvoice(id)
      setMode('list')
      setSelectedId(null)
      setMessage({ type: 'ok', text: 'Borrador eliminado.' })
    } catch (err) {
      setMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'No se pudo borrar',
      })
    }
  }

  const previewTotal = invoiceTotal(
    lines.map((l) => ({ quantity: l.quantity, unitPrice: l.unitPrice })),
  )

  if (mode === 'edit') {
    return (
      <>
        <header className="page-head">
          <div>
            <h1>{draftId ? 'Editar borrador' : 'Nueva factura'}</h1>
            <p>Las líneas enlazan a recambios. El stock se mueve al emitir.</p>
          </div>
          <button type="button" className="btn secondary" onClick={() => setMode('list')}>
            Volver al listado
          </button>
        </header>
        {message && <div className={`flash ${message.type}`}>{message.text}</div>}
        <form className="panel" onSubmit={onSave}>
          <div className="panel-head">
            <h2>Cabecera</h2>
          </div>
          <div className="form-grid">
            <label className="field">
              Cliente
              <select
                required
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
              >
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              Fecha
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </label>
            <label className="field full">
              Notas
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </label>
          </div>

          <div className="panel-head" style={{ borderTop: '1px solid var(--line)' }}>
            <h2>Líneas</h2>
            <button
              type="button"
              className="btn secondary"
              onClick={() => setLines((prev) => [...prev, blankLine(parts)])}
              disabled={parts.length === 0}
            >
              Añadir línea
            </button>
          </div>

          <div className="line-editor">
            {parts.length === 0 ? (
              <p className="empty">Crea recambios antes de facturar.</p>
            ) : (
              lines.map((line) => {
                const part = parts.find((p) => p.id === line.partId)
                return (
                  <div className="line-row" key={line.key}>
                    <label className="field">
                      Recambio
                      <select
                        value={line.partId}
                        onChange={(e) => updateLine(line.key, { partId: e.target.value })}
                      >
                        {parts.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.reference} — {p.name} (stock {p.stock})
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="field">
                      Descripción
                      <input readOnly value={part?.name ?? ''} />
                    </label>
                    <label className="field">
                      Cant.
                      <input
                        type="number"
                        min={1}
                        value={line.quantity}
                        onChange={(e) =>
                          updateLine(line.key, {
                            quantity: Math.max(1, Number(e.target.value) || 1),
                          })
                        }
                      />
                    </label>
                    <label className="field">
                      PVP
                      <input
                        type="number"
                        min={0}
                        step="0.01"
                        value={line.unitPrice}
                        onChange={(e) =>
                          updateLine(line.key, {
                            unitPrice: Number(e.target.value) || 0,
                          })
                        }
                      />
                    </label>
                    <button
                      type="button"
                      className="btn ghost"
                      aria-label="Quitar línea"
                      onClick={() =>
                        setLines((prev) =>
                          prev.length === 1
                            ? prev
                            : prev.filter((l) => l.key !== line.key),
                        )
                      }
                    >
                      Quitar
                    </button>
                  </div>
                )
              })
            )}
          </div>

          <div className="totals">
            <span className="muted">Base imponible</span>
            <strong>{money(previewTotal)}</strong>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn">
              Guardar borrador
            </button>
          </div>
        </form>
      </>
    )
  }

  if (mode === 'detail' && selected) {
    return (
      <>
        <header className="page-head">
          <div>
            <h1>{selected.number}</h1>
            <p>
              {selected.customerName} · {dateEs(selected.date)}
            </p>
          </div>
          <div className="toolbar" style={{ margin: 0 }}>
            <button type="button" className="btn secondary" onClick={() => setMode('list')}>
              Listado
            </button>
            {selected.status === 'borrador' && (
              <>
                <button type="button" className="btn secondary" onClick={() => startEdit(selected)}>
                  Editar
                </button>
                <button type="button" className="btn" onClick={() => onEmit(selected.id)}>
                  Emitir y descontar stock
                </button>
                <button
                  type="button"
                  className="btn danger"
                  onClick={() => onDeleteDraft(selected.id)}
                >
                  Borrar borrador
                </button>
              </>
            )}
            {selected.status === 'emitida' && (
              <button type="button" className="btn danger" onClick={() => onVoid(selected.id)}>
                Anular
              </button>
            )}
          </div>
        </header>
        {message && <div className={`flash ${message.type}`}>{message.text}</div>}
        <section className="panel">
          <div className="panel-head">
            <h2>Detalle</h2>
            <StatusBadge status={selected.status} />
          </div>
          <div className="table-wrap">
            <table className="data">
              <thead>
                <tr>
                  <th>Referencia</th>
                  <th>Descripción</th>
                  <th>Cant.</th>
                  <th>PVP</th>
                  <th>Importe</th>
                </tr>
              </thead>
              <tbody>
                {selected.lines.map((line) => (
                  <tr key={line.id}>
                    <td className="ref">{line.reference}</td>
                    <td>{line.description}</td>
                    <td>{qty(line.quantity)}</td>
                    <td>{money(line.unitPrice)}</td>
                    <td>{money(line.quantity * line.unitPrice)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {selected.notes && (
            <p style={{ padding: '0.75rem 1rem' }} className="muted">
              {selected.notes}
            </p>
          )}
          <div className="totals">
            <span className="muted">Total</span>
            <strong>{money(invoiceTotal(selected.lines))}</strong>
          </div>
        </section>
      </>
    )
  }

  return (
    <>
      <header className="page-head">
        <div>
          <h1>Facturas</h1>
          <p>Borrador → emisión con descuento de stock → anulación con devolución.</p>
        </div>
        <button type="button" className="btn" onClick={startNew} disabled={customers.length === 0}>
          Nueva factura
        </button>
      </header>

      {message && <div className={`flash ${message.type}`}>{message.text}</div>}

      <div className="toolbar">
        <input
          className="search"
          type="search"
          placeholder="Buscar nº, cliente o estado…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Buscar facturas"
        />
      </div>

      <section className="panel">
        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th>Nº</th>
                <th>Fecha</th>
                <th>Cliente</th>
                <th>Estado</th>
                <th>Líneas</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <p className="empty">No hay facturas.</p>
                  </td>
                </tr>
              ) : (
                filtered.map((inv) => (
                  <tr
                    key={inv.id}
                    className="clickable"
                    tabIndex={0}
                    onClick={() => openDetail(inv)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        openDetail(inv)
                      }
                    }}
                  >
                    <td className="ref">{inv.number}</td>
                    <td>{dateEs(inv.date)}</td>
                    <td>{inv.customerName}</td>
                    <td>
                      <StatusBadge status={inv.status} />
                    </td>
                    <td>{qty(inv.lines.length)}</td>
                    <td>{money(invoiceTotal(inv.lines))}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    borrador: 'neutral',
    emitida: 'ok',
    anulada: 'danger',
  }
  return <span className={`badge ${map[status] ?? 'neutral'}`}>{status}</span>
}
