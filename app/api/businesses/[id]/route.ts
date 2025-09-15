import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/lib/auth';
import { createClient } from '@/lib/supabase-server';
import { z } from 'zod';

const businessUpdateSchema = z.object({
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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUser();
    const { id } = await params;
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const supabase = await createClient();

    // Get business by ID (only if user owns it)
    const { data: business, error } = await supabase
      .from('businesses')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Business not found' },
          { status: 404 }
        );
      }
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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUser();
    const { id } = await params;
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = businessUpdateSchema.parse(body);
    const supabase = await createClient();

    // Update business (only with fields that exist in current schema)
    const { data: business, error } = await supabase
      .from('businesses')
      .update({
        name: validatedData.name,
        description: validatedData.description || null,
        logo_url: validatedData.logo_url || null,
        google_business_url: validatedData.google_business_url || null,
        updated_at: new Date().toISOString(),
        // Note: Additional fields will be added after database migration
        // address: validatedData.address || null,
        // phone: validatedData.phone || null,
        // email: validatedData.email || null,
        // website: validatedData.website || null,
        // brand_color: validatedData.brand_color || '#000000',
        // welcome_message: validatedData.welcome_message || 'Thank you for your feedback!',
        // thank_you_message: validatedData.thank_you_message || 'Thank you for taking the time to share your experience with us.',
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Business not found' },
          { status: 404 }
        );
      }
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUser();
    const { id } = await params;
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const supabase = await createClient();

    // Delete business (only if user owns it)
    const { error } = await supabase
      .from('businesses')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Business not found' },
          { status: 404 }
        );
      }
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: 'Business deleted successfully',
    });

  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
