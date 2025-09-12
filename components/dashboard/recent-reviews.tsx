import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { StarRating } from '@/components/ui/star-rating'
import { formatDistanceToNow } from 'date-fns'

interface RecentReviewsProps {
  reviews: Array<{
    id: string
    customerName: string
    rating: number
    feedback?: string | null
    submittedAt: Date
    isPublic: boolean
  }>
}

export function RecentReviews({ reviews }: RecentReviewsProps) {
  return (
    <Card className="fade-in">
      <CardHeader>
        <CardTitle>Recent Reviews</CardTitle>
      </CardHeader>
      <CardContent>
        {reviews.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No reviews yet</p>
            <p className="text-sm">Share your review link to get started</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="border-b border-border pb-4 last:border-b-0">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{review.customerName}</span>
                    <Badge variant={review.isPublic ? "default" : "secondary"}>
                      {review.isPublic ? "Public" : "Private"}
                    </Badge>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(review.submittedAt), { addSuffix: true })}
                  </span>
                </div>
                
                <div className="mb-2">
                  <StarRating rating={review.rating} readonly size="sm" />
                </div>
                
                {review.feedback && (
                  <p className="text-sm text-muted-foreground">
                    {review.feedback}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
