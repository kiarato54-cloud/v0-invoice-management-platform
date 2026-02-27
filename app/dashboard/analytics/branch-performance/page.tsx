"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface BranchMetrics {
  name: string
  revenue: number
  transactions: number
  avgTransaction: number
  growth: number
  topProduct: string
  staffCount: number
}

const branchMetrics: BranchMetrics[] = [
  {
    name: "Main Branch",
    revenue: 2100000,
    transactions: 142,
    avgTransaction: 14789,
    growth: 12.5,
    topProduct: "Cement 50kg",
    staffCount: 8,
  },
  {
    name: "Downtown Branch",
    revenue: 1800000,
    transactions: 128,
    avgTransaction: 14062,
    growth: 8.2,
    topProduct: "Iron Sheets",
    staffCount: 6,
  },
  {
    name: "Suburban Branch",
    revenue: 1300000,
    transactions: 72,
    avgTransaction: 18056,
    growth: 15.3,
    topProduct: "Paint 5L",
    staffCount: 4,
  },
]

export default function BranchPerformancePage() {
  const { user } = useAuth()

  if (!user) return null

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Branch Performance</h1>
          <p className="text-muted-foreground mt-1">Compare performance metrics across all branches</p>
        </div>

        {/* Branch Comparison */}
        <div className="space-y-4">
          {branchMetrics.map((branch, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{branch.name}</CardTitle>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Revenue</p>
                    <p className="text-lg font-bold">Tshs {(branch.revenue / 1000000).toFixed(1)}M</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Transactions</p>
                    <p className="text-lg font-bold">{branch.transactions}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Avg Transaction</p>
                    <p className="text-lg font-bold">Tshs {(branch.avgTransaction / 1000).toFixed(0)}K</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Growth</p>
                    <p className={`text-lg font-bold ${branch.growth > 0 ? "text-green-600" : "text-red-600"}`}>
                      {branch.growth > 0 ? "+" : ""}
                      {branch.growth}%
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Top Product</p>
                    <p className="text-lg font-bold text-primary">{branch.topProduct}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Staff</p>
                    <p className="text-lg font-bold">{branch.staffCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
