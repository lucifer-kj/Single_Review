import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Star, TrendingUp, Users, MessageSquare } from 'lucide-react'

interface DashboardStatsProps {
  business: {
    reviews: Array<{
      rating: number
      submittedAt: Date
    }>
    analytics: Array<{
      totalReviews: number
      averageRating: number
      highRatings: number
      lowRatings: number
      googleRedirects: number
      privateFeedback: number
    }>
  }
}

export function DashboardStats({ business }: DashboardStatsProps) {
  const totalReviews = business.reviews.length
  const averageRating = business.reviews.length > 0 
    ? business.reviews.reduce((sum, review) => sum + review.rating, 0) / business.reviews.length
    : 0
  
  const highRatings = business.reviews.filter(review => review.rating >= 4).length
  
  const recentAnalytics = business.analytics[0]
  const privateFeedback = recentAnalytics?.privateFeedback || 0

  const stats = [
    {
      title: 'Total Reviews',
      value: totalReviews,
      icon: Users,
      description: 'All time reviews',
      trend: '+12%'
    },
    {
      title: 'Average Rating',
      value: averageRating.toFixed(1),
      icon: Star,
      description: 'Overall rating',
      trend: '+0.2'
    },
    {
      title: 'High Ratings',
      value: highRatings,
      icon: TrendingUp,
      description: '4-5 star reviews',
      trend: '+8%'
    },
    {
      title: 'Private Feedback',
      value: privateFeedback,
      icon: MessageSquare,
      description: 'Low rating feedback',
      trend: '+3%'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={stat.title} className="fade-in" style={{ animationDelay: `${index * 100}ms` }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <span>{stat.description}</span>
              <Badge variant="secondary" className="text-xs">
                {stat.trend}
              </Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
