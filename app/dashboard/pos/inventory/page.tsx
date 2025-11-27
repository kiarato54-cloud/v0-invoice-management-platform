"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"

interface InventoryItem {
  id: string
  productName: string
  sku: string
  branch: string
  quantityOnHand: number
  quantityReserved: number
  reorderLevel: number
  status: "critical" | "low" | "adequate" | "high"
}

// Mock inventory data
const mockInventory: InventoryItem[] = [
  {
    id: "1",
    productName: "Cement 50kg",
    sku: "CMT-001",
    branch: "Main Branch",
    quantityOnHand: 5,
    quantityReserved: 2,
    reorderLevel: 10,
    status: "critical",
  },
  {
    id: "2",
    productName: "Iron Sheets",
    sku: "IRS-001",
    branch: "Main Branch",
    quantityOnHand: 45,
    quantityReserved: 10,
    reorderLevel: 20,
    status: "adequate",
  },
  {
    id: "3",
    productName: "Wooden Planks",
    sku: "WDP-001",
    branch: "Downtown Branch",
    quantityOnHand: 8,
    quantityReserved: 0,
    reorderLevel: 10,
    status: "low",
  },
]

const statusColors = {
  critical: "bg-red-500/20 text-red-700 border-red-500/50",
  low: "bg-yellow-500/20 text-yellow-700 border-yellow-500/50",
  adequate: "bg-green-500/20 text-green-700 border-green-500/50",
  high: "bg-blue-500/20 text-blue-700 border-blue-500/50",
}

export default function InventoryPage() {
  const { user } = useAuth()
  const [selectedBranch, setSelectedBranch] = useState("all")

  if (!user) return null

  const branches = ["all", ...new Set(mockInventory.map((i) => i.branch))]
  const filteredInventory =
    selectedBranch === "all" ? mockInventory : mockInventory.filter((i) => i.branch === selectedBranch)

  const stats = {
    lowStock: filteredInventory.filter((i) => i.status === "critical" || i.status === "low").length,
    totalItems: filteredInventory.length,
    averageStock: Math.round(
      filteredInventory.reduce((sum, i) => sum + i.quantityOnHand, 0) / filteredInventory.length,
    ),
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
              <option key={branch} value={branch}>
                {branch === "all" ? "All Branches" : branch}
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
                    <th className="px-4 py-3 text-left font-medium">Branch</th>
                    <th className="px-4 py-3 text-right font-medium">On Hand</th>
                    <th className="px-4 py-3 text-right font-medium">Reserved</th>
                    <th className="px-4 py-3 text-right font-medium">Reorder Level</th>
                    <th className="px-4 py-3 text-center font-medium">Status</th>
                    <th className="px-4 py-3 text-center font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInventory.map((item) => (
                    <tr key={item.id} className="border-b border-border hover:bg-secondary/30">
                      <td className="px-4 py-3 font-medium">{item.productName}</td>
                      <td className="px-4 py-3 text-muted-foreground">{item.sku}</td>
                      <td className="px-4 py-3 text-muted-foreground">{item.branch}</td>
                      <td className="px-4 py-3 text-right font-medium">{item.quantityOnHand}</td>
                      <td className="px-4 py-3 text-right text-muted-foreground">{item.quantityReserved}</td>
                      <td className="px-4 py-3 text-right text-muted-foreground">{item.reorderLevel}</td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`px-2 py-1 rounded-md text-xs font-medium border ${statusColors[item.status]}`}
                        >
                          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Button variant="ghost" size="sm">
                          Adjust
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
