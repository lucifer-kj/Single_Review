import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, DollarSign, Clock, AlertTriangle } from "lucide-react"

const stats = [
  {
    title: "Total Invoices",
    value: "247",
    change: "+12%",
    changeType: "positive" as const,
    icon: FileText,
  },
  {
    title: "Total Revenue",
    value: "$45,230",
    change: "+8.2%",
    changeType: "positive" as const,
    icon: DollarSign,
  },
  {
    title: "Outstanding",
    value: "$8,940",
    change: "-2.1%",
    changeType: "negative" as const,
    icon: Clock,
  },
  {
    title: "Overdue",
    value: "$2,150",
    change: "+5.4%",
    changeType: "negative" as const,
    icon: AlertTriangle,
  },
]

export function StatsCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-balance">{stat.value}</div>
              <p className={`text-xs ${stat.changeType === "positive" ? "text-green-600" : "text-red-600"}`}>
                {stat.change} from last month
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
