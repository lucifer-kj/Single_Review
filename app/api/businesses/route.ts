import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/lib/auth';
import { createClient } from '@/lib/supabase-server';

export async function GET(request: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get('page') || '1');
    const pageSize = Number(searchParams.get('limit') || '12');
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const supabase = await createClient();

    // Fetch businesses with total count (for pagination)
    const { data: businesses, count, error: bizError } = await supabase
      .from('businesses')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .range(from, to);

    if (bizError) throw bizError;

    // Fetch all ratings once and aggregate in-memory to avoid N+1
    const { data: ratings, error: ratingsError } = await supabase
      .from('reviews')
      .select('business_id, rating')
      .in(
        'business_id',
        (businesses || []).map((b) => b.id)
      );

    if (ratingsError) throw ratingsError;

    const statsMap = new Map<string, { count: number; sum: number }>();
    for (const r of ratings || []) {
      const key = r.business_id as string;
      const entry = statsMap.get(key) || { count: 0, sum: 0 };
      entry.count += 1;
      entry.sum += (r.rating as number) || 0;
      statsMap.set(key, entry);
    }

    const businessesWithStats = (businesses || []).map((b) => {
      const s = statsMap.get(b.id) || { count: 0, sum: 0 };
      const avg = s.count > 0 ? s.sum / s.count : 0;
      return { ...b, reviews_count: s.count, average_rating: avg };
    });

    const res = NextResponse.json(
      {
        success: true,
        businesses: businessesWithStats,
        pagination: { page, pageSize, total: count || 0 },
      },
      {
        status: 200,
      }
    );
    // Short-lived private cache to reduce load while ensuring user-specific data safety
    res.headers.set('Cache-Control', 'private, max-age=10, stale-while-revalidate=60');
    return res;
  } catch (e) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
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

  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
