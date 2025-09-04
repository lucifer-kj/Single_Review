"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"

interface InvoiceItem {
  id: string
  description: string
  price: number
  quantity: number
  total: number
}

export default function NewInvoicePage() {
  const [invoiceNumber, setInvoiceNumber] = useState("231")
  const [invoiceDate, setInvoiceDate] = useState("2024-02-04")
  const [dueDate, setDueDate] = useState("2024-02-18")
  const [clientName, setClientName] = useState("ABC Company")
  const [items, setItems] = useState<InvoiceItem[]>([
    {
      id: "1",
      description: "Laptop Model XYZ",
      price: 1200,
      quantity: 5,
      total: 6000,
    },
  ])
  const [taxRate] = useState(5) // 5% tax rate
  const [isLoading, setIsLoading] = useState(false)
  const [invoiceResult, setInvoiceResult] = useState<any>(null)

  const subtotal = items.reduce((sum, item) => sum + item.total, 0)
  const taxAmount = (subtotal * taxRate) / 100
  const totalAmount = subtotal + taxAmount

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: "",
      price: 0,
      quantity: 1,
      total: 0,
    }
    setItems([...items, newItem])
  }

  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value }
          if (field === "price" || field === "quantity") {
            updatedItem.total = updatedItem.price * updatedItem.quantity
          }
          return updatedItem
        }
        return item
      }),
    )
  }

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id))
  }

  const handleSendInvoice = async () => {
    setIsLoading(true)
    try {
      const invoiceData = {
        invoiceNumber,
        invoiceDate,
        dueDate,
        clientName,
        items,
        subtotal,
        taxRate,
        taxAmount,
        totalAmount,
      }

      console.log("[v0] Sending invoice data:", invoiceData)

      const response = await fetch("/api/webhook/invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(invoiceData),
      })

      const result = await response.json()

      if (result.success) {
        setInvoiceResult(result.invoice)
        console.log("[v0] Invoice sent successfully:", result)
      } else {
        console.error("[v0] Failed to send invoice:", result.error)
      }
    } catch (error) {
      console.error("[v0] Error sending invoice:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleScheduleDelivery = async () => {
    setIsLoading(true)
    try {
      console.log("[v0] Scheduling delivery for invoice:", invoiceNumber)

      await new Promise((resolve) => setTimeout(resolve, 1000))

      // In production, this would call a scheduling service
      console.log("[v0] Delivery scheduled successfully")
    } catch (error) {
      console.error("[v0] Error scheduling delivery:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (invoiceResult) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="sticky top-0 z-50 bg-background border-b border-border">
          <div className="flex items-center justify-between p-4">
            <button onClick={() => setInvoiceResult(null)} className="p-2 hover:bg-muted rounded-lg transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="text-center">
              <h1 className="text-xl font-semibold text-foreground">Invoice Sent</h1>
              <p className="text-sm text-muted-foreground">#{invoiceResult.invoiceNumber}</p>
            </div>
            <div className="w-10" />
          </div>
        </div>

        {/* Success Content */}
        <div className="p-4 max-w-2xl mx-auto space-y-6">
          <Card className="p-6 bg-green-50 border-green-200 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-green-800 mb-2">Invoice Sent Successfully!</h2>
            <p className="text-green-700">Your invoice has been processed and sent to {clientName}</p>
          </Card>

          <Card className="p-4 space-y-4">
            <h3 className="font-semibold text-foreground">Invoice Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Invoice ID:</span>
                <span className="font-medium">{invoiceResult.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <span className="font-medium capitalize">{invoiceResult.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Amount:</span>
                <span className="font-medium">${totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created:</span>
                <span className="font-medium">{new Date(invoiceResult.createdAt).toLocaleString()}</span>
              </div>
            </div>
          </Card>

          <div className="space-y-3">
            <Button
              onClick={() => window.open(`/invoices/preview/${invoiceResult.invoiceNumber}`, "_blank")}
              className="w-full bg-foreground text-background hover:bg-foreground/90 h-12"
            >
              View Preview
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            </Button>

            <Button
              onClick={() => window.open(invoiceResult.pdfUrl, "_blank")}
              variant="outline"
              className="w-full h-12"
            >
              Download PDF
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </Button>

            <Button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: `Invoice #${invoiceResult.invoiceNumber}`,
                    text: `Invoice for ${clientName} - $${totalAmount.toLocaleString()}`,
                    url: `/invoices/preview/${invoiceResult.invoiceNumber}`,
                  })
                }
              }}
              variant="outline"
              className="w-full h-12"
            >
              Share Invoice
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background border-b border-border">
        <div className="flex items-center justify-between p-4">
          <button className="p-2 hover:bg-muted rounded-lg transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="text-center">
            <h1 className="text-xl font-semibold text-foreground">New Invoice</h1>
            <p className="text-sm text-muted-foreground">#{invoiceNumber}</p>
          </div>
          <div className="w-10" /> {/* Spacer */}
        </div>
      </div>

      {/* Form Content */}
      <div className="p-4 max-w-2xl mx-auto space-y-6">
        {/* Date Fields */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4 bg-muted/50">
            <Label className="text-sm font-medium text-foreground">Invoice Date</Label>
            <Input
              type="date"
              value={invoiceDate}
              onChange={(e) => setInvoiceDate(e.target.value)}
              className="mt-1 border-0 bg-transparent p-0 text-sm font-medium"
            />
          </Card>
          <Card className="p-4 bg-muted/50">
            <Label className="text-sm font-medium text-foreground">Due Date</Label>
            <Input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="mt-1 border-0 bg-transparent p-0 text-sm font-medium"
            />
          </Card>
        </div>

        {/* Client Field */}
        <Card className="p-4 bg-muted/50">
          <Label className="text-sm font-medium text-foreground">Client</Label>
          <Input
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            className="mt-1 border-0 bg-transparent p-0 text-sm font-medium"
            placeholder="Enter client name"
          />
        </Card>

        {/* Items Table */}
        <Card className="p-4 bg-muted/50">
          <div className="space-y-4">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-2 text-sm font-medium text-foreground pb-2 border-b border-border">
              <div className="col-span-5">Item</div>
              <div className="col-span-2 text-right">Price</div>
              <div className="col-span-2 text-right">Qty</div>
              <div className="col-span-2 text-right">Total</div>
              <div className="col-span-1"></div>
            </div>

            {/* Items */}
            {items.map((item) => (
              <div key={item.id} className="grid grid-cols-12 gap-2 items-center">
                <div className="col-span-5">
                  <Input
                    value={item.description}
                    onChange={(e) => updateItem(item.id, "description", e.target.value)}
                    className="border-0 bg-transparent p-0 text-sm"
                    placeholder="Item description"
                  />
                </div>
                <div className="col-span-2">
                  <Input
                    type="number"
                    value={item.price}
                    onChange={(e) => updateItem(item.id, "price", Number.parseFloat(e.target.value) || 0)}
                    className="border-0 bg-transparent p-0 text-sm text-right"
                    placeholder="0"
                  />
                </div>
                <div className="col-span-2">
                  <Input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateItem(item.id, "quantity", Number.parseInt(e.target.value) || 0)}
                    className="border-0 bg-transparent p-0 text-sm text-right"
                    placeholder="1"
                  />
                </div>
                <div className="col-span-2 text-right text-sm font-medium">${item.total.toLocaleString()}</div>
                <div className="col-span-1 flex justify-end">
                  {items.length > 1 && (
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-1 hover:bg-destructive/10 rounded text-destructive"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            ))}

            {/* Add Item Button */}
            <Button
              onClick={addItem}
              variant="outline"
              className="w-full mt-4 bg-foreground text-background hover:bg-foreground/90"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Item
            </Button>
          </div>
        </Card>

        {/* Totals */}
        <Card className="p-4 bg-muted/50 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-foreground">Taxes ({taxRate}%)</span>
            <span className="text-sm font-medium">${taxAmount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-border">
            <span className="text-lg font-semibold text-foreground">Total amount</span>
            <span className="text-lg font-semibold">${totalAmount.toLocaleString()}</span>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3 pb-8">
          <Button
            onClick={handleSendInvoice}
            disabled={isLoading}
            className="w-full bg-foreground text-background hover:bg-foreground/90 h-12 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin mr-2" />
                Sending...
              </>
            ) : (
              <>
                Send Invoice Now
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </>
            )}
          </Button>
          <Button
            onClick={handleScheduleDelivery}
            disabled={isLoading}
            variant="outline"
            className="w-full h-12 bg-transparent disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-foreground border-t-transparent rounded-full animate-spin mr-2" />
                Scheduling...
              </>
            ) : (
              <>
                Schedule Delivery
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
