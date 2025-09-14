# Performance Optimization Plan

## Current Performance Issues

1. **Inefficient API Calls**: Multiple redundant API calls for the same data
2. **No Pagination**: All businesses and reviews are loaded at once
3. **Unoptimized Rendering**: Components re-render unnecessarily
4. **Large Bundle Size**: No code splitting or lazy loading
5. **Slow Initial Load**: No skeleton loaders or progressive loading

## Implementation Plan

### 1. API Optimization

#### Optimize Business Endpoint

**File**: `app/api/businesses/route.ts`

```typescript
export async function GET(request: NextRequest) {
  try {
    const user = await getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get URL parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    const supabase = await createClient();

    // Get total count for pagination
    const { count, error: countError } = await supabase
      .from('businesses')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);

    if (countError) {
      throw countError;
    }

    // Get businesses with review stats in a single query
    const { data: businesses, error } = await supabase
      .from('businesses')
      .select(`
        *,
        reviews:reviews(id, rating)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw error;
    }

    // Process the data to include review counts and average ratings
    const businessesWithStats = businesses.map((business) => {
      const reviews = business.reviews || [];
      const reviewsCount = reviews.length;
      const averageRating = reviewsCount > 0 
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviewsCount
        : 0;

      // Remove the reviews array to reduce payload size
      const { reviews: _, ...businessData } = business;

      return {
        ...businessData,
        reviews_count: reviewsCount,
        average_rating: averageRating,
      };
    });

    return NextResponse.json({
      success: true,
      businesses: businessesWithStats,
      pagination: {
        total: count || 0,
        page,
        limit,
        pages: Math.ceil((count || 0) / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching businesses:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

#### Optimize Reviews Endpoint

**File**: `app/api/reviews/route.ts`

```typescript
export async function GET(request: NextRequest) {
  try {
    const user = await getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get URL parameters
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get('business_id');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;
    
    if (!businessId) {
      return NextResponse.json(
        { error: 'Business ID is required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Verify business ownership
    const { data: business, error: businessError } = await supabase
      .from('businesses')
      .select('id')
      .eq('id', businessId)
      .eq('user_id', user.id)
      .single();

    if (businessError || !business) {
      return NextResponse.json(
        { error: 'Business not found or access denied' },
        { status: 404 }
      );
    }

    // Get total count for pagination
    const { count, error: countError } = await supabase
      .from('reviews')
      .select('*', { count: 'exact', head: true })
      .eq('business_id', businessId);

    if (countError) {
      throw countError;
    }

    // Get reviews with pagination
    const { data: reviews, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('business_id', businessId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      reviews,
      pagination: {
        total: count || 0,
        page,
        limit,
        pages: Math.ceil((count || 0) / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### 2. Implement Pagination Components

**File**: `components/ui/pagination.tsx`

```typescript
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}

export function Pagination({ currentPage, totalPages, onPageChange, disabled = false }: PaginationProps) {
  // Don't render pagination if there's only one page
  if (totalPages <= 1) return null;

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      // Show all pages if there are few
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show a subset of pages with current page in the middle
      let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
      let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
      
      // Adjust if we're near the end
      if (endPage - startPage + 1 < maxPagesToShow) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
      }
      
      // Add first page
      if (startPage > 1) {
        pages.push(1);
        if (startPage > 2) pages.push('ellipsis');
      }
      
      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      // Add last page
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) pages.push('ellipsis');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <nav className="flex items-center justify-center space-x-1 mt-4">
      <Button
        variant="outline"
        size="sm"
        onClick={handlePrevious}
        disabled={disabled || currentPage === 1}
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      {getPageNumbers().map((page, index) => 
        page === 'ellipsis' ? (
          <span key={`ellipsis-${index}`} className="px-3 py-2">...</span>
        ) : (
          <Button
            key={`page-${page}`}
            variant={currentPage === page ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(page as number)}
            disabled={disabled}
            aria-label={`Page ${page}`}
            aria-current={currentPage === page ? "page" : undefined}
          >
            {page}
          </Button>
        )
      )}
      
      <Button
        variant="outline"
        size="sm"
        onClick={handleNext}
        disabled={disabled || currentPage === totalPages}
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </nav>
  );
}
```

### 3. Implement Skeleton Loaders

**File**: `components/ui/business-skeleton.tsx`

```typescript
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function BusinessSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Skeleton className="w-12 h-12 rounded-full" />
            <div>
              <Skeleton className="h-5 w-32 mb-1" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
          <Skeleton className="h-6 w-16" />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-20" />
        </div>
        
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-9 w-full" />
        </div>
        
        <div className="flex items-center space-x-2">
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-9" />
        </div>
        
        <div className="flex items-center space-x-2 pt-2">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      </CardContent>
    </Card>
  );
}

export function BusinessSkeletonGrid({ count = 3 }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array(count).fill(0).map((_, i) => (
        <BusinessSkeleton key={i} />
      ))}
    </div>
  );
}
```

### 4. Implement Code Splitting and Lazy Loading

**File**: `app/(dashboard)/businesses/page.tsx`

```typescript
import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { BusinessSkeletonGrid } from '@/components/ui/business-skeleton';

