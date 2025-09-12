import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/lib/auth';
import { createClient } from '@/lib/supabase-server';

export async function GET(request: NextRequest) {
  try {
    const user = await getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const supabase = await createClient();

    // Get user's businesses with review counts
    const { data: businesses, error } = await supabase
      .from('businesses')
      .select(`
        *,
        reviews:reviews(count)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    // Transform the data to include review counts and average ratings
    const businessesWithStats = await Promise.all(
      (businesses || []).map(async (business) => {
        // Get review count and average rating
        const { data: reviews } = await supabase
          .from('reviews')
          .select('rating')
          .eq('business_id', business.id);

        const reviewsCount = reviews?.length || 0;
        const averageRating = reviewsCount > 0 
          ? reviews!.reduce((sum, review) => sum + review.rating, 0) / reviewsCount
          : 0;

        return {
          ...business,
          reviews_count: reviewsCount,
          average_rating: averageRating,
        };
      })
    );

    return NextResponse.json({
      success: true,
      businesses: businessesWithStats,
    });

  } catch (error) {
    console.error('Error fetching businesses:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const supabase = await createClient();

    // Validate required fields
    if (!body.name) {
      return NextResponse.json(
        { error: 'Business name is required' },
        { status: 400 }
      );
    }

    // Create business
    const { data: business, error } = await supabase
      .from('businesses')
      .insert({
        user_id: user.id,
        name: body.name,
        description: body.description || null,
        address: body.address || null,
        phone: body.phone || null,
        email: body.email || null,
        website: body.website || null,
        google_business_url: body.google_business_url || null,
        logo_url: body.logo_url || null,
        brand_color: body.brand_color || '#000000',
        welcome_message: body.welcome_message || 'Thank you for your feedback!',
        thank_you_message: body.thank_you_message || 'Thank you for taking the time to share your experience with us.',
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      business,
    });

  } catch (error) {
    console.error('Error creating business:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
