# State Management Improvement Plan

## Current Issues

1. **Local State Overuse**: Components maintain their own state for data that should be shared
2. **Redundant API Calls**: Multiple components fetch the same data independently
3. **Inconsistent Loading States**: Loading indicators are implemented inconsistently
4. **Poor Error Handling**: Error states don't provide clear guidance to users
5. **No Data Caching**: The same data is fetched repeatedly without caching

## Implementation Plan

### 1. Create a Global Business Store with Zustand

**File**: `stores/businessStore.ts`

```typescript
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { type Business } from '@/lib/types';

interface BusinessState {
  // Data
  businesses: Business[];
  selectedBusinessId: string | null;
  
  // Status
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;
  
  // Actions
  fetchBusinesses: () => Promise<void>;
  createBusiness: (businessData: Partial<Business>) => Promise<Business>;
  updateBusiness: (id: string, businessData: Partial<Business>) => Promise<Business>;
  deleteBusiness: (id: string) => Promise<void>;
  selectBusiness: (id: string | null) => void;
  clearError: () => void;
}

export const useBusinessStore = create<BusinessState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        businesses: [],
        selectedBusinessId: null,
        isLoading: false,
        error: null,
        lastFetched: null,
        
        // Actions
        fetchBusinesses: async () => {
          const { lastFetched } = get();
          const now = Date.now();
          
          // Cache for 1 minute
          if (lastFetched && now - lastFetched < 60000) {
            return;
          }
          
          set({ isLoading: true, error: null });
          
          try {
            const response = await fetch('/api/businesses');
            const data = await response.json();
            
            if (data.success) {
              set({ 
                businesses: data.businesses,
                isLoading: false,
                lastFetched: Date.now()
              });
            } else {
              throw new Error(data.error || 'Failed to fetch businesses');
            }
          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : 'An unknown error occurred',
              isLoading: false 
            });
          }
        },
        
        createBusiness: async (businessData) => {
          set({ isLoading: true, error: null });
          
          try {
            const response = await fetch('/api/businesses', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(businessData),
            });
            
            const data = await response.json();
            
            if (data.success) {
              const newBusiness = data.business;
              set(state => ({ 
                businesses: [...state.businesses, newBusiness],
                isLoading: false,
                lastFetched: Date.now()
              }));
              return newBusiness;
            } else {
              throw new Error(data.error || 'Failed to create business');
            }
          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : 'An unknown error occurred',
              isLoading: false 
            });
            throw error;
          }
        },
        
        updateBusiness: async (id, businessData) => {
          set({ isLoading: true, error: null });
          
          try {
            const response = await fetch(`/api/businesses/${id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(businessData),
            });
            
            const data = await response.json();
            
            if (data.success) {
              const updatedBusiness = data.business;
              set(state => ({ 
                businesses: state.businesses.map(b => 
                  b.id === id ? updatedBusiness : b
                ),
                isLoading: false,
                lastFetched: Date.now()
              }));
              return updatedBusiness;
            } else {
              throw new Error(data.error || 'Failed to update business');
            }
          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : 'An unknown error occurred',
              isLoading: false 
            });
            throw error;
          }
        },
        
        deleteBusiness: async (id) => {
          set({ isLoading: true, error: null });
          
          try {
            const response = await fetch(`/api/businesses/${id}`, {
              method: 'DELETE',
            });
            
            const data = await response.json();
            
            if (data.success) {
              set(state => ({ 
                businesses: state.businesses.filter(b => b.id !== id),
                selectedBusinessId: state.selectedBusinessId === id ? null : state.selectedBusinessId,
                isLoading: false,
                lastFetched: Date.now()
              }));
            } else {
              throw new Error(data.error || 'Failed to delete business');
            }
          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : 'An unknown error occurred',
              isLoading: false 
            });
            throw error;
          }
        },
        
        selectBusiness: (id) => {
          set({ selectedBusinessId: id });
        },
        
        clearError: () => {
          set({ error: null });
        }
      }),
      {
        name: 'business-store',
        partialize: (state) => ({ 
          businesses: state.businesses,
          selectedBusinessId: state.selectedBusinessId,
          lastFetched: state.lastFetched
        }),
      }
    )
  )
);
```

### 2. Create a Reviews Store

**File**: `stores/reviewStore.ts`

```typescript
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { type Review } from '@/lib/types';

