import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const invoiceData = await request.json()

    console.log("[v0] Received invoice webhook:", invoiceData)

    // In production, this would send to your invoice processing service
    const processedInvoice = {
      ...invoiceData,
      id: `INV-${Date.now()}`,
      status: "sent",
      pdfUrl: `/api/invoice/${invoiceData.invoiceNumber}/pdf`,
      createdAt: new Date().toISOString(),
      webhookProcessed: true,
    }

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return NextResponse.json({
      success: true,
      invoice: processedInvoice,
      message: "Invoice processed successfully",
    })
  } catch (error) {
    console.error("[v0] Webhook error:", error)
    return NextResponse.json({ success: false, error: "Failed to process invoice" }, { status: 500 })
  }
}
