import { z } from 'zod'

// Review form validation
export const reviewFormSchema = z.object({
  customerName: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  customerPhone: z.string().optional(),
  rating: z.number().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),
  feedback: z.string().optional(),
  businessId: z.string().min(1, 'Business ID is required'),
})

export type ReviewFormData = z.infer<typeof reviewFormSchema>

// Business form validation
export const businessFormSchema = z.object({
  name: z.string().min(1, 'Business name is required').max(100, 'Business name is too long'),
  description: z.string().optional(),
  website: z.string().url('Invalid website URL').optional().or(z.literal('')),
  phone: z.string().optional(),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  address: z.string().optional(),
  googleReviewUrl: z.string().url('Invalid Google review URL').optional().or(z.literal('')),
})

export type BusinessFormData = z.infer<typeof businessFormSchema>

// User profile validation
export const userProfileSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  email: z.string().email('Invalid email'),
})

export type UserProfileData = z.infer<typeof userProfileSchema>
