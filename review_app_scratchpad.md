# Review Management Web App - Cursor Rules

## Instructions

- Record fixes for mistakes or corrections to avoid repetition in the `Lessons` section.
- Organize thoughts and plan steps before starting a task in the `Scratchpad` section.
- Clear old tasks if necessary.
- Use todo markers for progress tracking:
  - `[X]` Completed tasks
  - `[ ]` Pending tasks
- Update Scratchpad after completing subtasks.
- Reflect and plan after milestones for better task management.
- Always refer to Scratchpad before planning the next step.

## Lessons

1. Use `npx shadcn@latest add [component]` instead of `npx shadcn-ui@latest add [component]` when installing Shadcn UI components.
2. In Next.js 15+, page props params must be typed as a Promise. Example:
   ```typescript
   type tParams = Promise<{ id: string }>
   interface PageProps {
     params: tParams
   }
   ```
   Then await the params in the component:
   ```typescript
   export default async function Page(props: PageProps) {
     const { id } = await props.params
   }
   ```
3. Use Supabase client for authentication instead of NextAuth. Create client with `createClientComponentClient()` for client components and `createServerComponentClient()` for server components.
4. When importing `useRouter` from 'next/navigation', the component must be marked as a client component using the `'use client'` directive at the top of the file, as this hook only works on the client side.
5. Supabase Storage requires proper MIME type handling when uploading files. Use `file.type` to set content type for QR codes and logos.
6. For conditional redirects based on ratings, use `window.location.href` on client side or `redirect()` from 'next/navigation' on server side.

## Scratchpad

### 1. Project Setup and Configuration [X]

- [X] Initialize Next.js 15 project with TypeScript
- [X] Set up project structure and folders
- [X] Configure ESLint and Prettier
- [X] Install and configure dependencies:
  - Shadcn UI components
  - Lucide icons
  - Zod for validation
  - Zustand for state management
  - Recharts for analytics
  - QRCode.js for QR generation
  - Supabase client
  - React Hook Form
- [X] Set up environment variables:
  - NEXT_PUBLIC_SUPABASE_URL
  - NEXT_PUBLIC_SUPABASE_ANON_KEY
  - SUPABASE_SERVICE_ROLE_KEY

### 2. Database and Authentication Setup [X]

- [X] Set up Supabase project
- [X] Configure database schema:
  - users table (extends Supabase auth.users)
  - businesses table
  - reviews table
  - analytics table
- [X] Set up Supabase client configuration:
  - Client component client
  - Server component client
  - Service role client for admin operations
- [X] Implement authentication:
  - Sign up/Sign in pages
  - Protected routes middleware
  - Session management

### 3. Core Features - Public Review Form [X]

- [X] Public Review Form (`/review/[businessId]`):
  - [X] Create dynamic route structure
  - [X] Design responsive form layout:
    - Business logo display
    - Customer name input (required)
    - Phone number input with validation
    - 5-star rating component
    - Submit button with loading states
  - [X] Implement form validation with Zod
  - [X] Smart routing logic:
    - Rating ≥ 4: Redirect to Google Business Profile
    - Rating < 4: Redirect to internal feedback page
  - [X] Store submission in database
  - [X] Add thank you messages
- [X] Internal Feedback Page (`/feedback/[businessId]`):
  - [X] Detailed feedback form
  - [X] Optional contact information
  - [X] Escalation options
  - [X] Privacy assurance messaging

### 4. Admin Dashboard [X]

- [X] Authentication and Authorization:
  - [X] Admin login page
  - [X] Protected dashboard routes
  - [X] Session validation
- [X] Dashboard Layout:
  - [X] Responsive sidebar navigation
  - [X] Header with user menu
  - [X] Breadcrumb navigation
  - [X] Mobile menu toggle
- [X] Dashboard Overview:
  - [X] Key Metrics Cards:
    - [X] Total reviews submitted
    - [X] Positive reviews (redirected to Google)
    - [X] Internal feedback collected
    - [X] Conversion rate percentage
  - [X] Analytics Charts:
    - [X] Review trends over time (Recharts line chart)
    - [X] Rating distribution (bar chart)
    - [X] Daily/weekly/monthly filters
  - [X] Recent Reviews Table:
    - [X] Customer name, rating, date columns
    - [X] Quick action buttons
    - [X] Sorting and filtering
  - [X] Geographic Distribution:
    - [X] Reviews by location if available
    - [X] Customer insights

### 5. Business Management [X]

- [X] Business Profile Management: (use design.json file for populating the global.css)
  - [X] Create/edit business profile
  - [X] Upload business logo (Supabase Storage)
  - [X] Set Google Business Profile URL
  - [X] Customize review form appearance
  - [X] Brand color customization
