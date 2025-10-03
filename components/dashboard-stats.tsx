"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getInvoices } from "@/lib/invoice-data"
import { useAuth } from "./auth-provider"
import { useMemo } from "react"

export function DashboardStats() {
  const { user } = useAuth()
  const invoices = getInvoices()

  const stats = useMemo(() => {
    const userInvoices = user?.role === "sales_officer" ? invoices.filter((inv) => inv.createdBy === user.id) : invoices

    const totalInvoices = userInvoices.length
    const totalRevenue = userInvoices.reduce((sum, inv) => sum + inv.total, 0)
    const paidInvoices = userInvoices.filter((inv) => inv.status === "paid").length
    const pendingInvoices = userInvoices.filter((inv) => inv.status === "sent").length
    const overdueInvoices = userInvoices.filter((inv) => inv.status === "overdue").length

    return {
      totalInvoices,
      totalRevenue,
      paidInvoices,
      pendingInvoices,
      overdueInvoices,
      paymentRate: totalInvoices > 0 ? (paidInvoices / totalInvoices) * 100 : 0,
    }
  }, [invoices, user])

  const statCards = [
    {
      title: "Total Invoices",
      value: stats.totalInvoices.toString(),
      icon: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
    },
    {
      title: "Total Revenue",
      value: `Tshs ${stats.totalRevenue.toLocaleString()}`,
      icon: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
          />
        </svg>
      ),
    },
    {
      title: "Paid Invoices",
      value: stats.paidInvoices.toString(),
      icon: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      title: "Payment Rate",
      value: `${stats.paymentRate.toFixed(1)}%`,
      icon: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
            <div className="text-muted-foreground">{stat.icon}</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
