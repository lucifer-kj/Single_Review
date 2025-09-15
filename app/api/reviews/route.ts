import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { reviewFormSchema } from '@/lib/validations';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Received review data:', body);
    
    const validatedData = reviewFormSchema.parse(body);
    console.log('Validated data:', validatedData);

    const supabase = await createClient();

    // Test database connection first
    const { data: testData, error: testError } = await supabase
      .from('reviews')
      .select('id')
      .limit(1);

    if (testError) {
      console.error('Database connection test failed:', testError);
      return NextResponse.json(
        { error: `Database connection failed: ${testError.message}` },
        { status: 500 }
      );
    }

    console.log('Database connection successful');

    // Insert review
    const { data: review, error } = await supabase
      .from('reviews')
      .insert({
        customer_name: validatedData.customer_name,
        customer_phone: validatedData.customer_phone || null,
        rating: validatedData.rating,
        is_public: validatedData.rating >= 4,
      })
      .select()
      .single();

    if (error) {
      console.error('Database insert error:', error);
      return NextResponse.json(
        { error: `Database insert error: ${error.message}` },
        { status: 500 }
      );
    }

    console.log('Review created successfully:', review);

    return NextResponse.json({
      success: true,
      review: {
        id: review.id,
        rating: review.rating,
        is_public: review.is_public,
      },
    });

  } catch (error) {
    console.error('Review submission error:', error);
    return NextResponse.json(
      { error: `Validation error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get all reviews (single business model)
    const { data: reviews, error } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Database error:', error);
      throw error;
    }

    return NextResponse.json({
      success: true,
      reviews,
    });

  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
