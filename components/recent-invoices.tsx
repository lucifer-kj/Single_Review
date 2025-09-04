import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Eye, Download } from "lucide-react"

const invoices = [
  {
    id: "INV-2024-001",
    client: "Acme Corp",
    amount: "$1,200.00",
    status: "paid" as const,
    date: "2024-01-15",
  },
  {
    id: "INV-2024-002",
    client: "Tech Solutions LLC",
    amount: "$850.00",
    status: "sent" as const,
    date: "2024-01-14",
  },
  {
    id: "INV-2024-003",
    client: "Design Studio Inc",
    amount: "$2,400.00",
    status: "overdue" as const,
    date: "2024-01-10",
  },
  {
    id: "INV-2024-004",
    client: "Marketing Pro",
    amount: "$675.00",
    status: "draft" as const,
    date: "2024-01-12",
  },
  {
    id: "INV-2024-005",
    client: "Startup Hub",
    amount: "$1,850.00",
    status: "paid" as const,
    date: "2024-01-11",
  },
]

const statusColors = {
  paid: "bg-green-100 text-green-800 hover:bg-green-100",
  sent: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  overdue: "bg-red-100 text-red-800 hover:bg-red-100",
  draft: "bg-gray-100 text-gray-800 hover:bg-gray-100",
}

export function RecentInvoices() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Invoices</CardTitle>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </CardHeader>
      <CardContent>
        {/* Desktop Table */}
        <div className="hidden md:block">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-2 font-medium text-muted-foreground">Invoice</th>
                  <th className="text-left py-3 px-2 font-medium text-muted-foreground">Client</th>
                  <th className="text-left py-3 px-2 font-medium text-muted-foreground">Amount</th>
                  <th className="text-left py-3 px-2 font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-2 font-medium text-muted-foreground">Date</th>
                  <th className="text-right py-3 px-2 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b border-border hover:bg-muted/50">
                    <td className="py-3 px-2 font-medium">{invoice.id}</td>
                    <td className="py-3 px-2">{invoice.client}</td>
                    <td className="py-3 px-2 font-medium">{invoice.amount}</td>
                    <td className="py-3 px-2">
                      <Badge variant="secondary" className={statusColors[invoice.status]}>
                        {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="py-3 px-2 text-muted-foreground">{invoice.date}</td>
                    <td className="py-3 px-2">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          {invoices.map((invoice) => (
            <div key={invoice.id} className="border border-border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-medium">{invoice.id}</span>
                <Badge variant="secondary" className={statusColors[invoice.status]}>
                  {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Client</p>
                <p className="font-medium">{invoice.client}</p>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Amount</p>
                  <p className="font-medium">{invoice.amount}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="text-sm">{invoice.date}</p>
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </Button>
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
