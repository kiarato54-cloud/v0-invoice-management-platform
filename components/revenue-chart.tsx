"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { getInvoices } from "@/lib/invoice-data"
import { useMemo } from "react"

export function RevenueChart() {
  const invoices = getInvoices()

  const chartData = useMemo(() => {
    const monthlyData = new Map()

    invoices.forEach((invoice) => {
      const date = new Date(invoice.createdAt)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
      const monthName = date.toLocaleDateString("en-US", { month: "short", year: "numeric" })

      if (!monthlyData.has(monthKey)) {
        monthlyData.set(monthKey, {
          month: monthName,
          revenue: 0,
          paid: 0,
          pending: 0,
          count: 0,
        })
      }

      const data = monthlyData.get(monthKey)
      data.revenue += invoice.total
      data.count += 1

      if (invoice.status === "paid") {
        data.paid += invoice.total
      } else if (invoice.status === "sent") {
        data.pending += invoice.total
      }
    })

    return Array.from(monthlyData.values())
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-6) // Last 6 months
  }, [invoices])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="month" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "6px",
                }}
                formatter={(value: number) => [`Tshs ${value.toLocaleString()}`, ""]}
              />
              <Bar dataKey="paid" fill="hsl(var(--chart-1))" name="Paid" />
              <Bar dataKey="pending" fill="hsl(var(--chart-2))" name="Pending" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
