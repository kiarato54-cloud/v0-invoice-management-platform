"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"

interface Permission {
  id: string
  code: string
  name: string
  category: string
  description: string
}

interface RoleWithPermissions {
  id: string
  name: string
  permissions: Permission[]
}

const allPermissions: Permission[] = [
  { id: "1", code: "pos_checkout", name: "POS Checkout", category: "POS", description: "Process sales transactions" },
  {
    id: "2",
    code: "inventory_view",
    name: "View Inventory",
    category: "Inventory",
    description: "View inventory levels",
  },
  { id: "3", code: "inventory_edit", name: "Edit Inventory", category: "Inventory", description: "Modify inventory" },
  { id: "4", code: "staff_manage", name: "Manage Staff", category: "Staff", description: "Create and edit staff" },
  { id: "5", code: "reports_view", name: "View Reports", category: "Reports", description: "Access reports" },
  {
    id: "6",
    code: "payment_verify",
    name: "Verify Payments",
    category: "Payments",
    description: "Verify transactions",
  },
  { id: "7", code: "refund_process", name: "Process Refunds", category: "Refunds", description: "Issue refunds" },
]

const mockRoles: RoleWithPermissions[] = [
  {
    id: "1",
    name: "Cashier",
    permissions: [
      allPermissions[0], // pos_checkout
    ],
  },
  {
    id: "2",
    name: "Store Manager",
    permissions: [
      allPermissions[0], // pos_checkout
      allPermissions[1], // inventory_view
      allPermissions[2], // inventory_edit
    ],
  },
  {
    id: "3",
    name: "Admin",
    permissions: allPermissions,
  },
]

export default function PermissionsPage() {
  const { user } = useAuth()
  const [selectedRole, setSelectedRole] = useState<RoleWithPermissions | null>(mockRoles[0])

  if (!user) return null

  const permissionsByCategory = (permissions: Permission[]) => {
    const grouped: Record<string, Permission[]> = {}
    permissions.forEach((perm) => {
      if (!grouped[perm.category]) grouped[perm.category] = []
      grouped[perm.category].push(perm)
    })
    return grouped
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Permissions Management</h1>
          <p className="text-muted-foreground mt-1">Manage roles and permissions for staff members</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Roles List */}
          <div className="space-y-4">
            {mockRoles.map((role) => (
              <Card
                key={role.id}
                className={`cursor-pointer transition-all ${
                  selectedRole?.id === role.id ? "border-primary bg-primary/5" : "hover:border-primary/50"
                }`}
                onClick={() => setSelectedRole(role)}
              >
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-1">{role.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {role.permissions.length} permission{role.permissions.length !== 1 ? "s" : ""}
                  </p>
                </CardContent>
              </Card>
            ))}

            <Button className="w-full">
              <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Role
            </Button>
          </div>

          {/* Permissions for Selected Role */}
          <div className="lg:col-span-2">
            {selectedRole ? (
              <Card>
                <CardHeader>
                  <CardTitle>{selectedRole.name} Permissions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {Object.entries(permissionsByCategory(selectedRole.permissions)).map(([category, permissions]) => (
                    <div key={category} className="space-y-3">
                      <h3 className="font-semibold text-sm">{category}</h3>
                      <div className="space-y-2">
                        {permissions.map((perm) => (
                          <div
                            key={perm.id}
                            className="flex items-start justify-between p-3 bg-secondary/30 rounded-md"
                          >
                            <div className="flex-1">
                              <p className="font-medium text-sm">{perm.name}</p>
                              <p className="text-xs text-muted-foreground">{perm.description}</p>
                            </div>
                            <Button variant="ghost" size="sm" className="ml-2">
                              ✓
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  {selectedRole.permissions.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No permissions assigned to this role</p>
                    </div>
                  )}

                  <div className="flex gap-2 pt-4 border-t border-border">
                    <Button variant="outline" className="flex-1 bg-transparent">
                      Edit Role
                    </Button>
                    <Button variant="outline" className="flex-1 text-destructive bg-transparent">
                      Delete Role
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : null}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
