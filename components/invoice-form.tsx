"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { type Customer, type Invoice, type InvoiceItem, saveInvoice } from "@/lib/invoice-data"
import { useCustomers } from "@/lib/hooks/useCustomers"
import { useAuth } from "./auth-provider"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { saveCustomer } from "@/lib/invoice-data"

export function InvoiceForm() {
  const { user } = useAuth()
  const router = useRouter()
  const { customers, loading, error } = useCustomers()

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    paymentMethod: "",
  })
  const [isNewCustomer, setIsNewCustomer] = useState(false)
  const [items, setItems] = useState<InvoiceItem[]>([
    {
      id: "1",
      name: "",
      description: "",
      quantity: 0,
      unitPrice: 0,
      total: 0,
    },
  ])
  const [dueDate, setDueDate] = useState("")
  const [notes, setNotes] = useState("")
  const [storeKeeperName, setStoreKeeperName] = useState("")
  const [salesOfficerName, setSalesOfficerName] = useState(user?.name || "")
  const [driverName, setDriverName] = useState("")
  const [vehiclePlateNumber, setVehiclePlateNumber] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      name: "",
      description: "",
      quantity: 0,
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
    const tax = subtotal * 0.18
    const total = subtotal + tax
    return { subtotal, tax, total }
  }

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  if (!user) return

  setIsLoading(true)

  try {
    let customer = selectedCustomer

    // If it's a new customer, generate a proper UUID
    if (isNewCustomer) {
      customer = {
        id: crypto.randomUUID(), // Generate proper UUID
        ...newCustomer
      }
    }

    if (!customer || !customer.id) {
      alert("Please select or add a customer")
      return
    }

    const { subtotal, tax, total } = calculateTotals()

    const invoice: Invoice = {
      // No id - let database generate it
      invoiceNumber: `HHC-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`,
      customerId: customer.id, // Now this is a proper UUID
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
      storeKeeperName,
      salesOfficerName,
      driverName,
      vehiclePlateNumber,
    }
      await saveInvoice(invoice)
      router.push("/dashboard/invoices")
    } catch (error) {
      console.error("Error creating invoice:", error)
      alert("Failed to create invoice. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const { subtotal, tax, total } = calculateTotals()

  // Show loading state
  if (loading) {
    return <div className="flex justify-center p-8">Loading customers...</div>
  }

  // Show error state
  if (error) {
    return (
      <div className="text-center text-destructive p-8">
        Error loading customers: {error}
      </div>
    )
  }

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
                <Label htmlFor="paymentMethod">Payment Method</Label>
                <Select onValueChange={(value) => setNewCustomer({ ...newCustomer, paymentMethod: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    <SelectItem value="mobile_money">Mobile Money (M-Pesa/Tigo Pesa)</SelectItem>
                    <SelectItem value="cheque">Cheque</SelectItem>
                    <SelectItem value="credit">Credit</SelectItem>
                  </SelectContent>
                </Select>
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
                <Label htmlFor="customerState">Region</Label>
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
                    value={item.quantity || ""}
                    onChange={(e) => updateItem(item.id, "quantity", Number.parseInt(e.target.value) || 0)}
                    placeholder="0"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Unit Price (Tshs)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={item.unitPrice || ""}
                    onChange={(e) => updateItem(item.id, "unitPrice", Number.parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Total (Tshs)</Label>
                  <Input value={`Tshs ${item.total.toLocaleString()}`} disabled />
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

          <div className="border-t border-border pt-4">
            <h3 className="font-semibold mb-4">Signature Fields</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="storeKeeperName">Store Keeper Name</Label>
                <Input
                  id="storeKeeperName"
                  value={storeKeeperName}
                  onChange={(e) => setStoreKeeperName(e.target.value)}
                  placeholder="Store keeper name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="salesOfficerName">Sales Officer Name</Label>
                <Input
                  id="salesOfficerName"
                  value={salesOfficerName}
                  onChange={(e) => setSalesOfficerName(e.target.value)}
                  placeholder="Sales officer name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="driverName">Driver Name</Label>
                <Input
                  id="driverName"
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                  placeholder="Driver name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vehiclePlateNumber">Vehicle Plate Number</Label>
                <Input
                  id="vehiclePlateNumber"
                  value={vehiclePlateNumber}
                  onChange={(e) => setVehiclePlateNumber(e.target.value)}
                  placeholder="e.g., T123 ABC"
                />
              </div>
            </div>
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
              <span>Tshs {subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>VAT (18%):</span>
              <span>Tshs {tax.toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-semibold text-lg border-t border-border pt-2">
              <span>Total:</span>
              <span>Tshs {total.toLocaleString()}</span>
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
