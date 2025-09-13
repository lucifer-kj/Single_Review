import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { reviewFormSchema } from '@/lib/validations';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = reviewFormSchema.parse(body);

    const supabase = await createClient();

    // Insert review
    const { data: review, error } = await supabase
      .from('reviews')
      .insert({
        business_id: validatedData.business_id,
        customer_name: validatedData.customer_name,
        customer_phone: validatedData.customer_phone || null,
        rating: validatedData.rating,
        comment: validatedData.comment || null,
        is_public: validatedData.rating >= 4,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      review: {
        id: review.id,
        rating: review.rating,
        is_public: review.is_public,
      },
    });

  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get('business_id');
    const userId = searchParams.get('user_id');

    if (!businessId && !userId) {
      return NextResponse.json(
        { error: 'business_id or user_id is required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    let query = supabase
      .from('reviews')
      .select(`
        *,
        businesses (
          id,
          name,
          logo_url
        )
      `);

    if (businessId) {
      query = query.eq('business_id', businessId);
    }

    if (userId) {
      // First get business IDs owned by the user
      const { data: userBusinesses } = await supabase
        .from('businesses')
        .select('id')
        .eq('user_id', userId);
      
      if (userBusinesses && userBusinesses.length > 0) {
        const businessIds = userBusinesses.map(b => b.id);
        query = query.in('business_id', businessIds);
      } else {
        // Return empty array if user has no businesses
        return NextResponse.json({
          success: true,
          reviews: [],
        });
      }
    }

    const { data: reviews, error } = await query
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      reviews,
    });

  } catch {
    console.error('Error fetching reviews:');
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
