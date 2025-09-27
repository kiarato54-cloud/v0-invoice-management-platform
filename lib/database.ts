import { createClient } from "@/lib/supabase/server"
import { createClient as createBrowserClient } from "@/lib/supabase/client"

export interface User {
  id: string
  email: string
  name: string
  role: "admin" | "managing_director" | "sales_officer" | "storekeeper"
  created_at: string
  updated_at: string
}

export interface Customer {
  id: string
  name: string
  email?: string
  phone?: string
  address?: string
  created_by: string
  created_at: string
  updated_at: string
}

export interface Invoice {
  id: string
  invoice_number: string
  customer_id: string
  created_by: string
  status: "draft" | "pending" | "paid" | "overdue" | "cancelled"
  subtotal: number
  tax_amount: number
  total_amount: number
  due_date?: string
  notes?: string
  created_at: string
  updated_at: string
  customer?: Customer
  items?: InvoiceItem[]
}

export interface InvoiceItem {
  id: string
  invoice_id: string
  description: string
  quantity: number
  unit_price: number
  total_price: number
  created_at: string
}

// Server-side database functions
export async function getCurrentUser(): Promise<User | null> {
  const supabase = await createClient()

  const {
    data: { user: authUser },
    error: authError,
  } = await supabase.auth.getUser()
  if (authError || !authUser) return null

  const { data: user, error } = await supabase.from("users").select("*").eq("id", authUser.id).single()

  if (error) return null
  return user
}

export async function getInvoices(): Promise<Invoice[]> {
  const supabase = await createClient()

  const { data: invoices, error } = await supabase
    .from("invoices")
    .select(`
      *,
      customer:customers(*),
      items:invoice_items(*)
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching invoices:", error)
    return []
  }

  return invoices || []
}

export async function getCustomers(): Promise<Customer[]> {
  const supabase = await createClient()

  const { data: customers, error } = await supabase.from("customers").select("*").order("name")

  if (error) {
    console.error("Error fetching customers:", error)
    return []
  }

  return customers || []
}

export async function createInvoice(
  invoiceData: Partial<Invoice>,
  items: Partial<InvoiceItem>[],
): Promise<Invoice | null> {
  const supabase = await createClient()

  // Generate invoice number
  const invoiceNumber = `INV-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`

  const { data: invoice, error: invoiceError } = await supabase
    .from("invoices")
    .insert({
      ...invoiceData,
      invoice_number: invoiceNumber,
    })
    .select()
    .single()

  if (invoiceError) {
    console.error("Error creating invoice:", invoiceError)
    return null
  }

  // Insert invoice items
  if (items.length > 0) {
    const { error: itemsError } = await supabase.from("invoice_items").insert(
      items.map((item) => ({
        ...item,
        invoice_id: invoice.id,
      })),
    )

    if (itemsError) {
      console.error("Error creating invoice items:", itemsError)
    }
  }

  return invoice
}

export async function updateInvoiceStatus(invoiceId: string, status: Invoice["status"]): Promise<boolean> {
  const supabase = await createClient()

  const { error } = await supabase
    .from("invoices")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", invoiceId)

  if (error) {
    console.error("Error updating invoice status:", error)
    return false
  }

  return true
}

// Client-side database functions
export function createClientDatabase() {
  const supabase = createBrowserClient()

  return {
    async getCurrentUser(): Promise<User | null> {
      const {
        data: { user: authUser },
        error: authError,
      } = await supabase.auth.getUser()
      if (authError || !authUser) return null

      const { data: user, error } = await supabase.from("users").select("*").eq("id", authUser.id).single()

      if (error) return null
      return user
    },

    async getInvoices(): Promise<Invoice[]> {
      const { data: invoices, error } = await supabase
        .from("invoices")
        .select(`
          *,
          customer:customers(*),
          items:invoice_items(*)
        `)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching invoices:", error)
        return []
      }

      return invoices || []
    },

    async getCustomers(): Promise<Customer[]> {
      const { data: customers, error } = await supabase.from("customers").select("*").order("name")

      if (error) {
        console.error("Error fetching customers:", error)
        return []
      }

      return customers || []
    },

    async createCustomer(customerData: Partial<Customer>): Promise<Customer | null> {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser()
      if (authError || !user) return null

      const { data: customer, error } = await supabase
        .from("customers")
        .insert({
          ...customerData,
          created_by: user.id,
        })
        .select()
        .single()

      if (error) {
        console.error("Error creating customer:", error)
        return null
      }

      return customer
    },

    async updateInvoiceStatus(invoiceId: string, status: Invoice["status"]): Promise<boolean> {
      const { error } = await supabase
        .from("invoices")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", invoiceId)

      if (error) {
        console.error("Error updating invoice status:", error)
        return false
      }

      return true
    },

    supabase,
  }
}
