import { Button } from "@/components/ui/button"
import { Plus, UserPlus } from "lucide-react"

export function QuickActions() {
  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      <Button className="gap-2">
        <Plus className="h-4 w-4" />
        New Invoice
      </Button>
      <Button variant="outline" className="gap-2 bg-transparent">
        <UserPlus className="h-4 w-4" />
        New Client
      </Button>
    </div>
  )
}
