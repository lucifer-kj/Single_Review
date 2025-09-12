import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { reviewFormSchema } from '@/lib/validations'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = reviewFormSchema.parse(body)
    const { businessId, ...reviewData } = validatedData

    const supabase = await createClient()

    // Check if business exists
    const { data: business } = await supabase
      .from('businesses')
      .select('id, name')
      .eq('id', businessId)
      .single()

    if (!business) {
      return NextResponse.json(
        { error: 'Business not found' },
        { status: 404 }
      )
    }

    // Create the review
    const { data: review, error: reviewError } = await supabase
      .from('reviews')
      .insert({
        ...reviewData,
        business_id: businessId,
        is_public: reviewData.rating >= 4, // High ratings are public
        status: 'PROCESSED'
      })
      .select()
      .single()

    if (reviewError) {
      throw reviewError
    }

    // Update analytics
    await updateAnalytics(supabase, businessId, reviewData.rating)

    return NextResponse.json({ 
      success: true, 
      review: {
        id: review.id,
        rating: review.rating,
        isPublic: review.is_public
      }
    })

  } catch (error) {
    console.error('Error creating review:', error)
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid form data' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function updateAnalytics(supabase: Awaited<ReturnType<typeof createClient>>, businessId: string, rating: number) {
  const today = new Date().toISOString().split('T')[0]

  // Get or create today's analytics record
  const { data: existingAnalytics } = await supabase
    .from('analytics')
    .select('*')
    .eq('business_id', businessId)
    .eq('date', today)
    .single()

  if (existingAnalytics) {
    // Update existing analytics
    await supabase
      .from('analytics')
      .update({
        total_reviews: existingAnalytics.total_reviews + 1,
        high_ratings: rating >= 4 ? existingAnalytics.high_ratings + 1 : existingAnalytics.high_ratings,
        low_ratings: rating < 4 ? existingAnalytics.low_ratings + 1 : existingAnalytics.low_ratings,
        google_redirects: rating >= 4 ? existingAnalytics.google_redirects + 1 : existingAnalytics.google_redirects,
        private_feedback: rating < 4 ? existingAnalytics.private_feedback + 1 : existingAnalytics.private_feedback,
      })
      .eq('id', existingAnalytics.id)
  } else {
    // Create new analytics record
    await supabase
      .from('analytics')
      .insert({
        business_id: businessId,
        date: today,
        total_reviews: 1,
        high_ratings: rating >= 4 ? 1 : 0,
        low_ratings: rating < 4 ? 1 : 0,
        google_redirects: rating >= 4 ? 1 : 0,
        private_feedback: rating < 4 ? 1 : 0,
        average_rating: rating,
      })
  }

  // Update average rating
  const { data: allReviews } = await supabase
    .from('reviews')
    .select('rating')
    .eq('business_id', businessId)

  if (allReviews && allReviews.length > 0) {
    const totalRating = allReviews.reduce((sum: number, review: { rating: number }) => sum + review.rating, 0)
    const averageRating = totalRating / allReviews.length

    await supabase
      .from('analytics')
      .update({ averageRating })
      .eq('business_id', businessId)
      .eq('date', today)
  }
}
