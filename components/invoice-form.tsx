"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { type Customer, type Invoice, type InvoiceItem, getCustomers, saveInvoice } from "@/lib/invoice-data"
import { useAuth } from "./auth-provider"
import { useRouter } from "next/navigation"

export function InvoiceForm() {
  const { user } = useAuth()
  const router = useRouter()
  const customers = getCustomers()

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
  })
  const [isNewCustomer, setIsNewCustomer] = useState(false)
  const [items, setItems] = useState<InvoiceItem[]>([
    {
      id: "1",
      name: "",
      description: "",
      quantity: 1,
      unitPrice: 0,
      total: 0,
    },
  ])
  const [dueDate, setDueDate] = useState("")
  const [notes, setNotes] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      name: "",
      description: "",
      quantity: 1,
      unitPrice: 0,
      total: 0,
    }
    setItems([...items, newItem])
  }

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id))
    }
  }

  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value }
          if (field === "quantity" || field === "unitPrice") {
            updatedItem.total = updatedItem.quantity * updatedItem.unitPrice
          }
          return updatedItem
        }
        return item
      }),
    )
  }

  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + item.total, 0)
    const tax = subtotal * 0.1 // 10% tax
    const total = subtotal + tax
    return { subtotal, tax, total }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setIsLoading(true)

    try {
      const customer = isNewCustomer ? { id: Date.now().toString(), ...newCustomer } : selectedCustomer

      if (!customer) {
        alert("Please select or add a customer")
        return
      }

      const { subtotal, tax, total } = calculateTotals()

      const invoice: Invoice = {
        id: Date.now().toString(),
        invoiceNumber: `INV-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`,
        customerId: customer.id,
        customer,
        items: items.filter((item) => item.name.trim() !== ""),
        subtotal,
        tax,
        total,
        status: "draft",
        createdBy: user.id,
        createdAt: new Date().toISOString().split("T")[0],
        dueDate,
        notes,
      }

      saveInvoice(invoice)
      router.push("/dashboard/invoices")
    } catch (error) {
      console.error("Error creating invoice:", error)
      alert("Failed to create invoice. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const { subtotal, tax, total } = calculateTotals()

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Customer Information */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Button
              type="button"
              variant={!isNewCustomer ? "default" : "outline"}
              size="sm"
              onClick={() => setIsNewCustomer(false)}
            >
              Existing Customer
            </Button>
            <Button
              type="button"
              variant={isNewCustomer ? "default" : "outline"}
              size="sm"
              onClick={() => setIsNewCustomer(true)}
            >
              New Customer
            </Button>
          </div>

          {!isNewCustomer ? (
            <div className="space-y-2">
              <Label htmlFor="customer">Select Customer</Label>
              <Select onValueChange={(value) => setSelectedCustomer(customers.find((c) => c.id === value) || null)}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a customer" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.name} - {customer.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="customerName">Company Name</Label>
                <Input
                  id="customerName"
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customerEmail">Email</Label>
                <Input
                  id="customerEmail"
                  type="email"
                  value={newCustomer.email}
                  onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customerPhone">Phone</Label>
                <Input
                  id="customerPhone"
                  value={newCustomer.phone}
                  onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customerAddress">Address</Label>
                <Input
                  id="customerAddress"
                  value={newCustomer.address}
                  onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customerCity">City</Label>
                <Input
                  id="customerCity"
                  value={newCustomer.city}
                  onChange={(e) => setNewCustomer({ ...newCustomer, city: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customerState">State</Label>
                <Input
                  id="customerState"
                  value={newCustomer.state}
                  onChange={(e) => setNewCustomer({ ...newCustomer, state: e.target.value })}
                  required
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Invoice Items */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Invoice Items</CardTitle>
          <Button type="button" onClick={addItem} size="sm">
            Add Item
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={item.id} className="grid gap-4 md:grid-cols-6 p-4 border border-border rounded-lg">
                <div className="space-y-2">
                  <Label>Item Name</Label>
                  <Input
                    value={item.name}
                    onChange={(e) => updateItem(item.id, "name", e.target.value)}
                    placeholder="Item name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Input
                    value={item.description}
                    onChange={(e) => updateItem(item.id, "description", e.target.value)}
                    placeholder="Description"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Quantity</Label>
                  <Input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateItem(item.id, "quantity", Number.parseInt(e.target.value) || 1)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Unit Price</Label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.unitPrice}
                    onChange={(e) => updateItem(item.id, "unitPrice", Number.parseFloat(e.target.value) || 0)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Total</Label>
                  <Input value={`$${item.total.toFixed(2)}`} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Action</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeItem(item.id)}
                    disabled={items.length === 1}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Invoice Details */}
      <Card>
        <CardHeader>
          <CardTitle>Invoice Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input id="dueDate" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional notes or payment terms"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Invoice Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Invoice Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (10%):</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold text-lg border-t border-border pt-2">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create Invoice"}
        </Button>
      </div>
    </form>
  )
}
