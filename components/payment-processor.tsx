"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface PaymentProcessorProps {
  totalAmount: number
  onPaymentComplete: (payment: PaymentData) => void
  onCancel: () => void
}

export interface PaymentData {
  method: string
  amountTendered: number
  amountPaid: number
  changeAmount: number
  referenceNumber?: string
  verificationCode?: string
}

export function PaymentProcessor({ totalAmount, onPaymentComplete, onCancel }: PaymentProcessorProps) {
  const [paymentMethod, setPaymentMethod] = useState<string>("cash")
  const [amountTendered, setAmountTendered] = useState<string>("")
  const [referenceNumber, setReferenceNumber] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [processing, setProcessing] = useState(false)

  const paymentMethods = [
    { id: "cash", label: "Cash", icon: "💵", requiresRef: false },
    { id: "card", label: "Card", icon: "💳", requiresRef: true },
    { id: "mobile_money", label: "Mobile Money", icon: "📱", requiresRef: true },
    { id: "cheque", label: "Cheque", icon: "📄", requiresRef: true },
  ]

  const amountNum = Number.parseFloat(amountTendered) || 0
  const changeAmount = Math.max(0, amountNum - totalAmount)
  const isValid = amountNum >= totalAmount

  const handlePayment = async () => {
    if (!isValid) return

    setProcessing(true)
    // Simulate payment processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    onPaymentComplete({
      method: paymentMethod,
      amountTendered: amountNum,
      amountPaid: totalAmount,
      changeAmount,
      referenceNumber,
      verificationCode,
    })
  }

  const currentMethod = paymentMethods.find((m) => m.id === paymentMethod)

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Payment Processing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Total Amount */}
          <div className="bg-primary/10 p-4 rounded-lg text-center">
            <p className="text-sm text-muted-foreground mb-1">Total Amount</p>
            <p className="text-3xl font-bold text-primary">Tshs {totalAmount.toLocaleString()}</p>
          </div>

          {/* Payment Method Selection */}
          <div className="space-y-3">
            <label className="block text-sm font-medium">Select Payment Method</label>
            <div className="grid grid-cols-2 gap-2">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    paymentMethod === method.id
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="text-2xl mb-1">{method.icon}</div>
                  <div className="text-sm font-medium">{method.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Amount Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">Amount Tendered</label>
            <input
              type="number"
              value={amountTendered}
              onChange={(e) => setAmountTendered(e.target.value)}
              placeholder="Enter amount"
              className="w-full px-4 py-2 rounded-md bg-input border border-border text-lg font-mono"
              disabled={paymentMethod === "cheque"}
            />
            {paymentMethod === "cheque" && (
              <p className="text-xs text-muted-foreground">Amount auto-filled for cheque</p>
            )}
          </div>

          {/* Change Display */}
          {amountNum > 0 && (
            <div className="bg-secondary/50 p-3 rounded-lg">
              <div className="flex justify-between mb-1">
                <span className="text-sm text-muted-foreground">Change</span>
                <span className="font-mono font-bold">Tshs {changeAmount.toLocaleString()}</span>
              </div>
              <div className="text-xs text-muted-foreground">
                {amountNum < totalAmount && <span className="text-destructive">Insufficient amount</span>}
              </div>
            </div>
          )}

          {/* Reference/Auth Code Input */}
          {currentMethod?.requiresRef && (
            <div className="space-y-2">
              <label className="block text-sm font-medium">Reference Number</label>
              <input
                type="text"
                value={referenceNumber}
                onChange={(e) => setReferenceNumber(e.target.value)}
                placeholder="Auth code, MPESA ref, Cheque number..."
                className="w-full px-4 py-2 rounded-md bg-input border border-border text-sm"
              />
            </div>
          )}

          {/* Verification Code Input */}
          {paymentMethod === "mobile_money" && (
            <div className="space-y-2">
              <label className="block text-sm font-medium">Verification Code</label>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Enter 4-digit code"
                maxLength={4}
                className="w-full px-4 py-2 rounded-md bg-input border border-border text-sm font-mono text-center text-2xl tracking-widest"
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onCancel} className="flex-1 bg-transparent" disabled={processing}>
              Cancel
            </Button>
            <Button onClick={handlePayment} disabled={!isValid || processing} className="flex-1" size="lg">
              {processing ? "Processing..." : `Complete Payment`}
            </Button>
          </div>

          {/* Payment Info */}
          <div className="text-xs text-muted-foreground text-center pt-2">
            {paymentMethod === "cash" && "Exact change or provide notes/coins"}
            {paymentMethod === "card" && "Insert/tap card and enter PIN"}
            {paymentMethod === "mobile_money" && "Customer confirms payment on phone"}
            {paymentMethod === "cheque" && "Verify cheque details before acceptance"}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
