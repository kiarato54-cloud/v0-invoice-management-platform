"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface InventoryInsight {
  name: string
  sku: string
  currentStock: number
  reorderLevel: number
  statusColor: string
  daysToStockOut: number
  avgDailySales: number
}

const inventoryInsights: InventoryInsight[] = [
  {
    name: "Cement 50kg",
    sku: "CMT-001",
    currentStock: 5,
    reorderLevel: 10,
    statusColor: "bg-red-500/20 text-red-700",
    daysToStockOut: 2,
    avgDailySales: 2.5,
  },
  {
    name: "Iron Sheets",
    sku: "IRS-001",
    currentStock: 45,
    reorderLevel: 20,
    statusColor: "bg-green-500/20 text-green-700",
    daysToStockOut: 18,
    avgDailySales: 2.5,
  },
  {
    name: "Paint 5L",
    sku: "PAT-001",
    currentStock: 12,
    reorderLevel: 15,
    statusColor: "bg-yellow-500/20 text-yellow-700",
    daysToStockOut: 5,
    avgDailySales: 2.4,
  },
]

export default function InventoryInsightsPage() {
  const { user } = useAuth()

  if (!user) return null

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Inventory Insights</h1>
          <p className="text-muted-foreground mt-1">Stock analysis and reorder recommendations</p>
        </div>

        {/* Inventory Overview Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Critical Stock</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">12</div>
              <p className="text-xs text-muted-foreground mt-1">Products below reorder level</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Inventory Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Tshs 45.2M</div>
              <p className="text-xs text-muted-foreground mt-1">Total stock value</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Inventory Turnover</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8.5x</div>
              <p className="text-xs text-muted-foreground mt-1">Per month</p>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Insights Table */}
        <Card>
          <CardHeader>
            <CardTitle>Reorder Recommendations</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-secondary/50 border-b border-border">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">Product</th>
                    <th className="px-4 py-3 text-right font-medium">Current Stock</th>
                    <th className="px-4 py-3 text-right font-medium">Reorder Level</th>
                    <th className="px-4 py-3 text-right font-medium">Avg Daily Sales</th>
                    <th className="px-4 py-3 text-right font-medium">Days to Stockout</th>
                    <th className="px-4 py-3 text-center font-medium">Status</th>
                    <th className="px-4 py-3 text-center font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {inventoryInsights.map((item, i) => (
                    <tr key={i} className="border-b border-border hover:bg-secondary/30">
                      <td className="px-4 py-3 font-medium">{item.name}</td>
                      <td className="px-4 py-3 text-right">{item.currentStock}</td>
                      <td className="px-4 py-3 text-right text-muted-foreground">{item.reorderLevel}</td>
                      <td className="px-4 py-3 text-right text-muted-foreground">{item.avgDailySales}</td>
                      <td className="px-4 py-3 text-right font-medium">{item.daysToStockOut}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2 py-1 rounded-md text-xs font-medium ${item.statusColor}`}>
                          {item.daysToStockOut <= 2 ? "CRITICAL" : item.daysToStockOut <= 7 ? "LOW" : "OK"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Button size="sm" variant="outline">
                          Reorder
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
