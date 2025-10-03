"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getInvoices } from "@/lib/invoice-data"
import { useAuth } from "./auth-provider"
import { useMemo } from "react"

export function RecentInvoices() {
  const { user } = useAuth()
  const invoices = getInvoices()

  const recentInvoices = useMemo(() => {
    const userInvoices = user?.role === "sales_officer" ? invoices.filter((inv) => inv.createdBy === user.id) : invoices

    return userInvoices.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5)
  }, [invoices, user])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "sent":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      case "overdue":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      case "draft":
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Invoices</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentInvoices.length === 0 ? (
            <p className="text-muted-foreground text-sm">No invoices found.</p>
          ) : (
            recentInvoices.map((invoice) => (
              <div key={invoice.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="font-medium text-sm">{invoice.invoiceNumber}</p>
                      <p className="text-xs text-muted-foreground">{invoice.customer.name}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="font-medium text-sm">Tshs {invoice.total.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">{new Date(invoice.createdAt).toLocaleDateString()}</p>
                  </div>
                  <Badge className={getStatusColor(invoice.status)} variant="outline">
                    {invoice.status}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
