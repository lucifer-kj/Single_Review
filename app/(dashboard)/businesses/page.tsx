import { getUser } from '@/lib/auth'
import { createClient } from '@/lib/supabase-server'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Plus, ExternalLink } from 'lucide-react'
import { QRModal } from '@/components/ui/qr-modal'
import { CopyButton } from '@/components/ui/copy-button'
import Image from 'next/image'

type BusinessWithCounts = {
  id: string
  name: string
  description: string | null
  logo: string | null
  isActive: boolean
  createdAt: Date
  reviews: Array<{ id: string; rating: number; submittedAt: Date }>
  _count: { reviews: number }
}

export default async function BusinessesPage() {
  const user = await getUser()
  
  if (!user) {
    return null
  }

  const supabase = await createClient()

  const { data: businesses } = await supabase
    .from('businesses')
    .select(`
      *,
      reviews (
        id,
        rating,
        submitted_at
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Businesses</h1>
          <p className="text-muted-foreground">
            Manage your business profiles and review links
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/businesses/new">
            <Plus className="w-4 h-4 mr-2" />
            Add Business
          </Link>
        </Button>
      </div>

      {businesses && businesses.length === 0 ? (
        <Card className="text-center py-12">
          <CardHeader>
            <CardTitle>No businesses yet</CardTitle>
            <CardDescription>
              Create your first business profile to start collecting reviews
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/dashboard/businesses/new">
                <Plus className="w-4 h-4 mr-2" />
                Create Business
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {businesses?.map((business: BusinessWithCounts) => {
            const totalReviews = business.reviews?.length || 0
            const averageRating = business.reviews?.length > 0 
              ? business.reviews.reduce((sum, review) => sum + review.rating, 0) / business.reviews.length
              : 0
            const reviewUrl = `${process.env.NEXT_PUBLIC_APP_URL}/review/${business.id}`

            return (
              <Card key={business.id} className="fade-in">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      {business.logo && (
                        <Image
                          src={business.logo} 
                          alt={`${business.name} logo`}
                          width={48}
                          height={48}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      )}
                      <div>
                        <CardTitle className="text-xl">{business.name}</CardTitle>
                        <CardDescription>
                          {business.description || 'No description provided'}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge variant={business.isActive ? "default" : "secondary"}>
                      {business.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Review Statistics</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Total Reviews:</span>
                            <span className="ml-2 font-medium">{totalReviews}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Average Rating:</span>
                            <span className="ml-2 font-medium">{averageRating.toFixed(1)}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Review Link</h4>
                        <div className="flex space-x-2">
                          <input 
                            type="text" 
                            value={reviewUrl}
                            readOnly 
                            className="flex-1 px-3 py-2 text-sm border border-border rounded-md bg-muted"
                          />
                          <CopyButton text={reviewUrl} />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex space-x-2">
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/review/${business.id}`} target="_blank">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Preview Form
                          </Link>
                        </Button>
                        <QRModal url={reviewUrl} businessName={business.name} />
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/dashboard/businesses/${business.id}/edit`}>
                            Edit Business
                          </Link>
                        </Button>
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/dashboard/businesses/${business.id}/analytics`}>
                            View Analytics
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
