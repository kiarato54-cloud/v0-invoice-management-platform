import { createClient } from "./supabase/client"

export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
  paymentMethod?: string
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
  id?: string // ← Change to optional with ?
  invoiceNumber: string
  customerId: string
  customer: Customer
  items: InvoiceItem[]
  subtotal: number
  tax: number  // This maps to tax_amount in database
  total: number  // This maps to total_amount in database
  status: "draft" | "sent" | "paid" | "overdue"
  createdBy: string
  createdAt: string
  dueDate: string
  notes?: string
  storeKeeperName?: string  // This maps to store_keeper_name in database
  salesOfficerName?: string
  driverName?: string
  vehiclePlateNumber?: string
}

export const getInvoices = async (): Promise<Invoice[]> => {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("invoices")
    .select(`
      *,
      customer:customers(*),
      items:invoice_items(*)
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("[v0] Error fetching invoices:", error)
    return []
  }

  return data.map((inv: any) => ({
    id: inv.id,
    invoiceNumber: inv.invoice_number,
    customerId: inv.customer_id,
    customer: {
      id: inv.customer.id,
      name: inv.customer.name,
      email: inv.customer.email,
      phone: inv.customer.phone,
      address: inv.customer.address,
      city: inv.customer.city,
      state: inv.customer.state,
      zipCode: inv.customer.zip_code,
      paymentMethod: inv.customer.payment_method,
    },
    items: inv.items.map((item: any) => ({
      id: item.id,
      name: item.description,    // ✅ Use description as name
      description: item.description,
      quantity: item.quantity,
      unitPrice: item.unit_price,
      total: item.total_price,   // ✅ Use total_price
    })),
    subtotal: inv.subtotal,
    tax: inv.tax_amount,  // ✅ Fixed: use tax_amount from database
    total: inv.total_amount,  // ✅ Fixed: use total_amount from database
    status: inv.status,
    createdBy: inv.user_id,
    createdAt: inv.created_at,
    dueDate: inv.due_date,
    notes: inv.notes,
    storeKeeperName: inv.store_keeper_name,  // ✅ Fixed: store_keeper_name (with underscore)
    salesOfficerName: inv.sales_officer_name,
    driverName: inv.driver_name,
    vehiclePlateNumber: inv.vehicle_plate_number,
  }))
}

export const saveInvoice = async (invoice: Invoice): Promise<void> => {
  const supabase = createClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("User not authenticated")

  // ✅ FIX: Include the ID in upsert for updates
  const upsertData: any = {
    invoice_number: invoice.invoiceNumber,
    customer_id: invoice.customerId,
    user_id: user.id,
    created_by: user.id,
    subtotal: invoice.subtotal,
    tax_amount: invoice.tax,
    total_amount: invoice.total,
    status: invoice.status,
    due_date: invoice.dueDate,
    notes: invoice.notes,
    store_keeper_name: invoice.storeKeeperName,
    sales_officer_name: invoice.salesOfficerName,
    driver_name: invoice.driverName,
    vehicle_plate_number: invoice.vehiclePlateNumber,
  }

  // ✅ CRITICAL: Add ID if it exists (for updates)
  if (invoice.id) {
    upsertData.id = invoice.id
  }

  // Insert or update invoice - USE CORRECT COLUMN NAMES
  const { data: invoiceData, error: invoiceError } = await supabase
    .from("invoices")
    .upsert(upsertData) // ✅ Now includes ID for updates
    .select()
    .single()

  if (invoiceError) {
    console.error("[v0] Error saving invoice:", invoiceError)
    throw invoiceError
  }

  // ✅ Add safety check - make sure invoiceData exists
  if (!invoiceData || !invoiceData.id) {
    throw new Error("Invoice was not created - no data returned")
  }

  // Use the ACTUAL invoice ID returned from the database
  const savedInvoiceId = invoiceData.id

  // Delete existing items and insert new ones using the REAL invoice ID
  await supabase.from("invoice_items").delete().eq("invoice_id", savedInvoiceId)

  if (invoice.items.length > 0) {
    const { error: itemsError } = await supabase.from("invoice_items").insert(
      invoice.items.map((item) => ({
        invoice_id: savedInvoiceId, // ✅ Use the real database-generated ID
        description: item.name,
        quantity: item.quantity,
        unit_price: item.unitPrice,
        total_price: item.total,
      })),
    )

    if (itemsError) {
      console.error("[v0] Error saving invoice items:", itemsError)
      throw itemsError
    }
  }
}

export const getCustomers = async (): Promise<Customer[]> => {
  const supabase = createClient()

  const { data, error } = await supabase.from("customers").select("*").order("name", { ascending: true })

  if (error) {
    console.error("[v0] Error fetching customers:", error)
    return []
  }

  return data.map((customer: any) => ({
    id: customer.id,
    name: customer.name,
    email: customer.email,
    phone: customer.phone,
    address: customer.address,
    city: customer.city,
    state: customer.state,
    zipCode: customer.zip_code,
    paymentMethod: customer.payment_method,
  }))
}

export const saveCustomer = async (customer: Customer): Promise<void> => {
  const supabase = createClient()

  // Get current user for created_by
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("User not authenticated")

  const { error } = await supabase.from("customers").upsert({
    id: customer.id,
    name: customer.name,
    email: customer.email,
    phone: customer.phone,
    address: customer.address,
    city: customer.city,
    state: customer.state,
    zip_code: customer.zipCode,
    created_by: user.id,  // ← ADD THIS LINE
    // Remove this line if payment_method doesn't exist:
    // payment_method: customer.paymentMethod,
  })

  if (error) {
    console.error("[v0] Error saving customer:", error)
    throw error
  }
}
