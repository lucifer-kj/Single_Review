import { getUser } from '@/lib/auth'
import { createClient } from '@/lib/supabase-server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { StarRating } from '@/components/ui/star-rating'
import { formatDistanceToNow } from 'date-fns'

type ReviewWithBusiness = {
  id: string
  customerName: string
  customerPhone: string | null
  rating: number
  feedback: string | null
  submittedAt: Date
  isPublic: boolean
  business: {
    name: string
  }
}

export default async function ReviewsPage() {
  const user = await getUser()
  
  if (!user) {
    return null
  }

  const supabase = await createClient()

  const { data: reviews } = await supabase
    .from('reviews')
    .select(`
      *,
      business:businesses (
        name
      )
    `)
    .eq('business.user_id', user.id)
    .order('submitted_at', { ascending: false })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">All Reviews</h1>
        <p className="text-muted-foreground">
          View and manage all customer reviews across your businesses
        </p>
      </div>

      {reviews && reviews.length === 0 ? (
        <Card className="text-center py-12">
          <CardHeader>
            <CardTitle>No reviews yet</CardTitle>
            <p className="text-muted-foreground">
              Share your review links to start collecting customer feedback
            </p>
          </CardHeader>
        </Card>
      ) : reviews ? (
        <div className="space-y-4">
          {reviews.map((review: ReviewWithBusiness) => (
            <Card key={review.id} className="fade-in">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{review.customerName}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {review.business.name}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={review.isPublic ? "default" : "secondary"}>
                      {review.isPublic ? "Public" : "Private"}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(review.submittedAt), { addSuffix: true })}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <StarRating rating={review.rating} readonly size="md" />
                </div>
                
                {review.feedback && (
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="text-sm">{review.feedback}</p>
                  </div>
                )}
                
                {review.customerPhone && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Phone: {review.customerPhone}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : null}
    </div>
  )
}
