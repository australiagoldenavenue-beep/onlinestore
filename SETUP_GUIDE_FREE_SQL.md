# 🚀 Complete Setup Guide - Free SQL Database Environment

This guide shows you how to set up the online store system using **completely free services** including a proper SQL database (PostgreSQL).

---

## 🎯 What You'll Use (All Free!)

| Service | Purpose | Free Tier Limits |
|---------|---------|------------------|
| **Neon** | PostgreSQL Database | 10 GB storage, 100 hours compute/month |
| **Supabase** | PostgreSQL Database (Alternative) | 500 MB database, 50,000 monthly active users |
| **Railway** | PostgreSQL Database (Alternative) | 512 MB RAM, 1 GB storage |
| **Resend** | Email Service | 100 emails/day, 1 domain |
| **Vercel** | Hosting (Optional) | Unlimited hobby projects |

---

## 📋 Prerequisites

1. **Node.js** (version 18+): https://nodejs.org/
2. **Git** (optional): https://git-scm.com/

Check versions:
```bash
node --version
npm --version
```

---

## 🗄️ Part 1: Set Up Free PostgreSQL Database

Choose **ONE** of these options:

### Option A: Neon (Recommended - Easiest)

**Why Neon?** Serverless PostgreSQL, instant setup, generous free tier.

#### Step 1: Create Neon Account

1. Go to https://neon.tech
2. Click "Sign Up" (can use GitHub, Google, or email)
3. No credit card required!

#### Step 2: Create Database

1. After login, click **"Create a project"**
2. **Project name**: `online-store` (or anything you like)
3. **Region**: Choose closest to you (e.g., US East, EU)
4. **PostgreSQL version**: 16 (latest)
5. Click **"Create project"**

#### Step 3: Get Connection String

1. After project creation, you'll see a **"Connection Details"** screen
2. **Connection string** format will be shown
3. Copy the connection string that looks like:
   ```
   postgresql://username:password@ep-xxx.region.aws.neon.tech/database?sslmode=require
   ```
4. **Save this** - you'll need it for `.env` file

---

### Option B: Supabase (Alternative)

**Why Supabase?** Full backend platform with database, authentication, storage.

#### Step 1: Create Supabase Account

1. Go to https://supabase.com
2. Click "Start your project"
3. Sign up with GitHub (no credit card required)

#### Step 2: Create Project

1. Click **"New Project"**
2. **Name**: `online-store`
3. **Database Password**: Create a strong password (save it!)
4. **Region**: Choose closest to you
5. **Pricing Plan**: Free
6. Click **"Create new project"** (takes ~2 minutes)

#### Step 3: Get Connection String

1. In your project, go to **Settings** → **Database**
2. Scroll to **"Connection string"**
3. Select **"URI"** tab
4. Copy the connection string (replace `[YOUR-PASSWORD]` with your password):
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres
   ```
5. **Save this** - you'll need it for `.env` file

---

### Option C: Railway (Alternative)

#### Step 1: Create Railway Account

1. Go to https://railway.app
2. Click "Sign Up" (use GitHub)
3. No credit card required for trial

#### Step 2: Create PostgreSQL Database

1. Click **"New Project"**
2. Select **"Deploy PostgreSQL"**
3. Wait for deployment (~30 seconds)

#### Step 3: Get Connection String

1. Click on the PostgreSQL service
2. Go to **"Connect"** tab
3. Copy **"Postgres Connection URL"**:
   ```
   postgresql://postgres:password@containers.railway.app:5432/railway
   ```
4. **Save this** - you'll need it for `.env` file

---

## 📧 Part 2: Set Up Free Email Service (Resend)

#### Step 1: Create Resend Account

1. Go to https://resend.com
2. Click **"Get Started"**
3. Sign up (no credit card required)
4. Verify your email

#### Step 2: Get API Key

1. After login, go to **"API Keys"** in sidebar
2. Click **"Create API Key"**
3. **Name**: `online-store`
4. **Permission**: Full access
5. Click **"Add"**
6. **Copy the API key** (starts with `re_...`)
   - ⚠️ IMPORTANT: Save it now, you can't see it again!

#### Step 3: Set Up Sender Email

**Option 1: Use Test Email (Quick Start)**
- Use `onboarding@resend.dev`
- Can only send to your verified email
- Good for testing

**Option 2: Add Your Domain (For Production)**
1. Go to **"Domains"** in Resend dashboard
2. Click **"Add Domain"**
3. Enter your domain (e.g., `yourdomain.com`)
4. Add DNS records shown (TXT and MX)
5. Wait for verification
6. Use `orders@yourdomain.com` or similar

For now, use **Option 1** for testing.

---

## 🛠️ Part 3: Configure Your Project

### Step 1: Navigate to Project

```bash
cd "/Users/mingyang/Desktop/Online store"
```

### Step 2: Update Prisma Schema for PostgreSQL

Open `prisma/schema.prisma` and change the datasource:

**Find this:**
```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

