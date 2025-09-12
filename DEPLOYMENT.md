# 🚀 Deployment Guide - Crux Review Management

This guide will help you deploy your Crux Review Management application to Vercel with Supabase.

## 📋 Prerequisites

- GitHub repository with your code
- Supabase account
- Vercel account
- Google OAuth credentials (optional)

## 🔧 Step 1: Set Up Supabase

### Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `crux-review-management`
   - **Database Password**: Generate a strong password
   - **Region**: Choose closest to your users
5. Click "Create new project"

### Configure Database

1. Go to **SQL Editor** in your Supabase dashboard
2. Create a new query
3. Copy and paste the contents of `supabase/migrations/001_initial_schema.sql`
4. Run the migration to create all tables and policies

### Get API Keys

1. Go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (e.g., `https://your-project-id.supabase.co`)
   - **anon public** key
   - **service_role** key (keep this secret!)

## 🔐 Step 2: Configure Google OAuth (Optional)

### Set Up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure OAuth consent screen
6. Add authorized redirect URIs:
   - `https://your-project-id.supabase.co/auth/v1/callback`
7. Copy **Client ID** and **Client Secret**

### Configure Supabase Auth

1. In Supabase dashboard, go to **Authentication** → **Providers**
2. Enable **Google** provider
3. Add your Google OAuth credentials:
   - **Client ID**: Your Google Client ID
   - **Client Secret**: Your Google Client Secret
4. Save configuration

## 🚀 Step 3: Deploy to Vercel

### Connect Repository

1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Click "New Project"
3. Import your GitHub repository
4. Choose your repository and click "Import"

### Configure Environment Variables

In Vercel project settings, add these environment variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# App Configuration
NEXT_PUBLIC_APP_URL=https://your-app-name.vercel.app

# Google OAuth (if using)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

**Steps to add environment variables:**
1. Go to your Vercel project dashboard
2. Click **Settings** → **Environment Variables**
3. Add each variable with the correct value
4. Make sure to add them for **Production**, **Preview**, and **Development**

### Deploy

1. Click **Deploy** in Vercel
2. Wait for the build to complete
3. Your app will be available at `https://your-app-name.vercel.app`

## ✅ Step 4: Verify Deployment

### Test Core Features

1. **Visit your deployed app**
2. **Test authentication**:
   - Sign up with email/password
   - Sign in with Google (if configured)
3. **Test business creation**:
   - Create a new business
   - Add business details and Google review URL
4. **Test review form**:
   - Copy the review link
   - Submit a test review
   - Verify routing logic (high vs low ratings)

### Check Database

1. Go to Supabase dashboard → **Table Editor**
2. Verify data is being created:
   - `businesses` table should have your test business
   - `reviews` table should have test reviews
   - `analytics` table should have aggregated data

## 🔧 Troubleshooting

### Common Issues

**Build Fails with "Supabase client not found"**
- Ensure all environment variables are set correctly
- Check that `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are present

**Authentication not working**
- Verify Google OAuth configuration in Supabase
- Check that redirect URLs match your Vercel domain
- Ensure `NEXT_PUBLIC_APP_URL` is set to your Vercel URL

**Database errors**
- Run the migration script in Supabase SQL Editor
- Check that RLS policies are enabled
- Verify service role key has proper permissions

**CORS errors**
- Ensure `NEXT_PUBLIC_APP_URL` is set correctly
- Check Supabase project settings for allowed origins

### Environment Variable Checklist

Before deploying, ensure you have:

- [ ] `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon key
- [ ] `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key
- [ ] `NEXT_PUBLIC_APP_URL` - Your Vercel app URL
- [ ] `GOOGLE_CLIENT_ID` - Google OAuth client ID (optional)
- [ ] `GOOGLE_CLIENT_SECRET` - Google OAuth client secret (optional)

## 📱 Post-Deployment

### Custom Domain (Optional)

1. In Vercel dashboard, go to **Settings** → **Domains**
2. Add your custom domain
3. Configure DNS settings as instructed
4. Update `NEXT_PUBLIC_APP_URL` to your custom domain

### Monitoring

- **Vercel Analytics**: Monitor performance and usage
- **Supabase Dashboard**: Monitor database usage and performance
- **Error Tracking**: Set up error monitoring (Sentry, LogRocket, etc.)

### Backup Strategy

- **Database**: Supabase provides automatic backups
- **Code**: GitHub provides version control and backup
- **Environment Variables**: Document all variables securely

## 🎉 Success!

Your Crux Review Management application is now deployed and ready to use! 

**Next Steps:**
1. Share your app with business owners
2. Monitor usage and performance
3. Collect feedback for improvements
4. Scale as needed

---

**Need Help?**
- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