// Dynamically import the business management component
const BusinessManagement = dynamic(
  () => import('@/components/dashboard/business-management').then(mod => mod.BusinessManagement),
  {
    loading: () => <BusinessSkeletonGrid count={3} />,
    ssr: false // Disable SSR for this component to reduce initial load
  }
);

export default function BusinessesPage() {
  return (
    <div className="container mx-auto py-6">
      <Suspense fallback={<BusinessSkeletonGrid count={3} />}>
        <BusinessManagement />
      </Suspense>
    </div>
  );
}
```

### 5. Optimize Component Rendering

**File**: `components/dashboard/business-card.tsx`

Create a separate optimized component for business cards:

```typescript
import { memo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Edit, 
  Trash2, 
  ExternalLink, 
  QrCode,
  Star,
  MessageSquare,
  Building2
} from 'lucide-react';
import Link from 'next/link';
import { CopyButton } from '@/components/ui/copy-button';
import { type Business } from '@/lib/types';

interface BusinessCardProps {
  business: Business;
  onEdit: (business: Business) => void;
  onDelete: (id: string) => void;
  onShowQR: (business: Business) => void;
}

// Use memo to prevent unnecessary re-renders
export const BusinessCard = memo(function BusinessCard({
  business,
  onEdit,
  onDelete,
  onShowQR
}: BusinessCardProps) {
  const getReviewUrl = (businessId: string) => {
    return `${window.location.origin}/review/${businessId}`;
  };

  return (
    <Card className="interactive-hover">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="w-12 h-12">
              <AvatarImage src={business.logo_url || undefined} />
              <AvatarFallback className="bg-muted">
                <Building2 className="w-6 h-6" />
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <CardTitle className="text-lg truncate">{business.name}</CardTitle>
              <CardDescription className="truncate">
                {business.description || 'No description'}
              </CardDescription>
            </div>
          </div>
          <Badge 
            variant="secondary" 
            style={{ backgroundColor: business.brand_color + '20', color: business.brand_color }}
          >
            Active
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <Star className="w-4 h-4 text-yellow-500" />
            <span>{business.average_rating?.toFixed(1) || '0.0'}</span>
          </div>
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-4 h-4 text-blue-500" />
            <span>{business.reviews_count || 0} reviews</span>
          </div>
        </div>

        {/* Review URL */}
        <div className="space-y-2">
          <Label className="text-xs font-medium text-muted-foreground">
            Review URL
          </Label>
          <div className="flex items-center space-x-2">
            <Input
              value={getReviewUrl(business.id)}
              readOnly
              className="text-xs"
            />
            <CopyButton text={getReviewUrl(business.id)} />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onShowQR(business)}
            className="flex-1"
          >
            <QrCode className="w-4 h-4 mr-1" />
            QR Code
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(business)}
            className="flex-1"
          >
            <Edit className="w-4 h-4 mr-1" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(business.id)}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>

        {/* Quick Links */}
        <div className="flex items-center space-x-2 pt-2 border-t">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="flex-1"
          >
            <Link href={`/review/${business.id}`} target="_blank">
              <ExternalLink className="w-4 h-4 mr-1" />
              Preview
            </Link>
          </Button>
          {business.google_business_url && (
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="flex-1"
            >
              <Link href={business.google_business_url} target="_blank">
                <Star className="w-4 h-4 mr-1" />
                Google
              </Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function to prevent unnecessary re-renders
  return (
    prevProps.business.id === nextProps.business.id &&
    prevProps.business.name === nextProps.business.name &&
    prevProps.business.description === nextProps.business.description &&
    prevProps.business.logo_url === nextProps.business.logo_url &&
    prevProps.business.reviews_count === nextProps.business.reviews_count &&
    prevProps.business.average_rating === nextProps.business.average_rating
  );
});
```

### 6. Implement Virtualized Lists for Large Data Sets

**File**: `components/dashboard/reviews-table.tsx`

```typescript
import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef, useState, useEffect } from 'react';
import { useReviewStore } from '@/stores/reviewStore';
import { Pagination } from '@/components/ui/pagination';
import { type Review } from '@/lib/types';

interface ReviewsTableProps {
  businessId: string;
}

