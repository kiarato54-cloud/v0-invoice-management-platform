"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useInvoices } from "@/lib/hooks/useInvoices"
import { useAuth } from "./auth-provider"
import { useMemo } from "react"

export function InvoiceStatsSummary() {
  const { user } = useAuth()
  const { invoices, loading, error } = useInvoices()

  const stats = useMemo(() => {
    const userInvoices = user?.role === "sales_officer" 
      ? invoices.filter((inv) => inv.createdBy === user.id) 
      : invoices

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

  // Show loading state
  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        {[1, 2, 3, 4].map(i => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
            </CardHeader>
            <CardContent>
              <div className="h-6 w-24 bg-gray-200 rounded animate-pulse mb-1"></div>
              <div className="h-3 w-16 bg-gray-200 rounded animate-pulse"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-destructive">
              Error loading invoices: {error}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

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
