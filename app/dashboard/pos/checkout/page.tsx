"use client"

import type React from "react"

import { DashboardLayout } from "@/components/dashboard-layout"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState, useMemo } from "react"

interface CartItem {
  id: string
  name: string
  sku: string
  unitPrice: number
  quantity: number
  totalPrice: number
}

interface Product {
  id: string
  name: string
  sku: string
  barcode: string
  unitPrice: number
}

// Mock products for checkout
const mockProducts: Product[] = [
  { id: "1", name: "Cement 50kg", sku: "CMT-001", barcode: "1234567890001", unitPrice: 12000 },
  { id: "2", name: "Iron Sheets", sku: "IRS-001", barcode: "1234567890002", unitPrice: 45000 },
  { id: "3", name: "Wooden Planks", sku: "WDP-001", barcode: "1234567890003", unitPrice: 5000 },
  { id: "4", name: "Nails 1kg", sku: "NAL-001", barcode: "1234567890004", unitPrice: 2000 },
  { id: "5", name: "Paint 5L", sku: "PAT-001", barcode: "1234567890005", unitPrice: 35000 },
]

export default function CheckoutPage() {
  const { user } = useAuth()
  const [cart, setCart] = useState<CartItem[]>([])
  const [barcode, setBarcode] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [discount, setDiscount] = useState(0)
  const [taxRate, setTaxRate] = useState(0.18) // 18% tax

  const totals = useMemo(() => {
    const subtotal = cart.reduce((sum, item) => sum + item.totalPrice, 0)
    const discountAmount = subtotal * (discount / 100)
    const taxableAmount = subtotal - discountAmount
    const taxAmount = taxableAmount * taxRate
    const total = taxableAmount + taxAmount

    return {
      subtotal,
      discountAmount,
      taxableAmount,
      taxAmount,
      total,
    }
  }, [cart, discount, taxRate])

  if (!user) return null

  // Add item to cart
  const addToCart = (product: Product, qty: number) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id)

      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + qty,
                totalPrice: (item.quantity + qty) * item.unitPrice,
              }
            : item,
        )
      }

      return [
        ...prevCart,
        {
          id: product.id,
          name: product.name,
          sku: product.sku,
          unitPrice: product.unitPrice,
          quantity: qty,
          totalPrice: qty * product.unitPrice,
        },
      ]
    })

    setBarcode("")
    setQuantity(1)
  }

  // Handle barcode scan
  const handleBarcodeSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const product = mockProducts.find((p) => p.barcode === barcode)
    if (product) {
      addToCart(product, quantity)
    }
  }

  // Remove item from cart
  const removeFromCart = (id: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id))
  }

  // Update quantity
  const updateQuantity = (id: string, newQty: number) => {
    if (newQty <= 0) {
      removeFromCart(id)
      return
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: newQty,
              totalPrice: newQty * item.unitPrice,
            }
          : item,
      ),
    )
  }

  // Complete sale
  const handleCompleteSale = () => {
    if (cart.length === 0) {
      alert("Cart is empty")
      return
    }
    alert(`Sale completed: Tshs ${totals.total.toLocaleString()}`)
    setCart([])
    setDiscount(0)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Point of Sale Checkout</h1>
          <p className="text-muted-foreground mt-1">Fast and efficient sales transaction processing</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left: Product Selection */}
          <div className="lg:col-span-2 space-y-4">
            {/* Barcode Scanner */}
            <Card>
              <CardHeader>
                <CardTitle>Add Items</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handleBarcodeSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">Scan Barcode or Manual Entry</label>
                    <input
                      type="text"
                      placeholder="Enter barcode or product SKU..."
                      value={barcode}
                      onChange={(e) => setBarcode(e.target.value)}
                      autoFocus
                      className="w-full px-4 py-2 rounded-md bg-input border border-border font-mono text-lg"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium">Quantity</label>
                      <input
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, Number.parseInt(e.target.value) || 1))}
                        className="w-full px-4 py-2 rounded-md bg-input border border-border"
                      />
                    </div>
                    <div className="flex flex-col justify-end">
                      <Button type="submit" className="w-full">
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </form>

                {/* Quick Product Buttons */}
                <div className="space-y-2 pt-4 border-t border-border">
                  <p className="text-sm font-medium">Quick Add</p>
                  <div className="grid grid-cols-2 gap-2">
                    {mockProducts.map((product) => (
                      <Button
                        key={product.id}
                        variant="outline"
                        size="sm"
                        onClick={() => addToCart(product, 1)}
                        className="h-auto py-2 text-xs text-left flex flex-col items-start"
                      >
                        <span className="font-semibold">{product.name}</span>
                        <span className="text-muted-foreground">Tshs {product.unitPrice.toLocaleString()}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cart Items */}
            <Card>
              <CardHeader>
                <CardTitle>Cart Items ({cart.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {cart.length === 0 ? (
                  <div className="py-8 text-center text-muted-foreground">
                    <p>No items in cart</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-secondary/30 rounded-md">
                        <div className="flex-1">
                          <p className="font-semibold">{item.name}</p>
                          <p className="text-sm text-muted-foreground">{item.sku}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="px-2 py-1 rounded-md bg-input hover:bg-secondary"
                          >
                            -
                          </button>
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.id, Number.parseInt(e.target.value) || 1)}
                            className="w-12 px-2 py-1 rounded-md bg-input border border-border text-center"
                          />
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-2 py-1 rounded-md bg-input hover:bg-secondary"
                          >
                            +
                          </button>
                        </div>
                        <div className="text-right ml-4 min-w-32">
                          <p className="font-bold">Tshs {item.totalPrice.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">@ Tshs {item.unitPrice.toLocaleString()}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart(item.id)}
                          className="ml-2 text-destructive hover:text-destructive"
                        >
                          ✕
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right: Payment Summary */}
          <div className="space-y-4">
            {/* Summary Card */}
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Subtotal */}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-mono">Tshs {totals.subtotal.toLocaleString()}</span>
                </div>

                {/* Discount */}
                <div className="space-y-2 border-t border-border pt-2">
                  <label className="block text-sm font-medium">Discount %</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={discount}
                    onChange={(e) => setDiscount(Math.max(0, Number.parseInt(e.target.value) || 0))}
                    className="w-full px-3 py-2 rounded-md bg-input border border-border text-right"
                  />
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Discount</span>
                    <span className="font-mono text-red-500">- Tshs {totals.discountAmount.toLocaleString()}</span>
                  </div>
                </div>

                {/* Tax */}
                <div className="space-y-2 border-t border-border pt-2">
                  <label className="block text-sm font-medium">Tax Rate</label>
                  <div className="flex gap-2">
                    {[0, 0.08, 0.18].map((rate) => (
                      <Button
                        key={rate}
                        size="sm"
                        variant={taxRate === rate ? "default" : "outline"}
                        onClick={() => setTaxRate(rate)}
                        className="flex-1 text-xs"
                      >
                        {(rate * 100).toFixed(0)}%
                      </Button>
                    ))}
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax ({(taxRate * 100).toFixed(0)}%)</span>
                    <span className="font-mono">+ Tshs {totals.taxAmount.toLocaleString()}</span>
                  </div>
                </div>

                {/* Total */}
                <div className="space-y-4 border-t border-border pt-4 bg-primary/10 -mx-6 -mb-6 p-6 rounded-b-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold">Total</span>
                    <span className="text-2xl font-bold text-primary">Tshs {totals.total.toLocaleString()}</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2 pt-4">
                    <Button onClick={handleCompleteSale} className="w-full" size="lg">
                      Complete Sale
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full bg-transparent"
                      onClick={() => {
                        setCart([])
                        setDiscount(0)
                      }}
                    >
                      Clear Cart
                    </Button>
                    <Button variant="outline" className="w-full bg-transparent">
                      Print Receipt
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Transaction Info */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Transaction Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Cashier</span>
                  <span className="font-medium">{user.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Branch</span>
                  <span className="font-medium">Main Branch</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Time</span>
                  <span className="font-medium">{new Date().toLocaleTimeString()}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
