export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
}

export interface InvoiceItem {
  id: string
  name: string
  description: string
  quantity: number
  unitPrice: number
  total: number
}

export interface Invoice {
  id: string
  invoiceNumber: string
  customerId: string
  customer: Customer
  items: InvoiceItem[]
  subtotal: number
  tax: number
  total: number
  status: "draft" | "sent" | "paid" | "overdue"
  createdBy: string
  createdAt: string
  dueDate: string
  notes?: string
}

// Mock data
export const mockCustomers: Customer[] = [
  {
    id: "1",
    name: "ABC Construction Ltd",
    email: "contact@abcconstruction.com",
    phone: "+1-555-0123",
    address: "123 Builder Street",
    city: "Construction City",
    state: "CA",
    zipCode: "90210",
  },
  {
    id: "2",
    name: "XYZ Hardware Store",
    email: "orders@xyzhardware.com",
    phone: "+1-555-0456",
    address: "456 Hardware Ave",
    city: "Tool Town",
    state: "TX",
    zipCode: "75001",
  },
]

export const mockInvoices: Invoice[] = [
  {
    id: "1",
    invoiceNumber: "INV-2024-001",
    customerId: "1",
    customer: mockCustomers[0],
    items: [
      {
        id: "1",
        name: "Steel Bolts",
        description: "M12 x 50mm Steel Bolts",
        quantity: 100,
        unitPrice: 2.5,
        total: 250.0,
      },
      {
        id: "2",
        name: "Washers",
        description: "M12 Steel Washers",
        quantity: 100,
        unitPrice: 0.25,
        total: 25.0,
      },
    ],
    subtotal: 275.0,
    tax: 27.5,
    total: 302.5,
    status: "sent",
    createdBy: "3",
    createdAt: "2024-01-15",
    dueDate: "2024-02-15",
    notes: "Net 30 payment terms",
  },
]

export const getInvoices = (): Invoice[] => {
  const stored = localStorage.getItem("invoices")
  return stored ? JSON.parse(stored) : mockInvoices
}

export const saveInvoice = (invoice: Invoice): void => {
  const invoices = getInvoices()
  const existingIndex = invoices.findIndex((inv) => inv.id === invoice.id)

  if (existingIndex >= 0) {
    invoices[existingIndex] = invoice
  } else {
    invoices.push(invoice)
  }

  localStorage.setItem("invoices", JSON.stringify(invoices))
}

export const getCustomers = (): Customer[] => {
  const stored = localStorage.getItem("customers")
  return stored ? JSON.parse(stored) : mockCustomers
}
