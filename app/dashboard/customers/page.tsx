"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"
import Link from "next/link"

interface Customer {
  id: string
  name: string
  phone: string
  email: string
  address: string
  tier: "bronze" | "silver" | "gold" | "platinum"
  totalSpent: number
  loyaltyPoints: number
  lastPurchase: string
  joinDate: string
  purchases: number
}

const mockCustomers: Customer[] = [
  {
    id: "1",
    name: "Ahmed Hassan",
    phone: "+255 700 111111",
    email: "ahmed@example.com",
    address: "Dar es Salaam",
    tier: "gold",
    totalSpent: 5200000,
    loyaltyPoints: 5200,
    lastPurchase: "2024-11-27",
    joinDate: "2023-06-15",
    purchases: 42,
  },
  {
    id: "2",
    name: "Fatima Ali",
    phone: "+255 700 222222",
    email: "fatima@example.com",
    address: "Dar es Salaam",
    tier: "silver",
    totalSpent: 2800000,
    loyaltyPoints: 2800,
    lastPurchase: "2024-11-25",
    joinDate: "2023-08-20",
    purchases: 28,
  },
  {
    id: "3",
    name: "John Mwasi",
    phone: "+255 700 333333",
    email: "john@example.com",
    address: "Dar es Salaam",
    tier: "platinum",
    totalSpent: 8500000,
    loyaltyPoints: 8500,
    lastPurchase: "2024-11-27",
    joinDate: "2023-01-10",
    purchases: 78,
  },
]

const tierColors = {
  bronze: "bg-orange-500/20 text-orange-700 border-orange-500/50",
  silver: "bg-gray-400/20 text-gray-700 border-gray-400/50",
  gold: "bg-yellow-500/20 text-yellow-700 border-yellow-500/50",
  platinum: "bg-blue-500/20 text-blue-700 border-blue-500/50",
}

