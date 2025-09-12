import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Business, DashboardMetrics, ReviewTrend } from '@/lib/types';
import type { User } from '@supabase/supabase-js';

// User store
interface UserState {
  user: User | null;
  setUser: (user: User | null) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: 'user-storage',
    }
  )
);

// Business store
interface BusinessState {
  currentBusiness: Business | null;
  businesses: Business[];
  setCurrentBusiness: (business: Business | null) => void;
  setBusinesses: (businesses: Business[]) => void;
  addBusiness: (business: Business) => void;
  updateBusiness: (id: string, updates: Partial<Business>) => void;
  removeBusiness: (id: string) => void;
}

export const useBusinessStore = create<BusinessState>()(
  persist(
    (set) => ({
      currentBusiness: null,
      businesses: [],
      setCurrentBusiness: (business) => set({ currentBusiness: business }),
      setBusinesses: (businesses) => set({ businesses }),
      addBusiness: (business) =>
        set((state) => ({
          businesses: [...state.businesses, business],
        })),
      updateBusiness: (id, updates) =>
        set((state) => ({
          businesses: state.businesses.map((business) =>
            business.id === id ? { ...business, ...updates } : business
          ),
          currentBusiness:
            state.currentBusiness?.id === id
              ? { ...state.currentBusiness, ...updates }
              : state.currentBusiness,
        })),
      removeBusiness: (id) =>
        set((state) => ({
          businesses: state.businesses.filter((business) => business.id !== id),
          currentBusiness:
            state.currentBusiness?.id === id ? null : state.currentBusiness,
        })),
    }),
    {
      name: 'business-storage',
    }
  )
);

// UI store
interface UIState {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      theme: 'system',
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'ui-storage',
    }
  )
);

// Analytics store
interface AnalyticsState {
  metrics: DashboardMetrics | null;
  trends: ReviewTrend[];
  loading: boolean;
  setMetrics: (metrics: DashboardMetrics) => void;
  setTrends: (trends: ReviewTrend[]) => void;
  setLoading: (loading: boolean) => void;
  refreshAnalytics: () => Promise<void>;
}

export const useAnalyticsStore = create<AnalyticsState>()((set) => ({
  metrics: null,
  trends: [],
  loading: false,
  setMetrics: (metrics) => set({ metrics }),
  setTrends: (trends) => set({ trends }),
  setLoading: (loading) => set({ loading }),
  refreshAnalytics: async () => {
    set({ loading: true });
    try {
      // This will be implemented when we create the analytics API
      // const metrics = await fetchAnalytics();
      // const trends = await fetchTrends();
      // set({ metrics, trends });
    } catch (error) {
      console.error('Failed to refresh analytics:', error);
    } finally {
      set({ loading: false });
    }
  },
}));
