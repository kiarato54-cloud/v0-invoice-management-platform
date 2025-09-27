"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { UserManagementTable } from "@/components/user-management-table"
import { useAuth } from "@/components/auth-provider"
import { hasPermission } from "@/lib/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getUsers } from "@/lib/user-management"
import { useMemo } from "react"

export default function UsersPage() {
  const { user } = useAuth()
  const users = getUsers()

  const userStats = useMemo(() => {
    const totalUsers = users.length
    const activeUsers = users.filter((u) => u.status === "active").length
    const adminUsers = users.filter((u) => u.role === "admin").length
    const salesUsers = users.filter((u) => u.role === "sales_officer").length

    return {
      totalUsers,
      activeUsers,
      adminUsers,
      salesUsers,
    }
  }, [users])

  if (!user || !hasPermission(user, "all")) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
          <p className="text-muted-foreground">You don't have permission to manage users.</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">User Management</h1>
            <p className="text-muted-foreground">Manage system users, roles, and permissions</p>
          </div>
        </div>

        {/* User Statistics */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userStats.totalUsers}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">{userStats.activeUsers}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Administrators</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">{userStats.adminUsers}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Sales Officers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-500">{userStats.salesUsers}</div>
            </CardContent>
          </Card>
        </div>

        <UserManagementTable />
      </div>
    </DashboardLayout>
  )
}
