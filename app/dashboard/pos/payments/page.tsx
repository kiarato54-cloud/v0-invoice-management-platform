"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"

interface PaymentRecord {
  id: string
  transactionNumber: string
  date: string
  amount: number
  method: string
  status: "verified" | "pending" | "failed" | "refunded"
  employee: string
}

const mockPayments: PaymentRecord[] = [
  {
    id: "1",
    transactionNumber: "TXN-001",
    date: "2024-11-27 14:30",
    amount: 147500,
    method: "cash",
    status: "verified",
    employee: "John Doe",
  },
  {
    id: "2",
    transactionNumber: "TXN-002",
    date: "2024-11-27 15:15",
    amount: 100300,
    method: "card",
    status: "verified",
    employee: "Jane Smith",
  },
  {
    id: "3",
    transactionNumber: "TXN-003",
    date: "2024-11-27 16:45",
    amount: 295000,
    method: "mobile_money",
    status: "pending",
    employee: "John Doe",
  },
]

const statusColors = {
  verified: "bg-green-500/20 text-green-700 border-green-500/50",
  pending: "bg-yellow-500/20 text-yellow-700 border-yellow-500/50",
  failed: "bg-red-500/20 text-red-700 border-red-500/50",
  refunded: "bg-orange-500/20 text-orange-700 border-orange-500/50",
}

const methodLabels = {
  cash: "Cash",
  card: "Card",
  mobile_money: "Mobile Money",
  cheque: "Cheque",
}

export default function PaymentsPage() {
  const { user } = useAuth()
  const [filterStatus, setFilterStatus] = useState("all")

  if (!user) return null

  const filteredPayments = filterStatus === "all" ? mockPayments : mockPayments.filter((p) => p.status === filterStatus)

  const stats = {
    totalPayments: mockPayments.length,
    verifiedAmount: mockPayments.filter((p) => p.status === "verified").reduce((sum, p) => sum + p.amount, 0),
    pendingAmount: mockPayments.filter((p) => p.status === "pending").reduce((sum, p) => sum + p.amount, 0),
    failedCount: mockPayments.filter((p) => p.status === "failed").length,
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Payment Management</h1>
            <p className="text-muted-foreground mt-1">Track and verify payment transactions</p>
          </div>
          <Button>
            <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Process Refund
          </Button>
        </div>

        {/* Statistics */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPayments}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Verified Amount</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Tshs {(stats.verifiedAmount / 1000000).toFixed(1)}M</div>
              <p className="text-xs text-green-600 mt-1">Completed</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending Amount</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Tshs {(stats.pendingAmount / 1000000).toFixed(1)}M</div>
              <p className="text-xs text-yellow-600 mt-1">Awaiting verification</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Failed Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">{stats.failedCount}</div>
              <p className="text-xs text-red-600 mt-1">Require action</p>
            </CardContent>
          </Card>
        </div>

        {/* Filter */}
        <div className="flex gap-2">
          {["all", "verified", "pending", "failed", "refunded"].map((status) => (
            <Button
              key={status}
              size="sm"
              variant={filterStatus === status ? "default" : "outline"}
              onClick={() => setFilterStatus(status)}
              className="capitalize"
            >
              {status}
            </Button>
          ))}
        </div>

        {/* Payment Records Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-secondary/50 border-b border-border">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">Transaction</th>
                    <th className="px-4 py-3 text-left font-medium">Date & Time</th>
                    <th className="px-4 py-3 text-right font-medium">Amount</th>
                    <th className="px-4 py-3 text-left font-medium">Method</th>
                    <th className="px-4 py-3 text-left font-medium">Employee</th>
                    <th className="px-4 py-3 text-center font-medium">Status</th>
                    <th className="px-4 py-3 text-center font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.map((payment) => (
                    <tr key={payment.id} className="border-b border-border hover:bg-secondary/30">
                      <td className="px-4 py-3 font-mono font-semibold text-primary">{payment.transactionNumber}</td>
                      <td className="px-4 py-3 text-muted-foreground">{payment.date}</td>
                      <td className="px-4 py-3 text-right font-bold">Tshs {payment.amount.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <span className="text-xs capitalize">
                          {methodLabels[payment.method as keyof typeof methodLabels]}
                        </span>
                      </td>
                      <td className="px-4 py-3">{payment.employee}</td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`px-2 py-1 rounded-md text-xs font-medium border ${statusColors[payment.status]}`}
                        >
                          {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {payment.status === "pending" && (
                          <Button size="sm" variant="outline">
                            Verify
                          </Button>
                        )}
                        {payment.status === "verified" && (
                          <Button size="sm" variant="ghost" className="text-green-600">
                            ✓
                          </Button>
                        )}
                        {payment.status === "failed" && (
                          <Button size="sm" variant="outline" className="text-destructive bg-transparent">
                            Retry
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Daily Reconciliation Card */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Reconciliation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                End-of-day reconciliation for cash handling and payment verification
              </p>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Expected Cash</label>
                  <input
                    type="text"
                    value="Tshs 542,800"
                    readOnly
                    className="w-full px-4 py-2 rounded-md bg-secondary/50 border border-border text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Actual Cash</label>
                  <input
                    type="text"
                    placeholder="Enter actual amount"
                    className="w-full px-4 py-2 rounded-md bg-input border border-border text-sm"
                  />
                </div>
              </div>
              <Button className="w-full">Complete Reconciliation</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
