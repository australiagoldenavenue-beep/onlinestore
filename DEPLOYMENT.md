# Deployment Guide - Online Store System

This guide will help you deploy your Next.js online store to production with a custom domain.

## Prerequisites

- GitHub account
- Domain name (from GoDaddy, Namecheap, etc.)
- Hosting platform account (Vercel or Netlify)

---

## Step 1: Set Up PostgreSQL Database

Choose one of these free PostgreSQL providers:

### Option A: Vercel Postgres (Recommended for Vercel deployment)

```bash
npm i -g vercel
vercel login
vercel postgres create
```

Copy the `DATABASE_URL` provided.

### Option B: Supabase (Free tier available)

1. Go to https://supabase.com and create account
2. Create new project
3. Go to Settings → Database → Connection String
4. Copy the URI connection string

### Option C: Neon (Serverless PostgreSQL)

1. Go to https://neon.tech and create account
2. Create new project
3. Copy the connection string

---

## Step 2: Generate Required Secrets

Generate a secure secret for NextAuth:

```bash
openssl rand -base64 32
```

Copy this value for `NEXTAUTH_SECRET`.

---

## Step 3: Push Code to GitHub

```bash
# Initialize git repository
git init

# Add all files
git add .

# Commit changes
git commit -m "Production-ready: Online store system"

# Create repository on GitHub website, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

---

## Step 4: Deploy to Hosting Platform

### Option A: Deploy to Vercel (Recommended)

#### Via Vercel CLI:

```bash
npm i -g vercel
vercel login
vercel --prod
```

#### Via Vercel Dashboard:

1. Go to https://vercel.com
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will auto-detect Next.js settings
5. Click "Deploy"

### Option B: Deploy to Netlify

#### Via Netlify CLI:

```bash
npm i -g netlify-cli
netlify login
netlify init
netlify deploy --prod
```

#### Via Netlify Dashboard:

1. Go to https://netlify.com
2. Click "Add new site" → "Import an existing project"
3. Connect to GitHub and select your repository
4. Click "Deploy"

---

## Step 5: Configure Environment Variables

Add these environment variables in your hosting platform dashboard:

### Required Environment Variables:

```env
DATABASE_URL="postgresql://user:password@host:6543/database?pgbouncer=true"
DIRECT_URL="postgresql://user:password@host:5432/database"
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="your-generated-secret-from-step-2"
STRIPE_SECRET_KEY="sk_live_your_stripe_secret_key"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_your_stripe_publishable_key"
RESEND_API_KEY="re_your_resend_api_key"
RESEND_FROM_EMAIL="noreply@yourdomain.com"
```

### Where to add variables:

- **Vercel**: Project Settings → Environment Variables
- **Netlify**: Site Settings → Environment Variables

### How to get API keys:

- **Stripe**: https://dashboard.stripe.com/apikeys
- **Resend**: https://resend.com/api-keys

---

## Step 6: Connect Custom Domain

### For Vercel:

1. Go to Project Settings → Domains
2. Click "Add Domain"
3. Enter your domain: `yourdomain.com`
4. Vercel will provide DNS records

### For Netlify:

1. Go to Domain Settings → "Add custom domain"
2. Enter your domain
3. Netlify will provide DNS records

### DNS Configuration:

Add these records at your domain registrar (GoDaddy, Namecheap, etc.):

#### For Vercel:
```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

#### For Netlify:
```
Type: A
Name: @
Value: 75.2.60.5

Type: CNAME
Name: www
Value: YOUR-SITE.netlify.app
```

**Note**: DNS propagation can take up to 48 hours (usually 1-2 hours)

---

## Step 7: Initialize Production Database

After your first deployment, initialize the database:

### Option 1: Using production DATABASE_URL

```bash
DATABASE_URL="your-production-db-url" npx prisma migrate deploy
DATABASE_URL="your-production-db-url" npx prisma db seed
```

### Option 2: Via hosting platform CLI

```bash
# For Vercel
vercel env pull .env.production
npx prisma migrate deploy
npx prisma db seed

# For Netlify
netlify env:import .env.production
npx prisma migrate deploy
npx prisma db seed
```

---

## Step 8: Verify Deployment

1. Visit your deployed URL (e.g., `your-site.vercel.app` or `your-site.netlify.app`)
2. Test user registration and login
3. Verify product browsing works
4. Test checkout flow (use Stripe test cards)
5. Check admin dashboard access
6. Once domain DNS propagates, visit `https://yourdomain.com`

---

## Security Checklist

- [ ] Changed `NEXTAUTH_SECRET` to a strong random value
- [ ] Switched Stripe from test mode to live mode keys
- [ ] Verified email domain in Resend
- [ ] Updated `NEXTAUTH_URL` to your actual domain
- [ ] Reviewed and changed default admin passwords
- [ ] Enabled HTTPS (automatic with Vercel/Netlify)
- [ ] Never committed `.env` file to GitHub

---

## Useful Commands

```bash
# Generate new secret
openssl rand -base64 32

# Deploy to Vercel
vercel --prod

# Deploy to Netlify
netlify deploy --prod

# Check Vercel deployments
vercel ls

# Check Netlify status
netlify status

# View Vercel logs
vercel logs

# View Netlify logs
netlify logs
```

---

## Troubleshooting

### Build fails with database error
- Ensure `DATABASE_URL` is set in environment variables
- Verify PostgreSQL connection string is correct
- Check database is accessible from hosting platform

### Domain not working
- Wait for DNS propagation (up to 48 hours)
- Verify DNS records are correct
- Clear browser cache
- Try incognito/private browsing mode

### Stripe payments not working
- Ensure you're using live mode keys for production
- Verify webhook URLs are configured in Stripe dashboard
- Check Stripe API version compatibility

### Email not sending
- Verify Resend API key is correct
- Check email domain is verified in Resend
- Review Resend dashboard for delivery logs

---

## Support Resources

- Next.js Documentation: https://nextjs.org/docs
- Vercel Documentation: https://vercel.com/docs
- Netlify Documentation: https://docs.netlify.com
- Prisma Documentation: https://www.prisma.io/docs
- Stripe Documentation: https://stripe.com/docs
- Resend Documentation: https://resend.com/docs

---

## Environment Variables Reference

See `.env.example` file for the complete list of required environment variables and their format.

---

**Deployment is complete!** Your online store should now be live at your custom domain. 🎉