- [X] Review Form Customization:
  - [X] Custom welcome messages
  - [X] Form field configurations
  - [X] Thank you page customization
  - [X] Redirect URL management

### 6. Link Sharing and QR Features [X]

- [X] Review Link Generation:
  - [X] Generate unique review URLs
  - [X] Copy to clipboard functionality
  - [X] QR code generation with QRCode.js
  - [X] QR code download feature
- [X] Social Sharing:
  - [X] Share dropdown component
  - [X] WhatsApp sharing with pre-filled message
  - [X] Email sharing template
  - [X] SMS sharing capability
  - [X] Social media platform integration
- [X] Link Analytics:
  - [X] Track link clicks and sources
  - [X] QR code scan tracking
  - [X] Share method analytics

**Implementation Details:**
- Enhanced SharePanel component with comprehensive sharing options
- Updated ShareDropdown with native share API support and tracking
- Improved QRModal with server-side QR generation and tracking parameters
- Created LinkTracker component for automatic link click detection and analytics
- Enhanced link tracking API with metadata support
- Added QR generation API endpoint with tracking capabilities
- Updated SharingAnalytics with QR-specific metrics and improved visualizations
- Integrated link tracking into review pages with automatic source detection

### 7. PWA Implementation [ ]

- [ ] PWA Configuration:
  - [ ] Create app manifest.json
  - [ ] Configure service worker
  - [ ] Add to home screen prompt
  - [ ] Offline functionality for basic features
  - [ ] App icons and splash screens
- [ ] Mobile Optimization:
  - [ ] Touch-friendly interface
  - [ ] Mobile-first responsive design
  - [ ] Fast loading performance
  - [ ] Native app-like experience

### 8. Advanced Features [ ]

- [ ] Real-time Updates:
  - [ ] Supabase real-time subscriptions
  - [ ] Live dashboard notifications
  - [ ] Auto-refresh analytics
- [ ] Export and Reporting:
  - [ ] CSV export functionality
  - [ ] PDF reports generation
  - [ ] Custom date range selection
  - [ ] Scheduled report emails
- [ ] Email Notifications:
  - [ ] New review alerts
  - [ ] Weekly summary reports
  - [ ] Low rating notifications
- [ ] Multi-business Support:
  - [ ] Business switching interface
  - [ ] Consolidated analytics
  - [ ] Role-based permissions

### 9. API Routes [ ]

- [ ] Authentication APIs:
  - [ ] `/api/auth/signin`
  - [ ] `/api/auth/signup`
  - [ ] `/api/auth/signout`
- [ ] Review Management APIs:
  - [ ] `/api/reviews` (GET, POST)
  - [ ] `/api/reviews/[id]` (GET, PUT, DELETE)
  - [ ] `/api/businesses/[id]/reviews`
- [ ] Analytics APIs:
  - [ ] `/api/analytics/metrics`
  - [ ] `/api/analytics/trends`
  - [ ] `/api/analytics/export`
- [ ] Utility APIs:
  - [ ] `/api/qr-generate`
  - [ ] `/api/share/[platform]`
  - [ ] `/api/upload/logo`

### 10. Testing and Quality Assurance [ ]

- [ ] Component Testing:
  - [ ] Review form validation
  - [ ] Rating component functionality
  - [ ] Dashboard components
- [ ] Integration Testing:
  - [ ] Authentication flow
  - [ ] Database operations
  - [ ] File upload processes
- [ ] E2E Testing:
  - [ ] Complete user journeys
  - [ ] Mobile responsiveness
  - [ ] PWA functionality
- [ ] Performance Optimization:
  - [ ] Image optimization
  - [ ] Bundle size optimization
  - [ ] Loading performance
  - [ ] SEO optimization

### 11. Production Deployment [ ]

- [ ] Environment Setup:
  - [ ] Production Supabase project
  - [ ] Environment variables configuration
  - [ ] Domain and SSL setup
- [ ] Vercel Deployment:
  - [ ] Build optimization
  - [ ] Edge functions configuration
  - [ ] Analytics setup
- [ ] Monitoring and Maintenance:
  - [ ] Error tracking setup
  - [ ] Performance monitoring
  - [ ] Database backup strategy
  - [ ] Update and maintenance plan

### 12. Documentation and Handover [ ]

- [ ] User Documentation:
  - [ ] Admin dashboard guide
  - [ ] Business setup instructions
  - [ ] Review form customization guide
- [ ] Technical Documentation:
  - [ ] API documentation
  - [ ] Database schema documentation
  - [ ] Deployment guide
  - [ ] Troubleshooting guide
- [ ] Training Materials:
  - [ ] Video tutorials
  - [ ] Best practices guide
  - [ ] FAQ section