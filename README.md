# Crux - Professional Review Management System

A modern, intelligent review management web application that routes customer feedback based on ratings. High ratings (4-5 stars) redirect to Google Business reviews, while low ratings (1-3 stars) collect private feedback for improvement.

## 🚀 Features

### Core Functionality
- **Smart Routing Logic**: Automatically redirects high ratings to Google Business while collecting private feedback for low ratings
- **Public Review Forms**: Clean, accessible forms for customer name, phone, and rating input
- **Admin Dashboard**: Comprehensive analytics, metrics, and review management
- **Business Management**: Create and manage multiple business profiles
- **Real-time Analytics**: Track review performance with detailed metrics

### User Experience
- **Mobile-First Design**: Optimized for all devices with PWA support
- **Professional UI**: Built with the Crux design system for optimal accessibility
- **QR Code Generation**: Easy sharing with downloadable QR codes
- **Link Sharing**: Copy and share review links effortlessly
- **Responsive Layout**: Works perfectly on desktop, tablet, and mobile

### Technical Features
- **Next.js 15**: Latest React framework with App Router
- **TypeScript**: Full type safety throughout the application
- **Supabase**: Backend-as-a-Service with PostgreSQL and authentication
- **Supabase Auth**: Secure authentication with Google OAuth
- **Tailwind CSS**: Utility-first styling with custom design system
- **Shadcn/ui**: High-quality, accessible UI components
- **PWA Support**: Installable web app functionality

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **UI Components**: Shadcn/ui, Lucide React icons
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Authentication**: Supabase Auth with Google OAuth
- **Charts**: Recharts for analytics dashboard
- **State**: Zustand for client state management
- **Validation**: Zod schemas
- **Deployment**: Vercel (optimized for Next.js)

## 📁 Project Structure

```
app/
├── (auth)/          # Authentication pages
├── (dashboard)/     # Admin dashboard
├── review/[id]/     # Public review forms
├── api/            # API routes
├── globals.css     # Global styles with Crux design system
└── layout.tsx      # Root layout

components/
├── ui/             # Shadcn components + custom components
├── forms/          # Form components
├── dashboard/      # Dashboard-specific components
└── shared/         # Reusable components

lib/
├── supabase.ts         # Supabase browser client
├── supabase-server.ts  # Supabase server client
├── auth.ts             # Auth utilities
├── validations.ts      # Zod schemas
└── types.ts            # TypeScript types
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- Supabase account
- Google OAuth credentials (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd alpha-pro5
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Go to [supabase.com](https://supabase.com) and create a new project
   - Get your project URL and API keys from Settings → API
   - Run the database migration from `supabase/migrations/001_initial_schema.sql`

4. **Set up environment variables**
   Create a `.env.local` file with:
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL="https://your-project-id.supabase.co"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key-here"
   SUPABASE_SERVICE_ROLE_KEY="your-service-role-key-here"
   
   # App Configuration
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   
   # Google OAuth (Optional)
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   ```

5. **Configure Google OAuth (Optional)**
   - In Supabase Dashboard → Authentication → Providers
   - Enable Google provider
   - Add your Google OAuth credentials

6. **Start the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 Usage

### For Business Owners

1. **Sign Up**: Use email/password or Google OAuth to create your account
2. **Create Business**: Add your business profile with Google review URL
3. **Share Review Link**: Copy the generated link or QR code
4. **Monitor Reviews**: View analytics and manage customer feedback

### For Customers

1. **Access Review Form**: Click the shared link or scan QR code
2. **Rate Experience**: Select 1-5 stars and provide feedback
3. **Smart Routing**: 
   - High ratings (4-5 stars) → Redirected to Google Reviews
   - Low ratings (1-3 stars) → Private feedback collected

## 🎨 Design System

The application uses the **Crux Design System** featuring:

- **Color Palette**: Professional light/dark themes
- **Typography**: Geist font family with responsive scales
- **Spacing**: Consistent spacing system for mobile-first design
- **Components**: Accessible, reusable UI components
- **Animations**: Smooth transitions and micro-interactions

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Supabase
npx supabase start     # Start local Supabase (if using local development)
npx supabase db reset  # Reset database (if using local Supabase)

# UI Components
npx shadcn@latest add [component-name]  # Add new Shadcn components
```

### Key Development Patterns

- **Server Components**: Used by default, client components only when needed
- **Error Boundaries**: Proper error handling and loading states
- **Form Validation**: React Hook Form with Zod validation
- **Mobile-First**: Responsive design with touch-friendly interactions
- **SEO Optimized**: Next.js metadata API for search optimization
- **Supabase Integration**: Server-side rendering with Supabase client

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect Repository**: Link your GitHub repository to Vercel
2. **Set Environment Variables**: Add all required Supabase environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_APP_URL`
3. **Deploy**: Automatic deployments on every push to main branch

### Manual Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy to your preferred platform**
   - Ensure Supabase project is accessible
   - Set all environment variables
   - Configure domain and SSL certificates

## 📊 Database Schema

### Models

- **User**: Business owners with Supabase authentication
- **Business**: Business profiles and Google review URLs  
- **Review**: Customer submissions with ratings and feedback
- **Analytics**: Aggregated metrics and tracking data

### Key Relationships

- Users can have multiple Businesses
- Businesses can have multiple Reviews and Analytics
- Reviews are linked to specific Businesses
- Analytics track daily metrics per Business

## 🔒 Security

- **Authentication**: Secure Supabase Auth with Google OAuth integration
- **Data Protection**: Private feedback collection for low ratings
- **Input Validation**: Zod schemas for all form inputs
- **SQL Injection Protection**: Supabase with parameterized queries
- **Row Level Security**: Database-level access control with RLS policies
- **CSRF Protection**: Supabase built-in security features

## 📈 Analytics

Track key metrics including:
- Total reviews and average rating
- High vs low rating distribution
- Google review redirects
- Private feedback collection
- Daily/weekly/monthly trends

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Alpha Business Digital**: Design system and project vision
- **Shadcn/ui**: Beautiful, accessible UI components
- **Next.js Team**: Amazing React framework
- **Supabase Team**: Excellent backend-as-a-service platform
- **Vercel**: Seamless deployment platform

---

Built with ❤️ by Alpha Business Digital