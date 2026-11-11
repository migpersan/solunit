import { seedData } from '../data/seed'
import type {
  AppData,
  Customer,
  Invoice,
  InvoiceLine,
  Part,
  StockMovement,
} from './types'
import { uid } from './format'

const STORAGE_KEY = 'pira.v1'

type Listener = () => void

let data: AppData = load()
const listeners = new Set<Listener>()

function load(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return seedData()
    const parsed = JSON.parse(raw) as AppData
    if (!parsed.parts || !parsed.invoices || !parsed.customers) return seedData()
    return parsed
  } catch {
    return seedData()
  }
}

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  listeners.forEach((l) => l())
}

export function getData(): AppData {
  return data
}

export function subscribe(listener: Listener): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function resetDemoData() {
  data = seedData()
  persist()
}

export function upsertPart(input: Omit<Part, 'updatedAt'> & { updatedAt?: string }) {
  const next: Part = {
    ...input,
    updatedAt: new Date().toISOString(),
  }
  const idx = data.parts.findIndex((p) => p.id === next.id)
  if (idx >= 0) data.parts[idx] = next
  else data.parts = [next, ...data.parts]
  persist()
  return next
}

export function deletePart(id: string) {
  const used = data.invoices.some(
    (inv) =>
      inv.status !== 'anulada' && inv.lines.some((line) => line.partId === id),
  )
  if (used) {
    throw new Error(
      'No se puede eliminar: el recambio aparece en facturas. Anúlalo o deja stock a 0.',
    )
  }
  data.parts = data.parts.filter((p) => p.id !== id)
  data.movements = data.movements.filter((m) => m.partId !== id)
  persist()
}

export function adjustStock(partId: string, delta: number, reason: string) {
  const part = data.parts.find((p) => p.id === partId)
  if (!part) throw new Error('Recambio no encontrado')
  const nextStock = part.stock + delta
  if (nextStock < 0) throw new Error('Stock insuficiente')
  part.stock = nextStock
  part.updatedAt = new Date().toISOString()
  const movement: StockMovement = {
    id: uid('mov'),
    partId,
    delta,
    reason,
    createdAt: new Date().toISOString(),
  }
  data.movements = [movement, ...data.movements]
  persist()
  return part
}

export function upsertCustomer(customer: Customer) {
  const idx = data.customers.findIndex((c) => c.id === customer.id)
  if (idx >= 0) data.customers[idx] = customer
  else data.customers = [customer, ...data.customers]
  persist()
  return customer
}

function applyStockForInvoice(invoice: Invoice, sign: 1 | -1) {
  for (const line of invoice.lines) {
    if (!line.partId || line.quantity <= 0) continue
    const part = data.parts.find((p) => p.id === line.partId)
    if (!part) continue
    const delta = sign * line.quantity
    if (part.stock + delta < 0) {
      throw new Error(
        `Stock insuficiente de ${part.reference} (disponible: ${part.stock})`,
      )
    }
    part.stock += delta
    part.updatedAt = new Date().toISOString()
    data.movements = [
      {
        id: uid('mov'),
        partId: part.id,
        delta,
        reason:
          sign < 0
            ? `Factura ${invoice.number}`
            : `Anulación ${invoice.number}`,
        invoiceId: invoice.id,
        createdAt: new Date().toISOString(),
      },
      ...data.movements,
    ]
  }
}

export function saveInvoiceDraft(input: {
  id?: string
  customerId: string
  date: string
  notes: string
  lines: Omit<InvoiceLine, 'id'>[]
}): Invoice {
  const customer = data.customers.find((c) => c.id === input.customerId)
  if (!customer) throw new Error('Cliente no encontrado')
  if (input.lines.length === 0) throw new Error('Añade al menos una línea')

  const lines: InvoiceLine[] = input.lines.map((line) => ({
    ...line,
    id: uid('line'),
  }))

  if (input.id) {
    const existing = data.invoices.find((i) => i.id === input.id)
    if (!existing) throw new Error('Factura no encontrada')
    if (existing.status !== 'borrador') {
      throw new Error('Solo se editan borradores')
    }
    existing.customerId = customer.id
    existing.customerName = customer.name
    existing.date = input.date
    existing.notes = input.notes
    existing.lines = lines
    persist()
    return existing
  }

  const invoice: Invoice = {
    id: uid('inv'),
    number: `FAC-2026-${String(data.nextInvoiceSeq).padStart(4, '0')}`,
    customerId: customer.id,
    customerName: customer.name,
    date: input.date,
    status: 'borrador',
    lines,
    notes: input.notes,
    createdAt: new Date().toISOString(),
  }
  data.nextInvoiceSeq += 1
  data.invoices = [invoice, ...data.invoices]
  persist()
  return invoice
}

export function emitInvoice(id: string) {
  const invoice = data.invoices.find((i) => i.id === id)
  if (!invoice) throw new Error('Factura no encontrada')
  if (invoice.status !== 'borrador') throw new Error('La factura ya no es borrador')
  applyStockForInvoice(invoice, -1)
  invoice.status = 'emitida'
  persist()
  return invoice
}

export function voidInvoice(id: string) {
  const invoice = data.invoices.find((i) => i.id === id)
  if (!invoice) throw new Error('Factura no encontrada')
  if (invoice.status === 'anulada') return invoice
  if (invoice.status === 'emitida') applyStockForInvoice(invoice, 1)
  invoice.status = 'anulada'
  persist()
  return invoice
}

export function deleteDraftInvoice(id: string) {
  const invoice = data.invoices.find((i) => i.id === id)
  if (!invoice) throw new Error('Factura no encontrada')
  if (invoice.status !== 'borrador') {
    throw new Error('Solo se pueden borrar borradores')
  }
  data.invoices = data.invoices.filter((i) => i.id !== id)
  persist()
}
