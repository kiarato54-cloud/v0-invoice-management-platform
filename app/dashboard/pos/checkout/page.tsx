"use client"

import type React from "react"

import { DashboardLayout } from "@/components/dashboard-layout"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useState, useMemo } from "react"
import { usePOSProducts } from "@/lib/hooks/usePOSProducts"
import { useBranches } from "@/lib/hooks/useBranches"
import { Skeleton } from "@/components/ui/skeleton"

interface CartItem {
  id: string
  name: string
  sku: string
  unitPrice: number
  quantity: number
  totalPrice: number
}

export default function CheckoutPage() {
  const { user } = useAuth()
  const { products, loading: productsLoading } = usePOSProducts()
  const { branches } = useBranches()

  const [cart, setCart] = useState<CartItem[]>([])
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [barcode, setBarcode] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [discount, setDiscount] = useState(0)
  const [taxRate, setTaxRate] = useState(0.18)
  const [selectedBranch, setSelectedBranch] = useState(branches[0]?.id || "")

  const categories = Array.from(new Set(products.map((p) => p.category)))
  const filtered = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = !selectedCategory || p.category === selectedCategory
    return matchesSearch && matchesCategory
  })

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

  const addToCart = (product: any, qty: number) => {
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
          unitPrice: product.unit_price,
          quantity: qty,
          totalPrice: qty * product.unit_price,
        },
      ]
    })

    setBarcode("")
    setQuantity(1)
  }

  const handleBarcodeSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const product = products.find((p) => p.barcode === barcode)
    if (product) {
      addToCart(product, quantity)
    }
  }

  const removeFromCart = (id: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id))
  }

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

  const handleCompleteSale = async () => {
    if (cart.length === 0) {
      alert("Cart is empty")
      return
    }

    try {
      const response = await fetch("/api/pos/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transaction: {
            branch_id: selectedBranch,
            cashier_id: user.id,
            subtotal: totals.subtotal,
            tax_amount: totals.taxAmount,
            tax_rate: taxRate * 100,
            discount_amount: totals.discountAmount,
            total_amount: totals.total,
            payment_method: "cash",
            status: "completed",
          },
          items: cart.map((item) => ({
            product_id: item.id,
            quantity: item.quantity,
            unit_price: item.unitPrice,
            total_price: item.totalPrice,
          })),
          payments: [
            {
              method: "cash",
              amount: totals.total,
              status: "verified",
            },
          ],
        }),
      })

      if (response.ok) {
        alert(`Sale completed: Ksh ${totals.total.toLocaleString()}`)
        setCart([])
        setDiscount(0)
      }
    } catch (error) {
      console.error("[v0] Transaction error:", error)
      alert("Failed to complete transaction")
    }
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
                    <label className="block text-sm font-medium">Branch</label>
                    <select
                      value={selectedBranch}
                      onChange={(e) => setSelectedBranch(e.target.value)}
                      className="w-full px-4 py-2 rounded-md bg-input border border-border"
                    >
                      {branches.map((branch) => (
                        <option key={branch.id} value={branch.id}>
                          {branch.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium">Scan Barcode or Manual Entry</label>
                    <input
                      type="text"
                      placeholder="Enter barcode..."
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

                {/* Search and Category Filter */}
                <div className="space-y-2 pt-4 border-t border-border">
                  <Input placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} />
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant={!selectedCategory ? "default" : "outline"}
                      onClick={() => setSelectedCategory(null)}
                    >
                      All
                    </Button>
                    {categories.map((category) => (
                      <Button
                        key={category}
                        size="sm"
                        variant={selectedCategory === category ? "default" : "outline"}
                        onClick={() => setSelectedCategory(category)}
                      >
                        {category}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Quick Product Buttons */}
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                  {productsLoading ? (
                    Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-16" />)
                  ) : filtered.length === 0 ? (
                    <div className="col-span-2 text-center py-4 text-muted-foreground">No products found</div>
                  ) : (
                    filtered.map((product) => (
                      <Button
                        key={product.id}
                        variant="outline"
                        size="sm"
                        onClick={() => addToCart(product, 1)}
                        className="h-auto py-2 text-xs text-left flex flex-col items-start"
                      >
                        <span className="font-semibold line-clamp-1">{product.name}</span>
                        <span className="text-muted-foreground">Ksh {product.unit_price.toLocaleString()}</span>
                      </Button>
                    ))
                  )}
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
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
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
                          <p className="font-bold">Ksh {item.totalPrice.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">@ Ksh {item.unitPrice.toLocaleString()}</p>
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
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-mono">Ksh {totals.subtotal.toLocaleString()}</span>
                </div>

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
                    <span className="font-mono text-red-500">- Ksh {totals.discountAmount.toLocaleString()}</span>
                  </div>
                </div>

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
                    <span className="font-mono">+ Ksh {totals.taxAmount.toLocaleString()}</span>
                  </div>
                </div>

                <div className="space-y-4 border-t border-border pt-4 bg-primary/10 -mx-6 -mb-6 p-6 rounded-b-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold">Total</span>
                    <span className="text-2xl font-bold text-primary">Ksh {totals.total.toLocaleString()}</span>
                  </div>

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
