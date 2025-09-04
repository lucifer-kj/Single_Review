import { DashboardLayout } from "@/components/dashboard-layout"
import { StatsCards } from "@/components/stats-cards"
import { RecentInvoices } from "@/components/recent-invoices"
import { QuickActions } from "@/components/quick-actions"

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-balance md:text-3xl">Dashboard</h1>
            <p className="text-sm text-muted-foreground md:text-base">
              Welcome back! Here's an overview of your invoice activity.
            </p>
          </div>
          <div className="md:hidden">
            <QuickActions />
          </div>
        </div>

        {/* Stats Cards */}
        <StatsCards />

        {/* Recent Invoices */}
        <RecentInvoices />

        {/* Desktop Quick Actions */}
        <div className="hidden md:block">
          <QuickActions />
        </div>
      </div>
    </DashboardLayout>
  )
}
