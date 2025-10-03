"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getInvoices } from "@/lib/invoice-data"
import { useMemo } from "react"

export function TopCustomersChart() {
  const invoices = getInvoices()

  const topCustomers = useMemo(() => {
    const customerData = new Map()

    invoices.forEach((invoice) => {
      const customerId = invoice.customer.id
      if (!customerData.has(customerId)) {
        customerData.set(customerId, {
          name: invoice.customer.name,
          email: invoice.customer.email,
          totalRevenue: 0,
          invoiceCount: 0,
          lastInvoice: invoice.createdAt,
        })
      }

      const data = customerData.get(customerId)
      data.totalRevenue += invoice.total
      data.invoiceCount += 1
      if (new Date(invoice.createdAt) > new Date(data.lastInvoice)) {
        data.lastInvoice = invoice.createdAt
      }
    })

    return Array.from(customerData.values())
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, 5)
  }, [invoices])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Customers</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topCustomers.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No customer data available</p>
          ) : (
            topCustomers.map((customer, index) => (
              <div
                key={customer.name}
                className="flex items-center justify-between p-3 border border-border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium">{customer.name}</p>
                    <p className="text-sm text-muted-foreground">{customer.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">Tshs {customer.totalRevenue.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">{customer.invoiceCount} invoices</p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
