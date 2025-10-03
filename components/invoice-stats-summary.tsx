"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getInvoices } from "@/lib/invoice-data"
import { useAuth } from "./auth-provider"
import { useMemo } from "react"

export function InvoiceStatsSummary() {
  const { user } = useAuth()
  const invoices = getInvoices()

  const stats = useMemo(() => {
    const userInvoices = user?.role === "sales_officer" ? invoices.filter((inv) => inv.createdBy === user.id) : invoices

    const totalInvoices = userInvoices.length
    const totalRevenue = userInvoices.reduce((sum, inv) => sum + inv.total, 0)
    const paidInvoices = userInvoices.filter((inv) => inv.status === "paid")
    const pendingInvoices = userInvoices.filter((inv) => inv.status === "sent")
    const overdueInvoices = userInvoices.filter((inv) => inv.status === "overdue")
    const draftInvoices = userInvoices.filter((inv) => inv.status === "draft")

    const paidRevenue = paidInvoices.reduce((sum, inv) => sum + inv.total, 0)
    const pendingRevenue = pendingInvoices.reduce((sum, inv) => sum + inv.total, 0)
    const overdueRevenue = overdueInvoices.reduce((sum, inv) => sum + inv.total, 0)

    return {
      totalInvoices,
      totalRevenue,
      paidCount: paidInvoices.length,
      pendingCount: pendingInvoices.length,
      overdueCount: overdueInvoices.length,
      draftCount: draftInvoices.length,
      paidRevenue,
      pendingRevenue,
      overdueRevenue,
      averageInvoiceValue: totalInvoices > 0 ? totalRevenue / totalInvoices : 0,
    }
  }, [invoices, user])

  const summaryCards = [
    {
      title: "Total Revenue",
      value: `Tshs ${stats.totalRevenue.toLocaleString()}`,
      subtitle: `${stats.totalInvoices} invoices`,
      color: "text-primary",
    },
    {
      title: "Paid",
      value: `Tshs ${stats.paidRevenue.toLocaleString()}`,
      subtitle: `${stats.paidCount} invoices`,
      color: "text-green-500",
    },
    {
      title: "Pending",
      value: `Tshs ${stats.pendingRevenue.toLocaleString()}`,
      subtitle: `${stats.pendingCount} invoices`,
      color: "text-blue-500",
    },
    {
      title: "Overdue",
      value: `Tshs ${stats.overdueRevenue.toLocaleString()}`,
      subtitle: `${stats.overdueCount} invoices`,
      color: "text-red-500",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
      {summaryCards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${card.color}`}>{card.value}</div>
            <p className="text-xs text-muted-foreground mt-1">{card.subtitle}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
