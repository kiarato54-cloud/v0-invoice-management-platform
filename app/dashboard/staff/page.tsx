"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"
import Link from "next/link"

interface Staff {
  id: string
  name: string
  email: string
  role: string
  position: string
  branch: string
  status: "active" | "on-leave" | "terminated"
  hireDate: string
  phone: string
}

const mockStaff: Staff[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "cashier",
    position: "POS Cashier",
    branch: "Main Branch",
    status: "active",
    hireDate: "2023-01-15",
    phone: "+255 700 123456",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "storekeeper",
    position: "Store Manager",
    branch: "Downtown",
    status: "active",
    hireDate: "2023-06-20",
    phone: "+255 700 234567",
  },
  {
    id: "3",
    name: "Peter Johnson",
    email: "peter@example.com",
    role: "sales_officer",
    position: "Sales Officer",
    branch: "Main Branch",
    status: "on-leave",
    hireDate: "2022-11-10",
    phone: "+255 700 345678",
  },
]

const statusColors = {
  active: "bg-green-500/20 text-green-700 border-green-500/50",
  "on-leave": "bg-yellow-500/20 text-yellow-700 border-yellow-500/50",
  terminated: "bg-red-500/20 text-red-700 border-red-500/50",
}

export default function StaffPage() {
  const { user } = useAuth()
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null)
  const [filterStatus, setFilterStatus] = useState("all")

  if (!user) return null

  const filteredStaff = filterStatus === "all" ? mockStaff : mockStaff.filter((s) => s.status === filterStatus)

  const stats = {
    totalStaff: mockStaff.length,
    activeStaff: mockStaff.filter((s) => s.status === "active").length,
    onLeave: mockStaff.filter((s) => s.status === "on-leave").length,
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Staff Management</h1>
            <p className="text-muted-foreground mt-1">Manage employees, permissions, and shifts</p>
          </div>
          <Link href="/dashboard/staff/new">
            <Button>
              <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Staff Member
            </Button>
          </Link>
        </div>

        {/* Statistics */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Staff</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalStaff}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Staff</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">{stats.activeStaff}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">On Leave</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-500">{stats.onLeave}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filter */}
        <div className="flex gap-2">
          {["all", "active", "on-leave", "terminated"].map((status) => (
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
          {/* Staff List */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-secondary/50 border-b border-border">
                      <tr>
                        <th className="px-4 py-3 text-left font-medium">Name</th>
                        <th className="px-4 py-3 text-left font-medium">Position</th>
                        <th className="px-4 py-3 text-left font-medium">Branch</th>
                        <th className="px-4 py-3 text-left font-medium">Role</th>
                        <th className="px-4 py-3 text-center font-medium">Status</th>
                        <th className="px-4 py-3 text-center font-medium">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStaff.map((staff) => (
                        <tr key={staff.id} className="border-b border-border hover:bg-secondary/30">
                          <td className="px-4 py-3 font-medium">{staff.name}</td>
                          <td className="px-4 py-3 text-muted-foreground">{staff.position}</td>
                          <td className="px-4 py-3 text-muted-foreground">{staff.branch}</td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-1 bg-secondary/50 rounded-md text-xs font-medium capitalize">
                              {staff.role.replace("_", " ")}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span
                              className={`px-2 py-1 rounded-md text-xs font-medium border ${statusColors[staff.status]}`}
                            >
                              {staff.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <Button variant="ghost" size="sm" onClick={() => setSelectedStaff(staff)}>
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

          {/* Staff Details */}
          <div>
            {selectedStaff ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{selectedStaff.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3 text-sm">
                    <div className="pb-2 border-b border-border">
                      <p className="text-muted-foreground">Email</p>
                      <p className="font-medium">{selectedStaff.email}</p>
                    </div>
                    <div className="pb-2 border-b border-border">
                      <p className="text-muted-foreground">Phone</p>
                      <p className="font-medium">{selectedStaff.phone}</p>
                    </div>
                    <div className="pb-2 border-b border-border">
                      <p className="text-muted-foreground">Position</p>
                      <p className="font-medium">{selectedStaff.position}</p>
                    </div>
                    <div className="pb-2 border-b border-border">
                      <p className="text-muted-foreground">Branch</p>
                      <p className="font-medium">{selectedStaff.branch}</p>
                    </div>
                    <div className="pb-2 border-b border-border">
                      <p className="text-muted-foreground">Role</p>
                      <p className="font-medium capitalize">{selectedStaff.role.replace("_", " ")}</p>
                    </div>
                    <div className="pb-2 border-b border-border">
                      <p className="text-muted-foreground">Status</p>
                      <span
                        className={`inline-block px-2 py-1 rounded-md text-xs font-medium border ${statusColors[selectedStaff.status]}`}
                      >
                        {selectedStaff.status}
                      </span>
                    </div>
                    <div className="pb-2 border-b border-border">
                      <p className="text-muted-foreground">Hire Date</p>
                      <p className="font-medium">{selectedStaff.hireDate}</p>
                    </div>
                  </div>

                  <div className="space-y-2 pt-4">
                    <Link href={`/dashboard/staff/${selectedStaff.id}`}>
                      <Button className="w-full" variant="default">
                        Edit Staff
                      </Button>
                    </Link>
                    <Button className="w-full bg-transparent" variant="outline">
                      Manage Permissions
                    </Button>
                    <Button className="w-full bg-transparent" variant="outline">
                      View Activity Log
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">Select a staff member to view details</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