export default function CustomersPage() {
  const { user } = useAuth()
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterTier, setFilterTier] = useState("all")

  if (!user) return null

  const filteredCustomers = mockCustomers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTier = filterTier === "all" || c.tier === filterTier
    return matchesSearch && matchesTier
  })

  const stats = {
    totalCustomers: mockCustomers.length,
    totalSpent: mockCustomers.reduce((sum, c) => sum + c.totalSpent, 0),
    avgSpent: Math.round(mockCustomers.reduce((sum, c) => sum + c.totalSpent, 0) / mockCustomers.length),
    platinumCount: mockCustomers.filter((c) => c.tier === "platinum").length,
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Customer Management</h1>
            <p className="text-muted-foreground mt-1">Manage customers and loyalty rewards</p>
          </div>
          <Link href="/dashboard/customers/new">
            <Button>
              <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Customer
            </Button>
          </Link>
        </div>

        {/* Statistics */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Customers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCustomers}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Spent</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Tshs {(stats.totalSpent / 1000000).toFixed(1)}M</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Avg Spent</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Tshs {(stats.avgSpent / 1000000).toFixed(1)}M</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">VIP Customers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.platinumCount}</div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-4 flex-col md:flex-row">
          <input
            type="text"
            placeholder="Search by name, phone, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 rounded-md bg-input border border-border"
          />
          <select
            value={filterTier}
            onChange={(e) => setFilterTier(e.target.value)}
            className="px-4 py-2 rounded-md bg-input border border-border"
          >
            <option value="all">All Tiers</option>
            <option value="bronze">Bronze</option>
            <option value="silver">Silver</option>
            <option value="gold">Gold</option>
            <option value="platinum">Platinum</option>
          </select>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Customer List */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-secondary/50 border-b border-border">
                      <tr>
                        <th className="px-4 py-3 text-left font-medium">Name</th>
                        <th className="px-4 py-3 text-left font-medium">Phone</th>
                        <th className="px-4 py-3 text-right font-medium">Total Spent</th>
                        <th className="px-4 py-3 text-right font-medium">Points</th>
                        <th className="px-4 py-3 text-center font-medium">Tier</th>
                        <th className="px-4 py-3 text-center font-medium">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCustomers.map((customer) => (
                        <tr key={customer.id} className="border-b border-border hover:bg-secondary/30">
                          <td className="px-4 py-3 font-medium">{customer.name}</td>
                          <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{customer.phone}</td>
                          <td className="px-4 py-3 text-right font-bold">
                            Tshs {(customer.totalSpent / 1000000).toFixed(1)}M
                          </td>
                          <td className="px-4 py-3 text-right text-primary font-bold">
                            {customer.loyaltyPoints.toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span
                              className={`px-2 py-1 rounded-md text-xs font-medium border capitalize ${tierColors[customer.tier]}`}
                            >
                              {customer.tier}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <Button variant="ghost" size="sm" onClick={() => setSelectedCustomer(customer)}>
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

          {/* Customer Details & Rewards */}
          <div>
            {selectedCustomer ? (
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{selectedCustomer.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3 text-sm">
                      <div className="pb-2 border-b border-border">
                        <p className="text-muted-foreground">Phone</p>
                        <p className="font-medium">{selectedCustomer.phone}</p>
                      </div>
                      <div className="pb-2 border-b border-border">
                        <p className="text-muted-foreground">Email</p>
                        <p className="font-medium">{selectedCustomer.email}</p>
                      </div>
                      <div className="pb-2 border-b border-border">
                        <p className="text-muted-foreground">Address</p>
                        <p className="font-medium">{selectedCustomer.address}</p>
                      </div>
                      <div className="pb-2 border-b border-border">
                        <p className="text-muted-foreground">Member Since</p>
                        <p className="font-medium">{selectedCustomer.joinDate}</p>
                      </div>
                      <div className="pb-2 border-b border-border">
                        <p className="text-muted-foreground">Total Purchases</p>
                        <p className="font-medium">{selectedCustomer.purchases}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/30">
                  <CardHeader>
                    <CardTitle className="text-sm">Loyalty Rewards</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-sm font-medium">
                          <span
                            className={`px-2 py-1 rounded-md text-xs font-bold capitalize ${tierColors[selectedCustomer.tier]}`}
                          >
                            {selectedCustomer.tier}
                          </span>
                        </p>
                        <p className="text-xs text-muted-foreground">{selectedCustomer.loyaltyPoints} points</p>
                      </div>
                      <div className="w-full bg-secondary/30 rounded-full h-3 overflow-hidden">
                        <div
                          className="bg-yellow-500 h-full rounded-full"
                          style={{
                            width: `${Math.min(100, ((selectedCustomer.loyaltyPoints % 1000) / 1000) * 100)}%`,
                          }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {(((selectedCustomer.loyaltyPoints % 1000) / 1000) * 100).toFixed(0)}% to next reward
                      </p>
                    </div>

                    <div className="bg-background p-3 rounded-lg border border-border">
                      <p className="text-xs font-medium mb-2">Available Rewards</p>
                      <div className="space-y-2">
                        <button className="w-full px-2 py-1 bg-blue-500/10 hover:bg-blue-500/20 rounded text-xs font-medium text-blue-700 border border-blue-500/30">
                          10% Discount (500 pts)
                        </button>
                        <button className="w-full px-2 py-1 bg-blue-500/10 hover:bg-blue-500/20 rounded text-xs font-medium text-blue-700 border border-blue-500/30">
                          Free Delivery (1000 pts)
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex gap-2">
                  <Link href={`/dashboard/customers/${selectedCustomer.id}`} className="flex-1">
                    <Button className="w-full" variant="default">
                      Edit
                    </Button>
                  </Link>
                  <Button className="flex-1 bg-transparent" variant="outline">
                    History
                  </Button>
                </div>
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">Select a customer to view details</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