**Replace with:**
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### Step 3: Update Models for PostgreSQL

Some SQLite-specific features need adjustment. Update `prisma/schema.prisma`:

**Find the User model and change:**
```prisma
model User {
  id          String    @id @default(cuid())
  // ... rest of fields
```

**Make sure it uses @default(cuid()) - this works in PostgreSQL**

**No other changes needed!** The schema is already PostgreSQL-compatible.

### Step 4: Update .env File

Open `.env` file and update with your credentials:

```env
# PostgreSQL Database (from Neon/Supabase/Railway)
DATABASE_URL="postgresql://username:password@host:5432/database?sslmode=require"

# Email Service (from Resend)
RESEND_API_KEY="re_YOUR_ACTUAL_API_KEY_HERE"
RESEND_FROM_EMAIL="onboarding@resend.dev"

# Authentication Secret (keep this or generate new)
AUTH_SECRET="6RYvPw0btkEstsu9f6IkPETIYosTOL8tlEn+h6ph3HA="
```

**Example .env with Neon:**
```env
DATABASE_URL="postgresql://neondb_owner:AbCd1234@ep-cool-darkness-a5b2c3d4.us-east-2.aws.neon.tech/neondb?sslmode=require"
RESEND_API_KEY="re_123abc456def789ghi"
RESEND_FROM_EMAIL="onboarding@resend.dev"
AUTH_SECRET="6RYvPw0btkEstsu9f6IkPETIYosTOL8tlEn+h6ph3HA="
```

### Step 5: Generate New AUTH_SECRET (Recommended)

For better security, generate a new secret:

```bash
openssl rand -base64 32
```

Copy the output and replace `AUTH_SECRET` value in `.env`

---

## 🚀 Part 4: Install and Initialize

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Push Database Schema

This creates all tables in your PostgreSQL database:

```bash
npx prisma db push
```

**Expected output:**
```
Your database is now in sync with your Prisma schema.
✔ Generated Prisma Client
```

### Step 3: Generate Prisma Client

```bash
npx prisma generate
```

### Step 4: Seed Database with Initial Data

```bash
npx prisma db seed
```

**What this creates:**
- Admin account: `admin@store.com` / `admin123`
- Sample products (if any in seed file)
- Initial settings

### Step 5: Clear Build Cache

```bash
rm -rf .next
rm -f tsconfig.tsbuildinfo
```

### Step 6: Start Development Server

```bash
npm run dev
```

**Expected output:**
```
✓ Ready in 2.3s
- Local:        http://localhost:3000
```

---

## ✅ Part 5: Verify Installation

### 1. Open Browser

Navigate to: **http://localhost:3000**

You should see the homepage without errors.

### 2. Test Login

1. Go to: http://localhost:3000/login
2. Login with:
   - **Email**: `admin@store.com`
   - **Password**: `admin123`
3. Should redirect to admin panel

### 3. Test Admin Features

- **Admin Dashboard**: http://localhost:3000/admin
- **Orders**: http://localhost:3000/admin/orders
- **Products**: http://localhost:3000/admin/products
- **Staff**: http://localhost:3000/admin/staff
- **Settings**: http://localhost:3000/admin/settings

### 4. Test Database Connection

Open Prisma Studio to view your PostgreSQL database:

```bash
npx prisma studio
```

Opens at http://localhost:5555

You should see:
- ✅ All tables (User, Product, Order, etc.)
- ✅ Admin user in Users table
- ✅ Ability to create/edit records