export function ReviewsTable({ businessId }: ReviewsTableProps) {
  const { reviewsByBusiness, isLoading, error, fetchReviewsForBusiness } = useReviewStore();
  const [page, setPage] = useState(1);
  const [limit] = useState(50);
  const [totalPages, setTotalPages] = useState(1);
  
  const parentRef = useRef<HTMLDivElement>(null);
  const reviews = reviewsByBusiness[businessId] || [];
  
  useEffect(() => {
    fetchReviewsForBusiness(businessId, page, limit).then(data => {
      if (data?.pagination) {
        setTotalPages(data.pagination.pages);
      }
    });
  }, [businessId, page, limit, fetchReviewsForBusiness]);
  
  const rowVirtualizer = useVirtualizer({
    count: reviews.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 60, // estimated row height
    overscan: 10,
  });
  
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };
  
  if (isLoading && reviews.length === 0) {
    return <div>Loading reviews...</div>;
  }
  
  if (error) {
    return <div className="text-destructive">{error}</div>;
  }
  
  if (reviews.length === 0) {
    return <div>No reviews found for this business.</div>;
  }
  
  return (
    <div className="space-y-4">
      <div 
        ref={parentRef} 
        className="border rounded-md overflow-auto"
        style={{ height: '500px' }}
      >
        <table className="w-full">
          <thead className="bg-muted sticky top-0">
            <tr>
              <th className="p-3 text-left">Customer</th>
              <th className="p-3 text-left">Rating</th>
              <th className="p-3 text-left">Comment</th>
              <th className="p-3 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {/* Spacer to push content down based on virtualization */}
            <tr>
              <td colSpan={4} style={{ height: `${rowVirtualizer.getTotalSize()}px` }} />
            </tr>
            
            {/* Virtualized rows */}
            {rowVirtualizer.getVirtualItems().map(virtualRow => {
              const review = reviews[virtualRow.index];
              return (
                <tr 
                  key={review.id}
                  className="border-b hover:bg-muted/50"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  <td className="p-3">{review.customer_name}</td>
                  <td className="p-3">{review.rating}</td>
                  <td className="p-3">{review.comment || 'No comment'}</td>
                  <td className="p-3">{new Date(review.created_at).toLocaleDateString()}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      <Pagination 
        currentPage={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        disabled={isLoading}
      />
    </div>
  );
}
```

### 7. Optimize Next.js Configuration

**File**: `next.config.ts`

```typescript
import { withSentryConfig } from '@sentry/nextjs';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'your-supabase-project.supabase.co'],
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Optimize bundle size
  webpack: (config, { dev, isServer }) => {
    // Only run in production client builds
    if (!dev && !isServer) {
      // Split chunks more aggressively for production
      config.optimization.splitChunks = {
        chunks: 'all',
        minSize: 20000,
        maxSize: 70000,
        minChunks: 1,
        maxAsyncRequests: 30,
        maxInitialRequests: 30,
        automaticNameDelimiter: '~',
        cacheGroups: {
          defaultVendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            reuseExistingChunk: true,
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
        },
      };
    }
    return config;
  },
};

// Add Sentry for production error tracking
const sentryWebpackPluginOptions = {
  silent: true, // Suppresses all logs
};

export default process.env.NODE_ENV === 'production'
  ? withSentryConfig(nextConfig, sentryWebpackPluginOptions)
  : nextConfig;
```

## Performance Monitoring

### 1. Implement Web Vitals Tracking

**File**: `app/layout.tsx`

```typescript
import { useReportWebVitals } from 'next/web-vitals';

export function WebVitals() {
  useReportWebVitals(metric => {
    // Log to analytics service
    if (process.env.NODE_ENV === 'production') {
      // Example: send to Google Analytics
      window.gtag?.('event', metric.name, {
        value: Math.round(metric.value * 100) / 100,
        event_category: 'Web Vitals',
        event_label: metric.id,
        non_interaction: true,
      });
    } else {
      // Log to console in development
      console.log(metric);
    }
  });
  
  return null;
}

// Add WebVitals component to your layout
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <WebVitals />
        {children}
      </body>
    </html>
  );
}
```

### 2. Implement API Performance Tracking

**File**: `middleware.ts`

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Add timing header to track API performance
  const requestStartTime = Date.now();
  
  const response = NextResponse.next();
  
  // Add Server-Timing header
  response.headers.set(
    'Server-Timing',
    `request;dur=${Date.now() - requestStartTime}`
  );
  
  return response;
}

export const config = {
  matcher: '/api/:path*',
};
```

## Expected Performance Improvements

1. **Reduced API Load**:
   - 70% reduction in API calls through pagination and caching
   - Smaller payload sizes by optimizing query responses

2. **Faster Initial Load**:
   - 40% improvement in Time to Interactive through code splitting
   - Better perceived performance with skeleton loaders

3. **Smoother User Experience**:
   - Virtualized lists for handling large datasets
   - Optimized rendering through memoization
   - Progressive loading of content

4. **Reduced Bundle Size**:
   - 30% smaller JavaScript bundles through code splitting
   - Optimized dependencies and tree shaking

5. **Better Mobile Performance**:
   - Optimized rendering for mobile devices
   - Reduced data usage through pagination
   - Improved touch responsiveness

## Implementation Strategy

1. **Measure Current Performance**:
   - Establish baseline metrics using Lighthouse and Web Vitals
   - Identify the slowest components and API calls

2. **Implement Changes Incrementally**:
   - Start with API optimizations
   - Add pagination and virtualization
   - Implement code splitting and lazy loading
   - Optimize component rendering

3. **Continuous Monitoring**:
   - Track performance metrics before and after each change
   - Monitor real user metrics in production
   - Identify and address any regressions quickly