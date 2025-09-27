"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { DashboardStats } from "@/components/dashboard-stats"
import { RecentInvoices } from "@/components/recent-invoices"
import { useAuth } from "@/components/auth-provider"

export default function DashboardPage() {
  const { user } = useAuth()

  if (!user) return null

  const getRoleSpecificContent = () => {
    switch (user.role) {
      case "admin":
        return (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">System Overview</h2>
            <p className="text-muted-foreground">
              Complete access to all system features including user management, reports, and invoice oversight.
            </p>
          </div>
        )
      case "managing_director":
        return (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Executive Dashboard</h2>
            <p className="text-muted-foreground">
              Monitor business performance, review reports, and oversee all invoice activities.
            </p>
          </div>
        )
      case "sales_officer":
        return (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Sales Dashboard</h2>
            <p className="text-muted-foreground">
              Create and manage your invoices, track customer payments, and monitor your sales performance.
            </p>
          </div>
        )
      case "storekeeper":
        return (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Inventory Overview</h2>
            <p className="text-muted-foreground">
              View invoice details and track inventory movements based on sales activities.
            </p>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {getRoleSpecificContent()}
        <DashboardStats />
        <div className="grid gap-6 lg:grid-cols-2">
          <RecentInvoices />
          <div className="space-y-4">
            <div className="grid gap-4">
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="font-semibold mb-2">Quick Actions</h3>
                <div className="space-y-2">
                  {(user.role === "admin" || user.role === "sales_officer") && (
                    <a
                      href="/dashboard/invoices/create"
                      className="block p-3 bg-primary/5 border border-primary/20 rounded-md hover:bg-primary/10 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <span className="text-sm font-medium">Create New Invoice</span>
                      </div>
                    </a>
                  )}
                  <a
                    href="/dashboard/invoices"
                    className="block p-3 bg-secondary/50 border border-border rounded-md hover:bg-secondary transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <span className="text-sm font-medium">View All Invoices</span>
                    </div>
                  </a>
                  {(user.role === "admin" || user.role === "managing_director") && (
                    <a
                      href="/dashboard/reports"
                      className="block p-3 bg-secondary/50 border border-border rounded-md hover:bg-secondary transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                          />
                        </svg>
                        <span className="text-sm font-medium">View Reports</span>
                      </div>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
