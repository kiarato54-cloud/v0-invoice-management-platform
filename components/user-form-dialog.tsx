"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { createUser, saveUser, type UserWithStats } from "@/lib/user-management"

interface UserFormDialogProps {
  user: UserWithStats | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUserSaved: (user: UserWithStats) => void
}

export function UserFormDialog({ user, open, onOpenChange, onUserSaved }: UserFormDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "sales_officer" as UserWithStats["role"],
    status: "active" as UserWithStats["status"],
    isActive: true,
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        isActive: user.isActive,
      })
    } else {
      setFormData({
        name: "",
        email: "",
        role: "sales_officer",
        status: "active",
        isActive: true,
      })
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      let savedUser: UserWithStats

      if (user) {
        // Update existing user
        savedUser = {
          ...user,
          ...formData,
        }
        saveUser(savedUser)
      } else {
        // Create new user
        savedUser = createUser(formData)
      }

      onUserSaved(savedUser)
    } catch (error) {
      console.error("Error saving user:", error)
      alert("Failed to save user. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{user ? "Edit User" : "Create New User"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select
              value={formData.role}
              onValueChange={(value: UserWithStats["role"]) => setFormData({ ...formData, role: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="managing_director">Managing Director</SelectItem>
                <SelectItem value="sales_officer">Sales Officer</SelectItem>
                <SelectItem value="storekeeper">Storekeeper</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value: UserWithStats["status"]) =>
                setFormData({ ...formData, status: value, isActive: value === "active" })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : user ? "Update User" : "Create User"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