interface ReviewsState {
  // Data by business
  reviewsByBusiness: Record<string, Review[]>;
  
  // Status
  isLoading: boolean;
  error: string | null;
  lastFetched: Record<string, number>;
  
  // Actions
  fetchReviewsForBusiness: (businessId: string) => Promise<void>;
  addReview: (review: Review) => void;
  clearError: () => void;
}

export const useReviewStore = create<ReviewsState>()(
  devtools((set, get) => ({
    // Initial state
    reviewsByBusiness: {},
    isLoading: false,
    error: null,
    lastFetched: {},
    
    // Actions
    fetchReviewsForBusiness: async (businessId) => {
      const { lastFetched } = get();
      const now = Date.now();
      
      // Cache for 1 minute
      if (lastFetched[businessId] && now - lastFetched[businessId] < 60000) {
        return;
      }
      
      set({ isLoading: true, error: null });
      
      try {
        const response = await fetch(`/api/reviews?business_id=${businessId}`);
        const data = await response.json();
        
        if (data.success) {
          set(state => ({ 
            reviewsByBusiness: {
              ...state.reviewsByBusiness,
              [businessId]: data.reviews
            },
            lastFetched: {
              ...state.lastFetched,
              [businessId]: Date.now()
            },
            isLoading: false
          }));
        } else {
          throw new Error(data.error || 'Failed to fetch reviews');
        }
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : 'An unknown error occurred',
          isLoading: false 
        });
      }
    },
    
    addReview: (review) => {
      set(state => {
        const businessId = review.business_id;
        const currentReviews = state.reviewsByBusiness[businessId] || [];
        
        return {
          reviewsByBusiness: {
            ...state.reviewsByBusiness,
            [businessId]: [review, ...currentReviews]
          }
        };
      });
    },
    
    clearError: () => {
      set({ error: null });
    }
  }))
);
```

### 3. Create a UI Store for Shared UI State

**File**: `stores/uiStore.ts`

```typescript
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface UIState {
  // Modal states
  isBusinessFormOpen: boolean;
  isQRModalOpen: boolean;
  
  // Toast notifications
  toasts: Array<{
    id: string;
    type: 'success' | 'error' | 'info';
    message: string;
    duration?: number;
  }>;
  
  // Actions
  openBusinessForm: () => void;
  closeBusinessForm: () => void;
  openQRModal: () => void;
  closeQRModal: () => void;
  addToast: (toast: Omit<UIState['toasts'][0], 'id'>) => void;
  removeToast: (id: string) => void;
}

export const useUIStore = create<UIState>()(
  devtools(
    persist(
      (set) => ({
        // Initial state
        isBusinessFormOpen: false,
        isQRModalOpen: false,
        toasts: [],
        
        // Actions
        openBusinessForm: () => set({ isBusinessFormOpen: true }),
        closeBusinessForm: () => set({ isBusinessFormOpen: false }),
        openQRModal: () => set({ isQRModalOpen: true }),
        closeQRModal: () => set({ isQRModalOpen: false }),
        
        addToast: (toast) => set(state => ({
          toasts: [...state.toasts, { ...toast, id: Date.now().toString() }]
        })),
        
        removeToast: (id) => set(state => ({
          toasts: state.toasts.filter(toast => toast.id !== id)
        })),
      }),
      {
        name: 'ui-store',
        partialize: (state) => ({ 
          // Don't persist these states
          isBusinessFormOpen: false,
          isQRModalOpen: false,
          toasts: []
        }),
      }
    )
  )
);
```

### 4. Refactor Business Management Component

**File**: `components/dashboard/business-management.tsx`

```typescript
'use client';

import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Building2, Share, Loader2 } from 'lucide-react';
import { BusinessForm } from '@/components/forms/business-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { QRModal } from '@/components/ui/qr-modal';
import { BusinessCard } from '@/components/dashboard/business-card';
import { useBusinessStore } from '@/stores/businessStore';
import { useUIStore } from '@/stores/uiStore';

