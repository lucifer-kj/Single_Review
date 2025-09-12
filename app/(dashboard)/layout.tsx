import { requireAuth } from '@/lib/auth'
import { DashboardSidebar } from '@/components/dashboard/sidebar'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireAuth()

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />
      <main className="lg:pl-64">
        <div className="mobile-container py-8">
          {children}
        </div>
      </main>
    </div>
  )
}
