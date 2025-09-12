import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import { ReviewForm } from '@/components/forms/review-form'
import Image from 'next/image'

interface ReviewPageProps {
  params: Promise<{ id: string }>
}

export default async function ReviewPage({ params }: ReviewPageProps) {
  const { id } = await params
  
  const supabase = await createClient()
  
  const { data: business } = await supabase
    .from('businesses')
    .select('id, name, description, logo, google_review_url')
    .eq('id', id)
    .eq('is_active', true)
    .single()

  if (!business) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mobile-container max-w-md mx-auto py-8">
        <div className="text-center mb-8">
          {business.logo && (
            <Image 
              src={business.logo} 
              alt={`${business.name} logo`}
              width={64}
              height={64}
              className="w-16 h-16 mx-auto mb-4 rounded-lg object-cover"
            />
          )}
          <h1 className="text-2xl font-bold mb-2">Rate Your Experience</h1>
          <p className="text-muted-foreground">
            How was your experience with <strong>{business.name}</strong>?
          </p>
          {business.description && (
            <p className="text-sm text-muted-foreground mt-2">
              {business.description}
            </p>
          )}
        </div>
        
        <ReviewForm businessId={business.id} googleReviewUrl={business.google_review_url} />
      </div>
    </div>
  )
}

export async function generateMetadata({ params }: ReviewPageProps) {
  const { id } = await params
  
  const supabase = await createClient()
  
  const { data: business } = await supabase
    .from('businesses')
    .select('name')
    .eq('id', id)
    .single()

  return {
    title: business ? `Review ${business.name}` : 'Review Form',
    description: `Share your experience with ${business?.name || 'this business'}`,
  }
}
