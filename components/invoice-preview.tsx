"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Invoice } from "@/lib/invoice-data"

interface InvoicePreviewProps {
  invoice: Invoice
  onClose: () => void
}

export function InvoicePreview({ invoice, onClose }: InvoicePreviewProps) {
  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-auto">
        <CardContent className="p-8">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold text-primary">InvoiceHub</h1>
              <p className="text-muted-foreground">Hardware Solutions Company</p>
              <p className="text-sm text-muted-foreground">123 Business Street, City, State 12345</p>
              <p className="text-sm text-muted-foreground">Phone: (555) 123-4567 | Email: info@invoicehub.com</p>
            </div>
            <div className="text-right">
              <h2 className="text-2xl font-bold">INVOICE</h2>
              <p className="text-lg font-semibold">{invoice.invoiceNumber}</p>
              <p className="text-sm text-muted-foreground">Date: {new Date(invoice.createdAt).toLocaleDateString()}</p>
              <p className="text-sm text-muted-foreground">Due: {new Date(invoice.dueDate).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Customer Info */}
          <div className="mb-8">
            <h3 className="font-semibold mb-2">Bill To:</h3>
            <div className="text-sm">
              <p className="font-medium">{invoice.customer.name}</p>
              <p>{invoice.customer.address}</p>
              <p>
                {invoice.customer.city}, {invoice.customer.state} {invoice.customer.zipCode}
              </p>
              <p>Email: {invoice.customer.email}</p>
              <p>Phone: {invoice.customer.phone}</p>
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-8">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 font-semibold">Item</th>
                  <th className="text-left py-2 font-semibold">Description</th>
                  <th className="text-right py-2 font-semibold">Qty</th>
                  <th className="text-right py-2 font-semibold">Unit Price</th>
                  <th className="text-right py-2 font-semibold">Total</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item) => (
                  <tr key={item.id} className="border-b border-border/50">
                    <td className="py-3">{item.name}</td>
                    <td className="py-3 text-muted-foreground">{item.description}</td>
                    <td className="py-3 text-right">{item.quantity}</td>
                    <td className="py-3 text-right">${item.unitPrice.toFixed(2)}</td>
                    <td className="py-3 text-right font-medium">${item.total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end mb-8">
            <div className="w-64">
              <div className="flex justify-between py-2">
                <span>Subtotal:</span>
                <span>${invoice.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span>Tax (10%):</span>
                <span>${invoice.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2 border-t border-border font-semibold text-lg">
                <span>Total:</span>
                <span>${invoice.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {invoice.notes && (
            <div className="mb-8">
              <h3 className="font-semibold mb-2">Notes:</h3>
              <p className="text-sm text-muted-foreground">{invoice.notes}</p>
            </div>
          )}

          {/* Footer */}
          <div className="text-center text-sm text-muted-foreground border-t border-border pt-4">
            <p>Thank you for your business!</p>
            <p>Payment is due within 30 days of invoice date.</p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 mt-8 print:hidden">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button onClick={handlePrint}>Print Invoice</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
