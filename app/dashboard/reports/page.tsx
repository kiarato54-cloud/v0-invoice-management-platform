"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { FinancialSummary } from "@/components/financial-summary"
import { RevenueChart } from "@/components/revenue-chart"
import { InvoiceStatusChart } from "@/components/invoice-status-chart"
import { TopCustomersChart } from "@/components/top-customers-chart"
import { useAuth } from "@/components/auth-provider"
import { hasPermission } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ReportsPage() {
  const { user } = useAuth()

  if (!user || !hasPermission(user, "view_reports")) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
          <p className="text-muted-foreground">You don't have permission to view reports.</p>
        </div>
      </DashboardLayout>
    )
  }

  const handleExportReport = () => {
    // In a real application, this would generate and download a PDF or Excel report
    alert("Export functionality would be implemented here")
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Reports & Analytics</h1>
            <p className="text-muted-foreground">Comprehensive business insights and financial analytics</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExportReport}>
              Export Report
            </Button>
            <Button variant="outline">
              <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Refresh Data
            </Button>
          </div>
        </div>

        {/* Financial Summary */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Financial Overview</h2>
          <FinancialSummary />
        </div>

        {/* Charts Section */}
        <div className="grid gap-6 lg:grid-cols-2">
          <RevenueChart />
          <InvoiceStatusChart />
        </div>

        {/* Additional Analytics */}
        <div className="grid gap-6 lg:grid-cols-2">
          <TopCustomersChart />
          <Card>
            <CardHeader>
              <CardTitle>Business Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <h3 className="font-semibold text-blue-700 dark:text-blue-400 mb-2">Revenue Trend</h3>
                  <p className="text-sm text-muted-foreground">
                    Monitor your monthly revenue patterns to identify seasonal trends and growth opportunities.
                  </p>
                </div>
                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <h3 className="font-semibold text-green-700 dark:text-green-400 mb-2">Collection Efficiency</h3>
                  <p className="text-sm text-muted-foreground">
                    Track your payment collection rate to optimize cash flow and identify potential issues.
                  </p>
                </div>
                <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                  <h3 className="font-semibold text-orange-700 dark:text-orange-400 mb-2">Customer Analysis</h3>
                  <p className="text-sm text-muted-foreground">
                    Focus on your top customers to build stronger relationships and increase repeat business.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
