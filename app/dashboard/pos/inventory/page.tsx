"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"
import { useInventory } from "@/lib/hooks/useInventory"
import { useBranches } from "@/lib/hooks/useBranches"

const statusColors = {
  critical: "bg-red-500/20 text-red-700 border-red-500/50",
  low: "bg-yellow-500/20 text-yellow-700 border-yellow-500/50",
  adequate: "bg-green-500/20 text-green-700 border-green-500/50",
  high: "bg-blue-500/20 text-blue-700 border-blue-500/50",
}

export default function InventoryPage() {
  const { user } = useAuth()
  const { branches } = useBranches()
  const [selectedBranch, setSelectedBranch] = useState(branches[0]?.id || "")
  const { inventory } = useInventory(selectedBranch)

  if (!user) return null

  const getStatus = (item: any) => {
    const ratio = item.quantity_on_hand / item.reorder_level
    if (ratio <= 0) return "critical"
    if (ratio <= 1) return "low"
    if (ratio <= 2) return "adequate"
    return "high"
  }

  const stats = {
    lowStock: inventory.filter((i) => {
      const status = getStatus(i)
      return status === "critical" || status === "low"
    }).length,
    totalItems: inventory.length,
    averageStock:
      inventory.length > 0
        ? Math.round(inventory.reduce((sum, i) => sum + i.quantity_on_hand, 0) / inventory.length)
        : 0,
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Inventory Management</h1>
            <p className="text-muted-foreground mt-1">Monitor stock levels across branches</p>
          </div>
          <Button>
            <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Sync Inventory
          </Button>
        </div>

        {/* Statistics */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Low Stock Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">{stats.lowStock}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalItems}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Avg Stock Level</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageStock} units</div>
            </CardContent>
          </Card>
        </div>

        {/* Branch Filter */}
        <div>
          <label className="block text-sm font-medium mb-2">Filter by Branch</label>
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="px-4 py-2 rounded-md bg-input border border-border w-full md:w-48"
          >
            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.name}
              </option>
            ))}
          </select>
        </div>

        {/* Inventory Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-secondary/50 border-b border-border">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">Product</th>
                    <th className="px-4 py-3 text-left font-medium">SKU</th>
                    <th className="px-4 py-3 text-right font-medium">On Hand</th>
                    <th className="px-4 py-3 text-right font-medium">Reorder Level</th>
                    <th className="px-4 py-3 text-right font-medium">Unit Price</th>
                    <th className="px-4 py-3 text-center font-medium">Status</th>
                    <th className="px-4 py-3 text-center font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {inventory.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                        No inventory data available for this branch
                      </td>
                    </tr>
                  ) : (
                    inventory.map((item) => {
                      const status = getStatus(item)
                      return (
                        <tr key={item.id} className="border-b border-border hover:bg-secondary/30">
                          <td className="px-4 py-3 font-medium">{item.product_name}</td>
                          <td className="px-4 py-3 text-muted-foreground">{item.sku}</td>
                          <td className="px-4 py-3 text-right font-medium">{item.quantity_on_hand}</td>
                          <td className="px-4 py-3 text-right text-muted-foreground">{item.reorder_level}</td>
                          <td className="px-4 py-3 text-right text-muted-foreground">
                            Ksh {item.unit_price?.toLocaleString() || "N/A"}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span
                              className={`px-2 py-1 rounded-md text-xs font-medium border ${statusColors[status as keyof typeof statusColors]}`}
                            >
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <Button variant="ghost" size="sm">
                              Adjust
                            </Button>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
