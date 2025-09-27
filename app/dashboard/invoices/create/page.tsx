"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { InvoiceForm } from "@/components/invoice-form"
import { useAuth } from "@/components/auth-provider"
import { hasPermission } from "@/lib/auth"

export default function CreateInvoicePage() {
  const { user } = useAuth()

  if (!user || !hasPermission(user, "create_invoice")) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
          <p className="text-muted-foreground">You don't have permission to create invoices.</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Create New Invoice</h1>
          <p className="text-muted-foreground">Fill in the details below to create a new invoice.</p>
        </div>
        <InvoiceForm />
      </div>
    </DashboardLayout>
  )
}
