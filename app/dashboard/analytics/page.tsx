"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"

export default function AnalyticsPage() {
  const { user } = useAuth()
  const [dateRange, setDateRange] = useState("today")

  if (!user) return null

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Analytics & Reports</h1>
            <p className="text-muted-foreground mt-1">Real-time business insights and performance metrics</p>
          </div>
          <div className="flex gap-2">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 rounded-md bg-input border border-border text-sm"
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
            <Button variant="outline">
              <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Export
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Tshs 5.2M</div>
              <p className="text-xs text-green-600 mt-1">+12.5% from last period</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">342</div>
              <p className="text-xs text-green-600 mt-1">+8.2% from last period</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Avg Transaction</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Tshs 15.2K</div>
              <p className="text-xs text-green-600 mt-1">+3.1% from last period</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Customers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">128</div>
              <p className="text-xs text-green-600 mt-1">+5.4% from last period</p>
            </CardContent>
          </Card>
        </div>

        {/* Revenue Trend & Sales by Branch */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Revenue Trend Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="h-48 bg-secondary/30 rounded-lg flex items-end justify-center gap-2 p-4">
                  {[65, 78, 90, 85, 95, 88, 102].map((value, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-primary rounded-t-md hover:bg-primary/80 transition-all"
                      style={{ height: `${(value / 102) * 100}%` }}
                      title={`Day ${i + 1}: ${value}%`}
                    />
                  ))}
                </div>
                <div className="text-xs text-muted-foreground text-center">Last 7 days</div>
              </div>
            </CardContent>
          </Card>

          {/* Sales by Branch */}
          <Card>
            <CardHeader>
              <CardTitle>Sales by Branch</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Main Branch", sales: 2100000, percentage: 40 },
                  { name: "Downtown Branch", sales: 1800000, percentage: 35 },
                  { name: "Suburban Branch", sales: 1300000, percentage: 25 },
                ].map((branch, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{branch.name}</span>
                      <span className="text-muted-foreground">Tshs {(branch.sales / 1000000).toFixed(1)}M</span>
                    </div>
                    <div className="w-full bg-secondary/30 rounded-full h-2 overflow-hidden">
                      <div className="bg-primary h-full rounded-full" style={{ width: `${branch.percentage}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Products & Payment Methods */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Top Products */}
          <Card>
            <CardHeader>
              <CardTitle>Top Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: "Cement 50kg", sales: 245, revenue: 2940000 },
                  { name: "Iron Sheets", sales: 128, revenue: 5760000 },
                  { name: "Paint 5L", sales: 89, revenue: 3115000 },
                  { name: "Wooden Planks", sales: 342, revenue: 1710000 },
                ].map((product, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-secondary/30 rounded-md">
                    <div>
                      <p className="font-medium text-sm">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.sales} units sold</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm">Tshs {(product.revenue / 1000000).toFixed(1)}M</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Payment Methods Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-3">
                  {[
                    { method: "Cash", amount: 2600000, percentage: 50 },
                    { method: "Mobile Money", amount: 1560000, percentage: 30 },
                    { method: "Card", amount: 1040000, percentage: 20 },
                  ].map((method, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{method.method}</span>
                        <span className="text-muted-foreground">Tshs {(method.amount / 1000000).toFixed(1)}M</span>
                      </div>
                      <div className="w-full bg-secondary/30 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            i === 0 ? "bg-blue-500" : i === 1 ? "bg-green-500" : "bg-purple-500"
                          }`}
                          style={{ width: `${method.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Business Metrics */}
        <div className="grid gap-6 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Inventory Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-md">
                <p className="text-xs text-muted-foreground mb-1">Critical Stock</p>
                <p className="text-lg font-bold text-red-600">12 products</p>
              </div>
              <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-md">
                <p className="text-xs text-muted-foreground mb-1">Low Stock</p>
                <p className="text-lg font-bold text-yellow-600">28 products</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Staff Performance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { name: "John Doe", sales: 85, transactions: 124 },
                { name: "Jane Smith", sales: 92, transactions: 156 },
              ].map((staff, i) => (
                <div key={i} className="p-3 bg-secondary/30 rounded-md">
                  <p className="text-sm font-medium">{staff.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Tshs {staff.sales / 10}K • {staff.transactions} transactions
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Business Health</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-md">
                <p className="text-xs text-muted-foreground mb-1">Collection Rate</p>
                <p className="text-lg font-bold text-green-600">94.2%</p>
              </div>
              <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-md">
                <p className="text-xs text-muted-foreground mb-1">Profit Margin</p>
                <p className="text-lg font-bold text-blue-600">28.5%</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