export function BusinessManagement() {
  // Global state
  const { 
    businesses, 
    isLoading, 
    error, 
    fetchBusinesses,
    createBusiness,
    updateBusiness,
    deleteBusiness,
    selectedBusinessId,
    selectBusiness
  } = useBusinessStore();
  
  const {
    isBusinessFormOpen,
    isQRModalOpen,
    openBusinessForm,
    closeBusinessForm,
    openQRModal,
    closeQRModal,
    addToast
  } = useUIStore();
  
  // Local state for editing
  const [editingBusinessId, setEditingBusinessId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'businesses' | 'sharing'>('businesses');

  // Get the business being edited
  const editingBusiness = editingBusinessId 
    ? businesses.find(b => b.id === editingBusinessId) 
    : null;

  useEffect(() => {
    fetchBusinesses();
  }, [fetchBusinesses]);

  const handleCreateBusiness = async (data: unknown) => {
    try {
      await createBusiness(data as Partial<Business>);
      closeBusinessForm();
      addToast({
        type: 'success',
        message: 'Business created successfully',
        duration: 3000
      });
    } catch (error) {
      addToast({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to create business',
        duration: 5000
      });
    }
  };

  const handleUpdateBusiness = async (data: unknown) => {
    if (!editingBusinessId) return;
    
    try {
      await updateBusiness(editingBusinessId, data as Partial<Business>);
      setEditingBusinessId(null);
      closeBusinessForm();
      addToast({
        type: 'success',
        message: 'Business updated successfully',
        duration: 3000
      });
    } catch (error) {
      addToast({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to update business',
        duration: 5000
      });
    }
  };

  const handleDeleteBusiness = async (businessId: string) => {
    if (!confirm('Are you sure you want to delete this business? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteBusiness(businessId);
      addToast({
        type: 'success',
        message: 'Business deleted successfully',
        duration: 3000
      });
    } catch (error) {
      addToast({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to delete business',
        duration: 5000
      });
    }
  };

  const getReviewUrl = (businessId: string) => {
    return `${window.location.origin}/review/${businessId}`;
  };

  const getQRData = (business: Business) => {
    return {
      url: getReviewUrl(business.id),
      businessName: business.name,
      logoUrl: business.logo_url,
    };
  };

  // Rest of the component remains similar but uses the global state
  // ...
}
```

### 5. Refactor Business Form Component

**File**: `components/forms/business-form.tsx`

```typescript
'use client';

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Upload, X, Building2, MapPin, Phone, Globe, Star } from 'lucide-react';
import { businessFormSchema, type BusinessFormData } from '@/lib/validations';
import { createClient } from '@/lib/supabase';
import { useUIStore } from '@/stores/uiStore';

interface BusinessFormProps {
  business?: BusinessFormData;
  onSubmit: (form: BusinessFormData) => Promise<void>;
  onCancel?: () => void;
  loading?: boolean;
}

export function BusinessForm({
  business,
  onSubmit,
  onCancel,
  loading = false,
}: BusinessFormProps) {
  // Use UI store for toast notifications
  const { addToast } = useUIStore();
  
  // Rest of the component with improved error handling
  // ...
}
```

## Benefits of This Approach

1. **Centralized State Management**:
   - All business data is managed in one place
   - Components can access the same data without redundant fetching
   - State is persisted between page navigations

2. **Improved Error Handling**:
   - Consistent error handling across components
   - User-friendly error messages via toast notifications
   - Clear loading states

3. **Optimized Data Fetching**:
   - Simple caching mechanism prevents redundant API calls
   - Data is refreshed only when needed
   - Components can easily check if data is already available

4. **Better User Experience**:
   - Consistent loading indicators
   - Toast notifications for success/error feedback
   - Smoother transitions between states

5. **Simplified Component Logic**:
   - Components focus on presentation rather than data fetching
   - Reduced code duplication
   - Easier testing and maintenance

## Implementation Strategy

1. **Incremental Approach**:
   - Create stores first
   - Refactor one component at a time
   - Test thoroughly after each refactor

2. **Testing**:
   - Unit test store actions
   - Test component integration with stores
   - Verify data persistence works correctly

3. **Monitoring**:
   - Add logging to track store state changes
   - Monitor API call frequency
   - Track user-reported issues related to data loading