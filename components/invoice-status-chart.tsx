"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { getInvoices } from "@/lib/invoice-data"
import { useMemo } from "react"

export function InvoiceStatusChart() {
  const invoices = getInvoices()

  const chartData = useMemo(() => {
    const statusCounts = invoices.reduce(
      (acc, invoice) => {
        acc[invoice.status] = (acc[invoice.status] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    return [
      { name: "Paid", value: statusCounts.paid || 0, color: "hsl(var(--chart-1))" },
      { name: "Sent", value: statusCounts.sent || 0, color: "hsl(var(--chart-2))" },
      { name: "Draft", value: statusCounts.draft || 0, color: "hsl(var(--chart-3))" },
      { name: "Overdue", value: statusCounts.overdue || 0, color: "hsl(var(--chart-4))" },
    ].filter((item) => item.value > 0)
  }, [invoices])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invoice Status Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "6px",
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
