import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/lib/auth';
import { createClient } from '@/lib/supabase-server';
import { z } from 'zod';

const businessSchema = z.object({
  name: z.string().min(1, 'Business name is required').max(100, 'Business name too long'),
  description: z.string().max(500, 'Description too long').optional(),
  address: z.string().max(200, 'Address too long').optional(),
  phone: z.string().max(20, 'Phone number too long').optional(),
  email: z.string().email('Invalid email address').optional(),
  website: z.string().optional().refine(
    (url) => {
      if (!url || url === '') return true;
      try {
        new URL(url);
        return true;
      } catch {
        return false;
      }
    },
    'Invalid website URL'
  ),
  google_business_url: z.string().optional().refine(
    (url) => {
      if (!url || url === '') return true;
      try {
        new URL(url);
        return true;
      } catch {
        return false;
      }
    },
    'Invalid Google Business URL'
  ),
  logo_url: z.string().optional().refine(
    (url) => {
      if (!url || url === '') return true;
      try {
        new URL(url);
        return true;
      } catch {
        return false;
      }
    },
    'Invalid logo URL'
  ),
  brand_color: z.string().optional().refine(
    (color) => {
      if (!color || color === '') return true;
      return /^#[0-9A-Fa-f]{6}$/.test(color);
    },
    'Invalid brand color format'
  ),
  welcome_message: z.string().max(200, 'Welcome message too long').optional(),
  thank_you_message: z.string().max(500, 'Thank you message too long').optional(),
});

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
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = businessSchema.parse(body);
    const supabase = await createClient();

    // Create business (only with fields that exist in current schema)
    const { data: business, error } = await supabase
      .from('businesses')
      .insert({
        user_id: user.id,
        name: validatedData.name,
        description: validatedData.description || null,
        logo_url: validatedData.logo_url || null,
        google_business_url: validatedData.google_business_url || null,
        // Note: Additional fields will be added after database migration
        // address: validatedData.address || null,
        // phone: validatedData.phone || null,
        // email: validatedData.email || null,
        // website: validatedData.website || null,
        // brand_color: validatedData.brand_color || '#000000',
        // welcome_message: validatedData.welcome_message || 'Thank you for your feedback!',
        // thank_you_message: validatedData.thank_you_message || 'Thank you for taking the time to share your experience with us.',
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
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid input data', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Business creation error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