---

## 🎨 Part 6: Test Email Service

### Option 1: Test via Order (Recommended)

1. Logout from admin
2. Browse products: http://localhost:3000/products
3. Add items to cart
4. Complete checkout
5. Check your email (the one in admin account)
6. Should receive order confirmation

### Option 2: Check Resend Dashboard

1. Go to https://resend.com
2. Click "Emails" in sidebar
3. You should see sent emails
4. Click to view content

---

## 🔍 Troubleshooting

### Issue 1: Database Connection Failed

**Error**: `Can't reach database server at...`

**Solution:**
1. Check your DATABASE_URL in `.env`
2. Ensure no extra spaces
3. Verify database is active (check Neon/Supabase dashboard)
4. For Neon: Check if project is suspended (free tier sleeps after inactivity)
5. Wake it up by visiting the Neon dashboard

---

### Issue 2: SSL Certificate Error

**Error**: `self signed certificate`

**Solution:**
Add `?sslmode=require` to your DATABASE_URL:
```env
DATABASE_URL="postgresql://user:pass@host/db?sslmode=require"
```

---

### Issue 3: Emails Not Sending

**Error**: Emails not received

**Solutions:**

1. **Check Resend Dashboard**
   - Go to "Emails" tab
   - See if emails are showing as sent
   - Check for error messages

2. **Verify API Key**
   - Ensure RESEND_API_KEY is correct
   - Should start with `re_`
   - No extra quotes or spaces

3. **Check Sender Email**
   - Using `onboarding@resend.dev`? Can only send to your verified email
   - Check spam folder
   - Add domain for production use

4. **View Logs**
   - Check terminal running `npm run dev`
   - Look for email-related errors

---

### Issue 4: Prisma Client Errors

**Error**: `@prisma/client did not initialize`

**Solution:**
```bash
npx prisma generate
npm run dev
```

---

### Issue 5: Database Schema Mismatch

**Error**: `Unknown field` or `column does not exist`

**Solution:**
```bash
npx prisma db push --force-reset
npx prisma db seed
npm run dev
```

⚠️ **Warning**: `--force-reset` deletes all data!

---

## 📊 Free Tier Limits & Monitoring

### Neon PostgreSQL
- **Storage**: 10 GB
- **Compute**: 100 hours/month
- **Monitor**: https://console.neon.tech → Your Project → Usage

**Tips:**
- Database sleeps after 5 minutes of inactivity (free tier)
- First query after sleep takes ~1-2 seconds
- Upgrade to paid to remove sleep

---

### Supabase PostgreSQL
- **Storage**: 500 MB
- **Database Size**: 500 MB
- **Bandwidth**: 5 GB
- **Monitor**: https://supabase.com → Your Project → Settings → Billing

**Tips:**
- Includes auth, storage, realtime (bonus features!)
- Can switch to use Supabase Auth instead of NextAuth

---

### Resend Email
- **Emails**: 100 emails/day
- **Domains**: 1 domain
- **Monitor**: https://resend.com → Emails

**Tips:**
- 3,000 emails/month = ~100/day
- Perfect for small to medium stores
- Upgrade to $20/month for 50,000 emails

---

## 🔄 Migration from SQLite

If you were using SQLite before:

### Step 1: Export SQLite Data (Optional)

```bash
# Backup current SQLite data
npx prisma studio
# Manually export important data (orders, users)
```

### Step 2: Switch to PostgreSQL

Follow the main guide above (update schema, .env, push db, seed)

### Step 3: Import Data (If Needed)

Use Prisma Studio to manually add important records, or create a migration script.

---

## 🚀 Optional: Deploy to Vercel (Free Hosting)

### Step 1: Create Vercel Account

1. Go to https://vercel.com
2. Sign up with GitHub (free)

### Step 2: Import Project

1. Click **"Add New"** → **"Project"**
2. Import your GitHub repository
3. Or deploy from local:
   ```bash
   npm install -g vercel
   vercel
   ```

### Step 3: Configure Environment Variables

