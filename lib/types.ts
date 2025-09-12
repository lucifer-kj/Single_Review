import { Database } from './database.types';

// Database types
export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];

export type Enums<T extends keyof Database['public']['Enums']> =
  Database['public']['Enums'][T];

// Business types
export interface Business {
  id: string;
  name: string;
  description?: string;
  logo_url?: string;
  google_business_url?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

// Review types
export interface Review {
  id: string;
  business_id: string;
  customer_name: string;
  customer_phone?: string;
  rating: number;
  comment?: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

// Analytics types
export interface Analytics {
  id: string;
  business_id: string;
  metric_type: 'review_submitted' | 'google_redirect' | 'internal_feedback';
  value: number;
  metadata?: Record<string, unknown>;
  created_at: string;
}

// Form types
export interface ReviewFormData {
  customer_name: string;
  customer_phone?: string;
  rating: number;
  comment?: string;
}

export interface BusinessFormData {
  name: string;
  description?: string;
  logo_url?: string;
  google_business_url?: string;
}

// API Response types
  export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Dashboard types
export interface DashboardMetrics {
  total_reviews: number;
  positive_reviews: number;
  internal_feedback: number;
  conversion_rate: number;
}

export interface ReviewTrend {
  date: string;
  count: number;
  positive_count: number;
  negative_count: number;
}

// QR Code types
export interface QRCodeData {
  business_id: string;
  business_name: string;
  review_url: string;
}

// Share types
export interface ShareData {
  platform: 'whatsapp' | 'email' | 'sms' | 'facebook' | 'twitter';
  business_name: string;
  review_url: string;
  message?: string;
}
