'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { reviewFormSchema, type ReviewFormData } from '@/lib/validations'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { StarRating } from '@/components/ui/star-rating'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, ExternalLink, MessageSquare } from 'lucide-react'

interface ReviewFormProps {
  businessId: string
  googleReviewUrl?: string | null
}

export function ReviewForm({ businessId, googleReviewUrl }: ReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      rating: 0,
    }
  })

  const onSubmit = async (data: ReviewFormData) => {
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          rating,
          businessId,
        }),
      })

      if (response.ok) {
        setIsSubmitted(true)
        
        // Smart routing logic
        if (rating >= 4 && googleReviewUrl) {
          // High rating - redirect to Google Reviews
          setTimeout(() => {
            window.open(googleReviewUrl, '_blank')
          }, 2000)
        }
        // Low rating - stays on page for private feedback collection
      } else {
        throw new Error('Failed to submit review')
      }
    } catch (error) {
      console.error('Error submitting review:', error)
      alert('Failed to submit review. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <Card className="text-center fade-in">
        <CardHeader>
          <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-success" />
          </div>
          <CardTitle>Thank You!</CardTitle>
          <CardDescription>
            Your feedback has been submitted successfully.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {rating >= 4 && googleReviewUrl ? (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Redirecting you to Google Reviews to share your positive experience...
              </p>
              <Button 
                onClick={() => window.open(googleReviewUrl, '_blank')}
                className="w-full"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Continue to Google Reviews
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Your private feedback has been received. We&apos;ll use it to improve our service.
              </p>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                <MessageSquare className="w-6 h-6 text-primary" />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="fade-in">
      <CardHeader>
        <CardTitle>Share Your Experience</CardTitle>
        <CardDescription>
          Your feedback helps us improve our service
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Star Rating */}
          <div className="space-y-2">
            <Label htmlFor="rating">Rating</Label>
            <div className="flex justify-center">
              <StarRating
                rating={rating}
                onRatingChange={(newRating) => {
                  setRating(newRating)
                  setValue('rating', newRating)
                }}
                size="lg"
              />
            </div>
            {errors.rating && (
              <p className="text-sm text-destructive">{errors.rating.message}</p>
            )}
          </div>

          {/* Customer Name */}
          <div className="space-y-2">
            <Label htmlFor="customerName">Your Name</Label>
            <Input
              id="customerName"
              {...register('customerName')}
              placeholder="Enter your name"
              className="mobile-touch-target"
            />
            {errors.customerName && (
              <p className="text-sm text-destructive">{errors.customerName.message}</p>
            )}
          </div>

          {/* Customer Phone */}
          <div className="space-y-2">
            <Label htmlFor="customerPhone">Phone Number (Optional)</Label>
            <Input
              id="customerPhone"
              type="tel"
              {...register('customerPhone')}
              placeholder="Enter your phone number"
              className="mobile-touch-target"
            />
            {errors.customerPhone && (
              <p className="text-sm text-destructive">{errors.customerPhone.message}</p>
            )}
          </div>

          {/* Feedback */}
          <div className="space-y-2">
            <Label htmlFor="feedback">Additional Comments (Optional)</Label>
            <Textarea
              id="feedback"
              {...register('feedback')}
              placeholder="Tell us about your experience..."
              rows={4}
              className="resize-none"
            />
            {errors.feedback && (
              <p className="text-sm text-destructive">{errors.feedback.message}</p>
            )}
          </div>

          <Button 
            type="submit" 
            className="w-full mobile-touch-target" 
            disabled={isSubmitting || rating === 0}
            size="lg"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
