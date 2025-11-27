"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash2, Plus, Minus } from "lucide-react"

interface CartItem {
  id: string
  name: string
  sku: string
  quantity: number
  unit_price: number
  total: number
}

interface POSCartProps {
  items: CartItem[]
  onUpdateQuantity: (id: string, quantity: number) => void
  onRemoveItem: (id: string) => void
  taxRate: number
  onTaxRateChange: (rate: number) => void
  discountAmount: number
  onDiscountChange: (amount: number) => void
  onCheckout: () => void
}

export function POSCart({
  items,
  onUpdateQuantity,
  onRemoveItem,
  taxRate,
  onTaxRateChange,
  discountAmount,
  onDiscountChange,
  onCheckout,
}: POSCartProps) {
  const subtotal = items.reduce((sum, item) => sum + item.total, 0)
  const taxAmount = subtotal * (taxRate / 100)
  const total = subtotal + taxAmount - discountAmount

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle>Shopping Cart</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col space-y-4">
        {/* Cart Items */}
        <div className="flex-1 space-y-2 overflow-y-auto max-h-64">
          {items.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">No items in cart</div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-2 bg-muted rounded-lg text-sm">
                <div className="flex-1">
                  <div className="font-medium line-clamp-1">{item.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {item.quantity} × Ksh {item.unit_price.toFixed(2)}
                  </div>
                </div>
                <div className="flex items-center gap-1 mr-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-6 w-6 p-0 bg-transparent"
                    onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-6 text-center">{item.quantity}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-6 w-6 p-0 bg-transparent"
                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
                <div className="text-right mr-2">
                  <div className="font-semibold">Ksh {item.total.toFixed(2)}</div>
                </div>
                <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => onRemoveItem(item.id)}>
                  <Trash2 className="h-3 w-3 text-destructive" />
                </Button>
              </div>
            ))
          )}
        </div>

        {/* Totals */}
        <div className="space-y-2 border-t pt-3 text-sm">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>Ksh {subtotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between items-center">
            <label className="text-xs">Tax Rate (%):</label>
            <Input
              type="number"
              min="0"
              max="100"
              step="0.01"
              value={taxRate}
              onChange={(e) => onTaxRateChange(Number.parseFloat(e.target.value))}
              className="w-20 h-7"
            />
          </div>

          <div className="flex justify-between">
            <span>Tax:</span>
            <span>Ksh {taxAmount.toFixed(2)}</span>
          </div>

          <div className="flex justify-between items-center">
            <label className="text-xs">Discount:</label>
            <Input
              type="number"
              min="0"
              value={discountAmount}
              onChange={(e) => onDiscountChange(Number.parseFloat(e.target.value) || 0)}
              className="w-20 h-7"
            />
          </div>

          <div className="flex justify-between font-bold text-base border-t pt-2">
            <span>Total:</span>
            <span className="text-primary">Ksh {total.toFixed(2)}</span>
          </div>
        </div>

        {/* Checkout Button */}
        <Button onClick={onCheckout} disabled={items.length === 0} className="w-full" size="lg">
          Proceed to Checkout
        </Button>
      </CardContent>
    </Card>
  )
}
