"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface InvoiceData {
  invoiceNumber: string
  invoiceDate: string
  dueDate: string
  clientName: string
  items: Array<{
    description: string
    price: number
    quantity: number
    total: number
  }>
  subtotal: number
  taxRate: number
  taxAmount: number
  totalAmount: number
}

export default function InvoicePreviewPage({
  params,
}: {
  params: { invoiceNumber: string }
}) {
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null)

  useEffect(() => {
    const mockData: InvoiceData = {
      invoiceNumber: params.invoiceNumber,
      invoiceDate: "2024-02-04",
      dueDate: "2024-02-18",
      clientName: "ABC Company",
      items: [
        {
          description: "Laptop Model XYZ",
          price: 1200,
          quantity: 5,
          total: 6000,
        },
      ],
      subtotal: 6000,
      taxRate: 5,
      taxAmount: 300,
      totalAmount: 6300,
    }
    setInvoiceData(mockData)
  }, [params.invoiceNumber])

  const handleDownloadPDF = () => {
    window.open(`/api/invoice/${params.invoiceNumber}/pdf`, "_blank")
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Invoice #${params.invoiceNumber}`,
          text: `Invoice for ${invoiceData?.clientName} - $${invoiceData?.totalAmount.toLocaleString()}`,
          url: window.location.href,
        })
      } catch (error) {
        console.log("[v0] Share cancelled or failed:", error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert("Invoice link copied to clipboard!")
    }
  }

  if (!invoiceData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-foreground border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading invoice...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background border-b border-border">
        <div className="flex items-center justify-between p-4">
          <button onClick={() => window.history.back()} className="p-2 hover:bg-muted rounded-lg transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="text-center">
            <h1 className="text-xl font-semibold text-foreground">Invoice Preview</h1>
            <p className="text-sm text-muted-foreground">#{invoiceData.invoiceNumber}</p>
          </div>
          <div className="w-10" />
        </div>
      </div>

      {/* Invoice Preview */}
      <div className="p-4 max-w-4xl mx-auto space-y-6">
        {/* Invoice Header */}
        <Card className="p-6">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-2xl font-bold text-primary mb-2">InvoiceFlow</h2>
              <p className="text-muted-foreground">Professional Invoice Management</p>
            </div>
            <div className="text-right">
              <h3 className="text-xl font-semibold text-foreground">Invoice #{invoiceData.invoiceNumber}</h3>
              <p className="text-muted-foreground">Generated on {new Date().toLocaleDateString()}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-foreground mb-2">Invoice Details</h4>
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="text-muted-foreground">Invoice Date:</span> {invoiceData.invoiceDate}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Due Date:</span> {invoiceData.dueDate}
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-foreground mb-2">Bill To</h4>
                <div className="space-y-1 text-sm">
                  <p className="font-medium">{invoiceData.clientName}</p>
                  <p className="text-muted-foreground">Sample Address Line 1</p>
                  <p className="text-muted-foreground">Sample City, State 12345</p>
                </div>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="border border-border rounded-lg overflow-hidden mb-6">
            <div className="bg-muted/50 px-4 py-3 grid grid-cols-12 gap-4 text-sm font-medium text-foreground">
              <div className="col-span-6">Description</div>
              <div className="col-span-2 text-right">Price</div>
              <div className="col-span-2 text-right">Quantity</div>
              <div className="col-span-2 text-right">Total</div>
            </div>
            {invoiceData.items.map((item, index) => (
              <div key={index} className="px-4 py-3 grid grid-cols-12 gap-4 text-sm border-t border-border">
                <div className="col-span-6 font-medium">{item.description}</div>
                <div className="col-span-2 text-right">${item.price.toLocaleString()}</div>
                <div className="col-span-2 text-right">{item.quantity}</div>
                <div className="col-span-2 text-right font-medium">${item.total.toLocaleString()}</div>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-full max-w-sm space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal:</span>
                <span>${invoiceData.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax ({invoiceData.taxRate}%):</span>
                <span>${invoiceData.taxAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-lg font-semibold pt-2 border-t border-border">
                <span>Total Amount:</span>
                <span>${invoiceData.totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-border text-center text-sm text-muted-foreground">
            <p>Thank you for your business!</p>
            <p className="mt-1">Generated by InvoiceFlow • {new Date().toLocaleString()}</p>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-8">
          <Button
            onClick={handleDownloadPDF}
            className="w-full bg-foreground text-background hover:bg-foreground/90 h-12"
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

          <Button onClick={handleShare} variant="outline" className="w-full h-12 bg-transparent">
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
