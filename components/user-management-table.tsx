"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getUsers, saveUser, deleteUser, type UserWithStats } from "@/lib/user-management"
import { UserFormDialog } from "./user-form-dialog"

export function UserManagementTable() {
  const [users, setUsers] = useState<UserWithStats[]>(getUsers())
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedUser, setSelectedUser] = useState<UserWithStats | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesRole = roleFilter === "all" || user.role === roleFilter
    const matchesStatus = statusFilter === "all" || user.status === statusFilter

    return matchesSearch && matchesRole && matchesStatus
  })

  const handleStatusChange = (userId: string, newStatus: UserWithStats["status"]) => {
    const updatedUsers = users.map((user) => {
      if (user.id === userId) {
        const updatedUser = { ...user, status: newStatus, isActive: newStatus === "active" }
        saveUser(updatedUser)
        return updatedUser
      }
      return user
    })
    setUsers(updatedUsers)
  }

  const handleDeleteUser = (userId: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      deleteUser(userId)
      setUsers(users.filter((user) => user.id !== userId))
    }
  }

  const handleEditUser = (user: UserWithStats) => {
    setSelectedUser(user)
    setIsDialogOpen(true)
  }

  const handleCreateUser = () => {
    setSelectedUser(null)
    setIsDialogOpen(true)
  }

  const handleUserSaved = (user: UserWithStats) => {
    if (selectedUser) {
      // Update existing user
      const updatedUsers = users.map((u) => (u.id === user.id ? user : u))
      setUsers(updatedUsers)
    } else {
      // Add new user
      setUsers([...users, user])
    }
    setIsDialogOpen(false)
    setSelectedUser(null)
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      case "managing_director":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20"
      case "sales_officer":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      case "storekeeper":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "inactive":
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
      case "suspended":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
    }
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>User Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search Users</label>
              <Input
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Role</label>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="managing_director">Managing Director</SelectItem>
                  <SelectItem value="sales_officer">Sales Officer</SelectItem>
                  <SelectItem value="storekeeper">Storekeeper</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Actions</label>
              <Button onClick={handleCreateUser} className="w-full">
                Add User
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto h-12 w-12 bg-muted rounded-lg flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">No users found</h3>
              <p className="text-muted-foreground">Try adjusting your search criteria</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredUsers.map((user) => (
                <div key={user.id} className="border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium">{user.name.charAt(0).toUpperCase()}</span>
                        </div>
                        <div>
                          <h3 className="font-semibold">{user.name}</h3>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                        <Badge className={getRoleColor(user.role)} variant="outline">
                          {user.role.replace("_", " ")}
                        </Badge>
                        <Badge className={getStatusColor(user.status)} variant="outline">
                          {user.status}
                        </Badge>
                      </div>
                      <div className="grid gap-2 md:grid-cols-4 text-sm text-muted-foreground">
                        <div>
                          <span className="font-medium">Created:</span> {new Date(user.createdAt).toLocaleDateString()}
                        </div>
                        <div>
                          <span className="font-medium">Last Login:</span>{" "}
                          {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : "Never"}
                        </div>
                        <div>
                          <span className="font-medium">Invoices:</span> {user.invoiceCount}
                        </div>
                        <div>
                          <span className="font-medium">Revenue:</span> ${user.totalRevenue.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Select
                        value={user.status}
                        onValueChange={(value: UserWithStats["status"]) => handleStatusChange(user.id, value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                          <SelectItem value="suspended">Suspended</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant="outline" size="sm" onClick={() => handleEditUser(user)}>
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* User Form Dialog */}
      <UserFormDialog
        user={selectedUser}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onUserSaved={handleUserSaved}
      />
    </div>
  )
}
