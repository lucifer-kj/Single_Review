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

    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get('business_id');
    const period = searchParams.get('period') || '30'; // days

    const supabase = await createClient();

    // Get user's businesses
    const { data: businesses } = await supabase
      .from('businesses')
      .select('id, name')
      .eq('user_id', user.id);

    if (!businesses || businesses.length === 0) {
      return NextResponse.json({
        success: true,
        metrics: {
          total_reviews: 0,
          positive_reviews: 0,
          internal_feedback: 0,
          conversion_rate: 0,
        },
        trends: [],
        rating_distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        businesses: [],
      });
    }

    const businessIds = businessId 
      ? [businessId] 
      : businesses.map(b => b.id);

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - parseInt(period));

    // Get reviews for the period
    const { data: reviews } = await supabase
      .from('reviews')
      .select('*')
      .in('business_id', businessIds)
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString())
      .order('created_at', { ascending: false });

    // Get analytics data
    const { data: analytics } = await supabase
      .from('analytics')
      .select('*')
      .in('business_id', businessIds)
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString());

    // Calculate metrics
    const totalReviews = reviews?.length || 0;
    const positiveReviews = reviews?.filter(r => r.rating >= 4).length || 0;
    const internalFeedback = analytics?.filter(a => a.metric_type === 'internal_feedback').length || 0;
    const conversionRate = totalReviews > 0 ? (positiveReviews / totalReviews) * 100 : 0;

    // Calculate rating distribution
    const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews?.forEach(review => {
      ratingDistribution[review.rating as keyof typeof ratingDistribution]++;
    });

    // Calculate trends (daily)
    const trends = [];
    const days = parseInt(period);
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayReviews = reviews?.filter(r => 
        r.created_at.startsWith(dateStr)
      ) || [];
      
      const dayPositive = dayReviews.filter(r => r.rating >= 4).length;
      const dayNegative = dayReviews.filter(r => r.rating < 4).length;
      
      trends.push({
        date: dateStr,
        count: dayReviews.length,
        positive_count: dayPositive,
        negative_count: dayNegative,
      });
    }

    return NextResponse.json({
      success: true,
      metrics: {
        total_reviews: totalReviews,
        positive_reviews: positiveReviews,
        internal_feedback: internalFeedback,
        conversion_rate: Math.round(conversionRate * 100) / 100,
      },
      trends,
      rating_distribution: ratingDistribution,
      businesses: businesses,
    });

  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
