"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Invoice } from "@/lib/invoice-data"
import Image from "next/image"

interface InvoicePreviewProps {
  invoice: Invoice
  onClose: () => void
}

export function InvoicePreview({ invoice, onClose }: InvoicePreviewProps) {
  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 print:p-0 print:bg-white">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-auto print:max-h-none print:overflow-visible print:shadow-none print:border-0">
        <CardContent className="p-8 relative invoice-print-area print:p-6">
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none print-watermark print:opacity-[0.03]">
            <div className="transform rotate-[-45deg] text-6xl font-bold text-gray-400 select-none whitespace-nowrap">
              HURUMA HARDWARE
            </div>
          </div>

          {/* Header */}
          <div className="flex justify-between items-start mb-6 print:mb-4">
            <div className="flex items-start gap-4">
              <div className="h-16 w-16 relative flex-shrink-0 print:h-12 print:w-12">
                <Image
                  src="/images/huruma-hardware-logo.jpg"
                  alt="Huruma Hardware Company Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-primary print:text-black print:text-2xl">
                  Huruma Hardware Company
                </h1>
                <p className="text-muted-foreground print:text-black text-sm">P.O Box 75360, Dar es Salaam</p>
                <p className="text-sm text-muted-foreground print:text-black">Mobile: +255715626807</p>
                <p className="text-sm text-muted-foreground print:text-black">
                  Locations: 1. Kimara-Mwisho, 2. Kimara-Suka
                </p>
              </div>
            </div>
            <div className="text-right">
              <h2 className="text-2xl font-bold print:text-black print:text-xl">INVOICE</h2>
              <p className="text-lg font-semibold print:text-black print:text-base">{invoice.invoiceNumber}</p>
              <p className="text-sm text-muted-foreground print:text-black">
                Date: {new Date(invoice.createdAt).toLocaleDateString()}
              </p>
              <p className="text-sm text-muted-foreground print:text-black">
                Due: {new Date(invoice.dueDate).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Customer Info */}
          <div className="mb-6 print:mb-4">
            <h3 className="font-semibold mb-2 print:text-black">Bill To:</h3>
            <div className="text-sm print:text-black">
              <p className="font-medium">{invoice.customer.name}</p>
              <p>{invoice.customer.address}</p>
              <p>
                {invoice.customer.city}, {invoice.customer.state} {invoice.customer.zipCode}
              </p>
              <p>Email: {invoice.customer.email}</p>
              <p>Phone: {invoice.customer.phone}</p>
              {invoice.customer.paymentMethod && (
                <p>Payment Method: {invoice.customer.paymentMethod.replace("_", " ").toUpperCase()}</p>
              )}
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-6 print:mb-4">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-black">
                  <th className="text-left py-2 font-semibold print:text-black print:text-sm">Item</th>
                  <th className="text-left py-2 font-semibold print:text-black print:text-sm">Description</th>
                  <th className="text-right py-2 font-semibold print:text-black print:text-sm">Qty</th>
                  <th className="text-right py-2 font-semibold print:text-black print:text-sm">Unit Price (Tshs)</th>
                  <th className="text-right py-2 font-semibold print:text-black print:text-sm">Total (Tshs)</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item) => (
                  <tr key={item.id} className="border-b border-gray-300">
                    <td className="py-2 print:text-black print:text-sm">{item.name}</td>
                    <td className="py-2 text-muted-foreground print:text-black print:text-sm">{item.description}</td>
                    <td className="py-2 text-right print:text-black print:text-sm">{item.quantity}</td>
                    <td className="py-2 text-right print:text-black print:text-sm">
                      Tshs {item.unitPrice.toLocaleString()}
                    </td>
                    <td className="py-2 text-right font-medium print:text-black print:text-sm">
                      Tshs {item.total.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-start mb-6 print:mb-4 gap-8">
            {/* Signatures on the left */}
            <div className="flex-1">
              <h3 className="font-semibold mb-3 print:text-black print:text-sm">Signatures:</h3>
              <div className="space-y-4">
                <div>
                  <div className="border-b border-black mb-1 pb-6 h-12">{/* Signature space */}</div>
                  <p className="text-sm font-medium print:text-black">{invoice.storeKeeperName || "Store Keeper"}</p>
                  <p className="text-xs text-muted-foreground print:text-black">Store Keeper</p>
                </div>
                <div>
                  <div className="border-b border-black mb-1 pb-6 h-12">{/* Signature space */}</div>
                  <p className="text-sm font-medium print:text-black">{invoice.salesOfficerName || "Sales Officer"}</p>
                  <p className="text-xs text-muted-foreground print:text-black">Sales Officer</p>
                </div>
                <div>
                  <div className="border-b border-black mb-1 pb-6 h-12">{/* Signature space */}</div>
                  <p className="text-sm font-medium print:text-black">{invoice.driverName || "Driver"}</p>
                  <p className="text-xs text-muted-foreground print:text-black">Driver</p>
                  {invoice.vehiclePlateNumber && (
                    <p className="text-xs text-muted-foreground print:text-black mt-1">
                      Vehicle: {invoice.vehiclePlateNumber}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Totals on the right */}
            <div className="w-64 flex-shrink-0">
              <div className="flex justify-between py-2 print:text-black">
                <span>Subtotal:</span>
                <span>Tshs {invoice.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2 print:text-black">
                <span>VAT (18%):</span>
                <span>Tshs {invoice.tax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2 border-t-2 border-black font-semibold text-lg print:text-black">
                <span>Total:</span>
                <span>Tshs {invoice.total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {invoice.notes && (
            <div className="mb-6 print:mb-4">
              <h3 className="font-semibold mb-2 print:text-black print:text-sm">Notes:</h3>
              <p className="text-sm text-muted-foreground print:text-black">{invoice.notes}</p>
            </div>
          )}

          {/* Footer */}
          <div className="text-center text-sm text-muted-foreground border-t border-black pt-3 print:text-black">
            <p>Thank you for your business!</p>
            <p>Payment is due within 3 days of invoice date.</p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 mt-8 print:hidden">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button onClick={handlePrint}>Print Invoice (2 Copies)</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
