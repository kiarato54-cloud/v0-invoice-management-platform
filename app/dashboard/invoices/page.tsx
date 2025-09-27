"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { InvoiceList } from "@/components/invoice-list"
import { InvoiceStatsSummary } from "@/components/invoice-stats-summary"
import { useAuth } from "@/components/auth-provider"

export default function InvoicesPage() {
  const { user } = useAuth()

  if (!user) {
    return null
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Invoice Management</h1>
            <p className="text-muted-foreground">
              {user.role === "sales_officer"
                ? "Manage your invoices and track customer payments"
                : "View and manage all invoices in the system"}
            </p>
          </div>
        </div>
        <InvoiceStatsSummary />
        <InvoiceList />
      </div>
    </DashboardLayout>
  )
}
