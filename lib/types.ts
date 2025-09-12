export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          name: string | null
          image: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name?: string | null
          image?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          image?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      businesses: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          logo: string | null
          website: string | null
          phone: string | null
          email: string | null
          address: string | null
          google_review_url: string | null
          qr_code_url: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          logo?: string | null
          website?: string | null
          phone?: string | null
          email?: string | null
          address?: string | null
          google_review_url?: string | null
          qr_code_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          logo?: string | null
          website?: string | null
          phone?: string | null
          email?: string | null
          address?: string | null
          google_review_url?: string | null
          qr_code_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          business_id: string
          customer_name: string
          customer_phone: string | null
          rating: number
          feedback: string | null
          is_public: boolean
          status: 'PENDING' | 'PROCESSED' | 'PUBLISHED' | 'REJECTED'
          submitted_at: string
          processed_at: string | null
        }
        Insert: {
          id?: string
          business_id: string
          customer_name: string
          customer_phone?: string | null
          rating: number
          feedback?: string | null
          is_public?: boolean
          status?: 'PENDING' | 'PROCESSED' | 'PUBLISHED' | 'REJECTED'
          submitted_at?: string
          processed_at?: string | null
        }
        Update: {
          id?: string
          business_id?: string
          customer_name?: string
          customer_phone?: string | null
          rating?: number
          feedback?: string | null
          is_public?: boolean
          status?: 'PENDING' | 'PROCESSED' | 'PUBLISHED' | 'REJECTED'
          submitted_at?: string
          processed_at?: string | null
        }
      }
      analytics: {
        Row: {
          id: string
          business_id: string
          date: string
          total_reviews: number
          average_rating: number
          high_ratings: number
          low_ratings: number
          google_redirects: number
          private_feedback: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          business_id: string
          date?: string
          total_reviews?: number
          average_rating?: number
          high_ratings?: number
          low_ratings?: number
          google_redirects?: number
          private_feedback?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          date?: string
          total_reviews?: number
          average_rating?: number
          high_ratings?: number
          low_ratings?: number
          google_redirects?: number
          private_feedback?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Business = Database['public']['Tables']['businesses']['Row']
export type Review = Database['public']['Tables']['reviews']['Row']
export type Analytics = Database['public']['Tables']['analytics']['Row']
