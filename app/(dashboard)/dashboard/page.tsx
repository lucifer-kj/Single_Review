import { getUser } from '@/lib/auth'
import { createClient } from '@/lib/supabase-server'
import { DashboardStats } from '@/components/dashboard/stats'
import { RecentReviews } from '@/components/dashboard/recent-reviews'
import { QuickActions } from '@/components/dashboard/quick-actions'

export default async function DashboardPage() {
  const user = await getUser()
  
  if (!user) {
    return null
  }

  const supabase = await createClient()

  // Get user's businesses
  const { data: businesses } = await supabase
    .from('businesses')
    .select(`
      *,
      reviews (
        id,
        customer_name,
        rating,
        feedback,
        submitted_at,
        is_public
      ),
      analytics (
        id,
        total_reviews,
        average_rating,
        high_ratings,
        low_ratings,
        google_redirects,
        private_feedback,
        date
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (!businesses || businesses.length === 0) {
    return (
      <div className="text-center py-20">
        <h1 className="text-3xl font-bold mb-4">Welcome to Crux!</h1>
        <p className="text-muted-foreground mb-8">
          Get started by creating your first business profile.
        </p>
        <QuickActions />
      </div>
    )
  }

  const primaryBusiness = businesses[0]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here&apos;s what&apos;s happening with your reviews.
        </p>
      </div>

      <DashboardStats business={primaryBusiness} />
      
      <div className="grid lg:grid-cols-2 gap-8">
        <RecentReviews reviews={primaryBusiness.reviews} />
        <QuickActions />
      </div>
    </div>
  )
}
