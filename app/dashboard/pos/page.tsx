"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { useAuth } from "@/components/auth-provider"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function POSPage() {
  const { user } = useAuth()

  if (!user) return null

  const posModules = [
    {
      title: "Products",
      description: "Manage product catalog, pricing, and categories",
      href: "/dashboard/pos/products",
      icon: "📦",
      roles: ["admin", "storekeeper"],
    },
    {
      title: "Inventory",
      description: "Track stock levels across branches",
      href: "/dashboard/pos/inventory",
      icon: "📊",
      roles: ["admin", "storekeeper"],
    },
    {
      title: "Point of Sale",
      description: "Fast checkout interface for sales",
      href: "/dashboard/pos/checkout",
      icon: "🛒",
      roles: ["admin", "storekeeper", "sales_officer"],
    },
    {
      title: "Transactions",
      description: "View and manage sales transactions",
      href: "/dashboard/pos/transactions",
      icon: "💳",
      roles: ["admin", "storekeeper", "sales_officer"],
    },
  ]

  const userModules = posModules.filter((m) => m.roles.includes(user.role || ""))

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Point of Sale System</h1>
          <p className="text-muted-foreground mt-1">
            Manage products, inventory, and sales transactions across all branches
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {userModules.map((module) => (
            <Link key={module.href} href={module.href}>
              <Card className="h-full hover:border-primary transition-colors cursor-pointer">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{module.title}</CardTitle>
                    <span className="text-2xl">{module.icon}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{module.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
