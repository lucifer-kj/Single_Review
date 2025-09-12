'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { businessFormSchema, type BusinessFormData } from '@/lib/validations'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle } from 'lucide-react'

export function BusinessForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BusinessFormData>({
    resolver: zodResolver(businessFormSchema),
  })

  const onSubmit = async (data: BusinessFormData) => {
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/businesses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        setIsSubmitted(true)
        setTimeout(() => {
          router.push('/dashboard/businesses')
        }, 2000)
      } else {
        throw new Error('Failed to create business')
      }
    } catch (error) {
      console.error('Error creating business:', error)
      alert('Failed to create business. Please try again.')
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
          <CardTitle>Business Created!</CardTitle>
          <CardDescription>
            Your business profile has been created successfully.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Redirecting to your businesses...
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="fade-in">
      <CardHeader>
        <CardTitle>Business Information</CardTitle>
        <CardDescription>
          Fill in the details for your business profile
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Business Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Business Name *</Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="Enter your business name"
              className="mobile-touch-target"
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Brief description of your business..."
              rows={3}
              className="resize-none"
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>

          {/* Website */}
          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              type="url"
              {...register('website')}
              placeholder="https://your-website.com"
              className="mobile-touch-target"
            />
            {errors.website && (
              <p className="text-sm text-destructive">{errors.website.message}</p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              {...register('phone')}
              placeholder="(555) 123-4567"
              className="mobile-touch-target"
            />
            {errors.phone && (
              <p className="text-sm text-destructive">{errors.phone.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              placeholder="contact@yourbusiness.com"
              className="mobile-touch-target"
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              {...register('address')}
              placeholder="123 Main St, City, State 12345"
              rows={2}
              className="resize-none"
            />
            {errors.address && (
              <p className="text-sm text-destructive">{errors.address.message}</p>
            )}
          </div>

          {/* Google Review URL */}
          <div className="space-y-2">
            <Label htmlFor="googleReviewUrl">Google Review URL</Label>
            <Input
              id="googleReviewUrl"
              type="url"
              {...register('googleReviewUrl')}
              placeholder="https://g.page/your-business/review"
              className="mobile-touch-target"
            />
            <p className="text-sm text-muted-foreground">
              This is where customers will be redirected for high ratings (4-5 stars)
            </p>
            {errors.googleReviewUrl && (
              <p className="text-sm text-destructive">{errors.googleReviewUrl.message}</p>
            )}
          </div>

          <div className="flex space-x-4">
            <Button 
              type="submit" 
              className="flex-1 mobile-touch-target" 
              disabled={isSubmitting}
              size="lg"
            >
              {isSubmitting ? 'Creating...' : 'Create Business'}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => router.back()}
              className="mobile-touch-target"
              size="lg"
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
