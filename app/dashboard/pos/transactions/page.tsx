"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"

interface Transaction {
  id: string
  transactionNumber: string
  date: string
  time: string
  cashier: string
  branch: string
  itemCount: number
  subtotal: number
  tax: number
  total: number
  paymentMethod: string
  status: "completed" | "pending" | "refunded"
}

// Mock transactions
const mockTransactions: Transaction[] = [
  {
    id: "1",
    transactionNumber: "TXN-001",
    date: "2024-11-27",
    time: "14:30",
    cashier: "John Doe",
    branch: "Main Branch",
    itemCount: 5,
    subtotal: 125000,
    tax: 22500,
    total: 147500,
    paymentMethod: "cash",
    status: "completed",
  },
  {
    id: "2",
    transactionNumber: "TXN-002",
    date: "2024-11-27",
    time: "15:15",
    cashier: "Jane Smith",
    branch: "Downtown",
    itemCount: 3,
    subtotal: 85000,
    tax: 15300,
    total: 100300,
    paymentMethod: "card",
    status: "completed",
  },
  {
    id: "3",
    transactionNumber: "TXN-003",
    date: "2024-11-27",
    time: "16:45",
    cashier: "John Doe",
    branch: "Main Branch",
    itemCount: 8,
    subtotal: 250000,
    tax: 45000,
    total: 295000,
    paymentMethod: "mobile_money",
    status: "completed",
  },
]

const statusBadge = {
  completed: "bg-green-500/20 text-green-700 border-green-500/50",
  pending: "bg-yellow-500/20 text-yellow-700 border-yellow-500/50",
  refunded: "bg-red-500/20 text-red-700 border-red-500/50",
}

const paymentMethodBadge = {
  cash: "Cash",
  card: "Card",
  mobile_money: "Mobile Money",
  cheque: "Cheque",
}

export default function TransactionsPage() {
  const { user } = useAuth()
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [filterStatus, setFilterStatus] = useState("all")

  if (!user) return null

  const filteredTransactions =
    filterStatus === "all" ? mockTransactions : mockTransactions.filter((t) => t.status === filterStatus)

  const stats = {
    totalTransactions: mockTransactions.length,
    totalRevenue: mockTransactions.reduce((sum, t) => sum + t.total, 0),
    averageTransaction: Math.round(mockTransactions.reduce((sum, t) => sum + t.total, 0) / mockTransactions.length),
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Transactions</h1>
            <p className="text-muted-foreground mt-1">View and manage all POS transactions</p>
          </div>
          <Button variant="outline">
            <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Export
          </Button>
        </div>

        {/* Statistics */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalTransactions}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Tshs {(stats.totalRevenue / 1000000).toFixed(1)}M</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Avg Transaction</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Tshs {stats.averageTransaction.toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filter */}
        <div className="flex gap-2">
          {["all", "completed", "pending", "refunded"].map((status) => (
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

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Transactions List */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-secondary/50 border-b border-border">
                      <tr>
                        <th className="px-4 py-3 text-left font-medium">Transaction ID</th>
                        <th className="px-4 py-3 text-left font-medium">Date & Time</th>
                        <th className="px-4 py-3 text-left font-medium">Cashier</th>
                        <th className="px-4 py-3 text-right font-medium">Amount</th>
                        <th className="px-4 py-3 text-left font-medium">Payment</th>
                        <th className="px-4 py-3 text-center font-medium">Status</th>
                        <th className="px-4 py-3 text-center font-medium">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTransactions.map((transaction) => (
                        <tr key={transaction.id} className="border-b border-border hover:bg-secondary/30">
                          <td
                            className="px-4 py-3 font-mono font-semibold cursor-pointer text-primary hover:underline"
                            onClick={() => setSelectedTransaction(transaction)}
                          >
                            {transaction.transactionNumber}
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">
                            {transaction.date} {transaction.time}
                          </td>
                          <td className="px-4 py-3">{transaction.cashier}</td>
                          <td className="px-4 py-3 text-right font-bold">Tshs {transaction.total.toLocaleString()}</td>
                          <td className="px-4 py-3">
                            <span className="text-xs capitalize">
                              {paymentMethodBadge[transaction.paymentMethod as keyof typeof paymentMethodBadge]}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span
                              className={`px-2 py-1 rounded-md text-xs font-medium border ${statusBadge[transaction.status]}`}
                            >
                              {transaction.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <Button variant="ghost" size="sm" onClick={() => setSelectedTransaction(transaction)}>
                              View
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Transaction Details */}
          <div>
            {selectedTransaction ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{selectedTransaction.transactionNumber}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between pb-2 border-b border-border">
                      <span className="text-muted-foreground">Date</span>
                      <span className="font-medium">{selectedTransaction.date}</span>
                    </div>
                    <div className="flex justify-between pb-2 border-b border-border">
                      <span className="text-muted-foreground">Time</span>
                      <span className="font-medium">{selectedTransaction.time}</span>
                    </div>
                    <div className="flex justify-between pb-2 border-b border-border">
                      <span className="text-muted-foreground">Cashier</span>
                      <span className="font-medium">{selectedTransaction.cashier}</span>
                    </div>
                    <div className="flex justify-between pb-2 border-b border-border">
                      <span className="text-muted-foreground">Branch</span>
                      <span className="font-medium">{selectedTransaction.branch}</span>
                    </div>
                    <div className="flex justify-between pb-2 border-b border-border">
                      <span className="text-muted-foreground">Items</span>
                      <span className="font-medium">{selectedTransaction.itemCount}</span>
                    </div>
                    <div className="flex justify-between pb-2 border-b border-border">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium">Tshs {selectedTransaction.subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between pb-2 border-b border-border">
                      <span className="text-muted-foreground">Tax</span>
                      <span className="font-medium">Tshs {selectedTransaction.tax.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between pb-2 border-b border-border">
                      <span className="text-muted-foreground">Payment</span>
                      <span className="font-medium capitalize">
                        {paymentMethodBadge[selectedTransaction.paymentMethod as keyof typeof paymentMethodBadge]}
                      </span>
                    </div>
                  </div>

                  <div className="bg-primary/10 -mx-6 -mb-6 p-4 rounded-b-lg">
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-bold">Total</span>
                      <span className="text-xl font-bold text-primary">
                        Tshs {selectedTransaction.total.toLocaleString()}
                      </span>
                    </div>
                    <Button className="w-full mb-2">Print Receipt</Button>
                    {selectedTransaction.status === "completed" && (
                      <Button variant="outline" className="w-full text-destructive bg-transparent">
                        Process Refund
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">Select a transaction to view details</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
