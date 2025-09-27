"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getInvoices } from "@/lib/invoice-data"
import { useMemo } from "react"

export function FinancialSummary() {
  const invoices = getInvoices()

  const financialData = useMemo(() => {
    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear

    const currentMonthInvoices = invoices.filter((inv) => {
      const date = new Date(inv.createdAt)
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear
    })

    const lastMonthInvoices = invoices.filter((inv) => {
      const date = new Date(inv.createdAt)
      return date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear
    })

    const totalRevenue = invoices.reduce((sum, inv) => sum + inv.total, 0)
    const paidRevenue = invoices.filter((inv) => inv.status === "paid").reduce((sum, inv) => sum + inv.total, 0)
    const pendingRevenue = invoices.filter((inv) => inv.status === "sent").reduce((sum, inv) => sum + inv.total, 0)
    const overdueRevenue = invoices.filter((inv) => inv.status === "overdue").reduce((sum, inv) => sum + inv.total, 0)

    const currentMonthRevenue = currentMonthInvoices.reduce((sum, inv) => sum + inv.total, 0)
    const lastMonthRevenue = lastMonthInvoices.reduce((sum, inv) => sum + inv.total, 0)
    const monthlyGrowth = lastMonthRevenue > 0 ? ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 : 0

    const averageInvoiceValue = invoices.length > 0 ? totalRevenue / invoices.length : 0
    const collectionRate = totalRevenue > 0 ? (paidRevenue / totalRevenue) * 100 : 0

    return {
      totalRevenue,
      paidRevenue,
      pendingRevenue,
      overdueRevenue,
      currentMonthRevenue,
      lastMonthRevenue,
      monthlyGrowth,
      averageInvoiceValue,
      collectionRate,
      totalInvoices: invoices.length,
      paidInvoices: invoices.filter((inv) => inv.status === "paid").length,
    }
  }, [invoices])

  const summaryCards = [
    {
      title: "Total Revenue",
      value: `$${financialData.totalRevenue.toLocaleString()}`,
      subtitle: `${financialData.totalInvoices} total invoices`,
      trend: null,
    },
    {
      title: "Collection Rate",
      value: `${financialData.collectionRate.toFixed(1)}%`,
      subtitle: `${financialData.paidInvoices} paid invoices`,
      trend: null,
    },
    {
      title: "Monthly Growth",
      value: `${financialData.monthlyGrowth >= 0 ? "+" : ""}${financialData.monthlyGrowth.toFixed(1)}%`,
      subtitle: `$${financialData.currentMonthRevenue.toLocaleString()} this month`,
      trend: financialData.monthlyGrowth >= 0 ? "up" : "down",
    },
    {
      title: "Average Invoice",
      value: `$${financialData.averageInvoiceValue.toLocaleString()}`,
      subtitle: "Per invoice value",
      trend: null,
    },
    {
      title: "Outstanding",
      value: `$${financialData.pendingRevenue.toLocaleString()}`,
      subtitle: "Pending payments",
      trend: null,
    },
    {
      title: "Overdue",
      value: `$${financialData.overdueRevenue.toLocaleString()}`,
      subtitle: "Requires attention",
      trend: null,
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {summaryCards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold">{card.value}</div>
              {card.trend && (
                <div
                  className={`text-sm ${
                    card.trend === "up" ? "text-green-500" : "text-red-500"
                  } flex items-center gap-1`}
                >
                  {card.trend === "up" ? (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                      />
                    </svg>
                  ) : (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                      />
                    </svg>
                  )}
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">{card.subtitle}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
