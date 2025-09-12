-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE review_status AS ENUM ('PENDING', 'PROCESSED', 'PUBLISHED', 'REJECTED');

-- Users table (managed by Supabase Auth)
-- Note: Supabase Auth automatically creates auth.users table
-- We'll create a public profiles table to store additional user data

-- Profiles table to extend auth.users
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Businesses table
CREATE TABLE public.businesses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  logo TEXT,
  website TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  google_review_url TEXT,
  qr_code_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reviews table
CREATE TABLE public.reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  feedback TEXT,
  is_public BOOLEAN DEFAULT FALSE,
  status review_status DEFAULT 'PENDING',
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  processed_at TIMESTAMP WITH TIME ZONE
);

-- Analytics table
CREATE TABLE public.analytics (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
  date DATE DEFAULT CURRENT_DATE NOT NULL,
  total_reviews INTEGER DEFAULT 0,
  average_rating DECIMAL(3,2) DEFAULT 0,
  high_ratings INTEGER DEFAULT 0,
  low_ratings INTEGER DEFAULT 0,
  google_redirects INTEGER DEFAULT 0,
  private_feedback INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(business_id, date)
);

-- Create indexes for better performance
CREATE INDEX idx_businesses_user_id ON public.businesses(user_id);
CREATE INDEX idx_reviews_business_id ON public.reviews(business_id);
CREATE INDEX idx_reviews_submitted_at ON public.reviews(submitted_at);
CREATE INDEX idx_analytics_business_id ON public.analytics(business_id);
CREATE INDEX idx_analytics_date ON public.analytics(date);

-- Row Level Security (RLS) policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Businesses policies
CREATE POLICY "Users can view own businesses" ON public.businesses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own businesses" ON public.businesses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own businesses" ON public.businesses
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own businesses" ON public.businesses
  FOR DELETE USING (auth.uid() = user_id);

-- Reviews policies
CREATE POLICY "Anyone can insert reviews" ON public.reviews
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Business owners can view their reviews" ON public.reviews
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.businesses 
      WHERE businesses.id = reviews.business_id 
      AND businesses.user_id = auth.uid()
    )
  );

CREATE POLICY "Business owners can update their reviews" ON public.reviews
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.businesses 
      WHERE businesses.id = reviews.business_id 
      AND businesses.user_id = auth.uid()
    )
  );

-- Analytics policies
CREATE POLICY "Business owners can view their analytics" ON public.analytics
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.businesses 
      WHERE businesses.id = analytics.business_id 
      AND businesses.user_id = auth.uid()
    )
  );

CREATE POLICY "Business owners can insert their analytics" ON public.analytics
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.businesses 
      WHERE businesses.id = analytics.business_id 
      AND businesses.user_id = auth.uid()
    )
  );

CREATE POLICY "Business owners can update their analytics" ON public.analytics
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.businesses 
      WHERE businesses.id = analytics.business_id 
      AND businesses.user_id = auth.uid()
    )
  );

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, image)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'avatar_url');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_businesses_updated_at BEFORE UPDATE ON public.businesses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_analytics_updated_at BEFORE UPDATE ON public.analytics
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