In Vercel dashboard:
1. Go to **Settings** → **Environment Variables**
2. Add each variable from your `.env`:
   - `DATABASE_URL`
   - `RESEND_API_KEY`
   - `RESEND_FROM_EMAIL`
   - `AUTH_SECRET`
   - `NEXTAUTH_URL` (set to your Vercel URL)

### Step 4: Deploy

```bash
vercel --prod
```

Your app will be live at: `https://your-app.vercel.app`

---

## 📁 File Changes Summary

Here are the files you modified:

1. **prisma/schema.prisma**
   ```prisma
   datasource db {
     provider = "postgresql"  // Changed from "sqlite"
     url      = env("DATABASE_URL")
   }
   ```

2. **.env**
   ```env
   DATABASE_URL="postgresql://..."  // Your PostgreSQL connection string
   RESEND_API_KEY="re_..."          // Your Resend API key
   ```

---

## 🎓 Next Steps

### 1. Customize Business Settings

Login as admin and configure:
- Business name
- Business address
- Opening hours
- Payment instructions
- Bank transfer details

### 2. Add Products

- Navigate to Products management
- Add your actual products
- Upload product images
- Set pricing and stock

### 3. Set Up Real Email Domain

- Add your domain to Resend
- Configure DNS records
- Update `RESEND_FROM_EMAIL` in .env
- Restart server

### 4. Create Staff Accounts

- Go to Staff Management
- Add staff members
- Set roles (STAFF, MANAGER)
- Configure schedules and hourly rates

### 5. Test Complete Flow

- Place test order
- Check email notification
- Process order in admin
- Verify finance calculations

---

## 💰 Cost Breakdown (Spoiler: $0!)

| Service | Monthly Cost | What You Get |
|---------|--------------|--------------|
| **Neon** | $0 | PostgreSQL database, 10GB storage |
| **Resend** | $0 | 100 emails/day |
| **Vercel** | $0 | Hosting, auto-deployment |
| **NextAuth** | $0 | Authentication (self-hosted) |
| **Node.js** | $0 | Runtime (open source) |
| **Next.js** | $0 | Framework (open source) |
| **Prisma** | $0 | ORM (open source) |
| **Total** | **$0** | Everything you need! |

---

## 📈 When to Upgrade (Future)

You might need to upgrade when:

- **Database**: Store more than 10GB data → Neon Pro ($19/mo)
- **Email**: Send more than 100 emails/day → Resend Pro ($20/mo)
- **Traffic**: Exceed Vercel limits → Vercel Pro ($20/mo)
- **Total for all**: ~$59/month for professional tier

But for **starting out**: **$0 is perfect!**

---

## ✅ Complete Checklist

- [ ] Created PostgreSQL database (Neon/Supabase/Railway)
- [ ] Got database connection string
- [ ] Created Resend account
- [ ] Got Resend API key
- [ ] Updated `prisma/schema.prisma` to use PostgreSQL
- [ ] Updated `.env` with DATABASE_URL
- [ ] Updated `.env` with RESEND_API_KEY
- [ ] Installed dependencies (`npm install`)
- [ ] Pushed database schema (`npx prisma db push`)
- [ ] Generated Prisma Client (`npx prisma generate`)
- [ ] Seeded database (`npx prisma db seed`)
- [ ] Started server (`npm run dev`)
- [ ] Tested login (admin@store.com / admin123)
- [ ] Verified admin panel works
- [ ] Tested email sending
- [ ] Checked Prisma Studio

---

## 🎉 Congratulations!

Your online store is now running with:
- ✅ Free PostgreSQL database (cloud-hosted)
- ✅ Free email service (100 emails/day)
- ✅ Free hosting option (Vercel)
- ✅ All features working
- ✅ $0 monthly cost!

---

## 📞 Support & Resources

- **Neon Docs**: https://neon.tech/docs
- **Supabase Docs**: https://supabase.com/docs
- **Resend Docs**: https://resend.com/docs
- **Prisma Docs**: https://www.prisma.io/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Vercel Docs**: https://vercel.com/docs

---

**Last Updated**: 2025-11-22
**Environment**: 100% Free Tier Services
**Database**: PostgreSQL (Neon/Supabase/Railway)
**Email**: Resend (100 emails/day)
**Hosting**: Vercel (Optional)
**Total Cost**: $0/month 🎉
