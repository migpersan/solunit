export type Part = {
  id: string
  reference: string
  name: string
  brand: string
  family: string
  location: string
  stock: number
  minStock: number
  cost: number
  price: number
  notes: string
  updatedAt: string
}

export type Customer = {
  id: string
  name: string
  taxId: string
  email: string
  phone: string
}

export type InvoiceStatus = 'borrador' | 'emitida' | 'anulada'

export type InvoiceLine = {
  id: string
  partId: string
  reference: string
  description: string
  quantity: number
  unitPrice: number
}

export type Invoice = {
  id: string
  number: string
  customerId: string
  customerName: string
  date: string
  status: InvoiceStatus
  lines: InvoiceLine[]
  notes: string
  createdAt: string
}

export type StockMovement = {
  id: string
  partId: string
  delta: number
  reason: string
  invoiceId?: string
  createdAt: string
}

export type AppData = {
  parts: Part[]
  customers: Customer[]
  invoices: Invoice[]
  movements: StockMovement[]
  nextInvoiceSeq: number
}
