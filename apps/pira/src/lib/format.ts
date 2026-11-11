export function money(value: number): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
  }).format(value)
}

export function qty(value: number): string {
  return new Intl.NumberFormat('es-ES').format(value)
}

export function dateEs(value: string): string {
  if (!value) return '—'
  const d = new Date(value.includes('T') ? value : `${value}T12:00:00`)
  if (Number.isNaN(d.getTime())) return value
  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(d)
}

export function invoiceTotal(
  lines: { quantity: number; unitPrice: number }[],
): number {
  return lines.reduce((sum, line) => sum + line.quantity * line.unitPrice, 0)
}

export function uid(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}_${Date.now().toString(36)}`
}
