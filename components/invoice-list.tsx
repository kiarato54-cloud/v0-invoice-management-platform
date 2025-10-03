"use client"
import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getInvoices, saveInvoice, type Invoice } from "@/lib/invoice-data"
import { useAuth } from "./auth-provider"
import { InvoicePreview } from "./invoice-preview"
import { hasPermission } from "@/lib/auth"

export function InvoiceList() {
  const { user } = useAuth()
  const [invoices, setInvoices] = useState<Invoice[]>(getInvoices())
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [dateFilter, setDateFilter] = useState<string>("all")
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)

  const filteredInvoices = useMemo(() => {
    let filtered = invoices

    // Role-based filtering
    if (user?.role === "sales_officer") {
      filtered = filtered.filter((invoice) => invoice.createdBy === user.id)
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (invoice) =>
          invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          invoice.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          invoice.customer.email.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((invoice) => invoice.status === statusFilter)
    }

    // Date filter
    if (dateFilter !== "all") {
      const now = new Date()
      const filterDate = new Date()

      switch (dateFilter) {
        case "today":
          filterDate.setHours(0, 0, 0, 0)
          filtered = filtered.filter((invoice) => new Date(invoice.createdAt) >= filterDate)
          break
        case "week":
          filterDate.setDate(now.getDate() - 7)
          filtered = filtered.filter((invoice) => new Date(invoice.createdAt) >= filterDate)
          break
        case "month":
          filterDate.setMonth(now.getMonth() - 1)
          filtered = filtered.filter((invoice) => new Date(invoice.createdAt) >= filterDate)
          break
        case "year":
          filterDate.setFullYear(now.getFullYear() - 1)
          filtered = filtered.filter((invoice) => new Date(invoice.createdAt) >= filterDate)
          break
      }
    }

    return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [invoices, searchTerm, statusFilter, dateFilter, user])

  const updateInvoiceStatus = (invoiceId: string, newStatus: Invoice["status"]) => {
    const updatedInvoices = invoices.map((invoice) => {
      if (invoice.id === invoiceId) {
        const updatedInvoice = { ...invoice, status: newStatus }
        saveInvoice(updatedInvoice)
        return updatedInvoice
      }
      return invoice
    })
    setInvoices(updatedInvoices)
  }

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

  const canEditInvoice = (invoice: Invoice) => {
    if (!user) return false
    if (hasPermission(user, "all")) return true
    if (user.role === "sales_officer" && invoice.createdBy === user.id) return true
    return false
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <Input
                placeholder="Search invoices, customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Date Range</label>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">Last 7 Days</SelectItem>
                  <SelectItem value="month">Last 30 Days</SelectItem>
                  <SelectItem value="year">Last Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Actions</label>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("")
                  setStatusFilter("all")
                  setDateFilter("all")
                }}
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Invoice List */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Invoices ({filteredInvoices.length})</CardTitle>
          {(user?.role === "admin" || user?.role === "sales_officer") && (
            <Button asChild>
              <a href="/dashboard/invoices/create">Create Invoice</a>
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {filteredInvoices.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto h-12 w-12 bg-muted rounded-lg flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">No invoices found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || statusFilter !== "all" || dateFilter !== "all"
                  ? "Try adjusting your search criteria"
                  : "Get started by creating your first invoice"}
              </p>
              {(user?.role === "admin" || user?.role === "sales_officer") && (
                <Button asChild>
                  <a href="/dashboard/invoices/create">Create Invoice</a>
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredInvoices.map((invoice) => (
                <div key={invoice.id} className="border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <h3 className="font-semibold">{invoice.invoiceNumber}</h3>
                        <Badge className={getStatusColor(invoice.status)} variant="outline">
                          {invoice.status}
                        </Badge>
                      </div>
                      <div className="grid gap-2 md:grid-cols-3 text-sm text-muted-foreground">
                        <div>
                          <span className="font-medium">Customer:</span> {invoice.customer.name}
                        </div>
                        <div>
                          <span className="font-medium">Amount:</span> Tshs {invoice.total.toLocaleString()}
                        </div>
                        <div>
                          <span className="font-medium">Date:</span> {new Date(invoice.createdAt).toLocaleDateString()}
                        </div>
                        <div>
                          <span className="font-medium">Due:</span> {new Date(invoice.dueDate).toLocaleDateString()}
                        </div>
                        <div>
                          <span className="font-medium">Items:</span> {invoice.items.length}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => setSelectedInvoice(invoice)}>
                        View
                      </Button>
                      {canEditInvoice(invoice) && (
                        <Select
                          value={invoice.status}
                          onValueChange={(value: Invoice["status"]) => updateInvoiceStatus(invoice.id, value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="sent">Sent</SelectItem>
                            <SelectItem value="paid">Paid</SelectItem>
                            <SelectItem value="overdue">Overdue</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Invoice Preview Modal */}
      {selectedInvoice && <InvoicePreview invoice={selectedInvoice} onClose={() => setSelectedInvoice(null)} />}
    </div>
  )
}
