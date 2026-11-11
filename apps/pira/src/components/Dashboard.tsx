import { invoiceTotal, money, qty } from '../lib/format'
import { useStore } from '../lib/useStore'
import type { View } from '../App'

type Props = {
  onNavigate: (view: View) => void
}

export function Dashboard({ onNavigate }: Props) {
  const { parts, invoices } = useStore()
  const lowStock = parts.filter((p) => p.stock <= p.minStock)
  const zeroStock = parts.filter((p) => p.stock === 0)
  const drafts = invoices.filter((i) => i.status === 'borrador')
  const emitted = invoices.filter((i) => i.status === 'emitida')
  const sales = emitted.reduce((sum, inv) => sum + invoiceTotal(inv.lines), 0)
  const recent = [...invoices].slice(0, 5)

  return (
    <>
      <header className="page-head">
        <div>
          <h1>Panel de almacén</h1>
          <p>
            Stock crítico, borradores pendientes y facturación reciente — el
            mostrador de un día de trabajo.
          </p>
        </div>
        <div className="toolbar" style={{ margin: 0 }}>
          <button type="button" className="btn secondary" onClick={() => onNavigate('parts')}>
            Ver recambios
          </button>
          <button type="button" className="btn" onClick={() => onNavigate('invoices')}>
            Nueva factura
          </button>
        </div>
      </header>

      <section className="stats" aria-label="Indicadores">
        <div className="stat">
          <div className="label">Referencias</div>
          <div className="value">{qty(parts.length)}</div>
        </div>
        <div className="stat">
          <div className="label">Stock bajo</div>
          <div className="value">{qty(lowStock.length)}</div>
        </div>
        <div className="stat">
          <div className="label">Sin stock</div>
          <div className="value">{qty(zeroStock.length)}</div>
        </div>
        <div className="stat">
          <div className="label">Facturado (emitidas)</div>
          <div className="value">{money(sales)}</div>
        </div>
        <div className="stat">
          <div className="label">Borradores</div>
          <div className="value">{qty(drafts.length)}</div>
        </div>
      </section>

      <div className="split">
        <section className="panel">
          <div className="panel-head">
            <h2>Alertas de stock</h2>
            <button type="button" className="btn ghost" onClick={() => onNavigate('parts')}>
              Gestionar
            </button>
          </div>
          {lowStock.length === 0 ? (
            <p className="empty">Ningún recambio por debajo del mínimo.</p>
          ) : (
            <div className="table-wrap">
              <table className="data">
                <thead>
                  <tr>
                    <th>Referencia</th>
                    <th>Nombre</th>
                    <th>Stock</th>
                    <th>Mín.</th>
                  </tr>
                </thead>
                <tbody>
                  {lowStock.map((part) => (
                    <tr key={part.id}>
                      <td className="ref">{part.reference}</td>
                      <td>{part.name}</td>
                      <td>
                        <span className={`badge ${part.stock === 0 ? 'danger' : 'warn'}`}>
                          {qty(part.stock)}
                        </span>
                      </td>
                      <td className="muted">{qty(part.minStock)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="panel">
          <div className="panel-head">
            <h2>Últimas facturas</h2>
            <button type="button" className="btn ghost" onClick={() => onNavigate('invoices')}>
              Ver todas
            </button>
          </div>
          <div className="table-wrap">
            <table className="data">
              <thead>
                <tr>
                  <th>Nº</th>
                  <th>Cliente</th>
                  <th>Estado</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((inv) => (
                  <tr key={inv.id}>
                    <td className="ref">{inv.number}</td>
                    <td>{inv.customerName}</td>
                    <td>
                      <StatusBadge status={inv.status} />
                    </td>
                    <td>{money(invoiceTotal(inv.lines))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
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
