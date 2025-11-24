# Complete Setup Guide - Online Store System

This guide will walk you through setting up the entire online store system from scratch.

---

##  Prerequisites

Before starting, ensure you have the following installed on your system:

1. **Node.js** (version 18 or higher)
   - Check version: `node --version`
   - Download from: https://nodejs.org/

2. **npm** (comes with Node.js)
   - Check version: `npm --version`

3. **Git** (optional, for version control)
   - Check version: `git --version`

---

## Step-by-Step Setup

### Step 1: Navigate to Project Directory

```bash
cd "/Users/mingyang/Desktop/Online store"
```

---

### Step 2: Install Dependencies

Install all required Node.js packages:

```bash
npm install
```

**What this does**: Downloads and installs all dependencies listed in `package.json`, including:
- Next.js (framework)
- Prisma (database)
- NextAuth (authentication)
- Resend (email service)
- React and other libraries

**Expected time**: 1-3 minutes depending on internet speed

---

### Step 3: Configure Environment Variables

The `.env` file contains important configuration. Review and update it:

```bash
nano .env
```

Or open it in your code editor. Here's what you need to configure:

```env
# Database (Already configured - using SQLite)
DATABASE_URL="file:./dev.db"

# Email Service (Resend)
# IMPORTANT: Update these with your actual Resend credentials
RESEND_API_KEY="re_your_key_here"           # Get from https://resend.com/api-keys
RESEND_FROM_EMAIL="onboarding@resend.dev"    # Your verified sender email

# Authentication Secret (Already configured)
AUTH_SECRET=6RYvPw0btkEstsu9f6IkPETIYosTOL8tlEn+h6ph3HA=
```

**Important Notes**:
- The `DATABASE_URL` is already set for SQLite (stored in `./prisma/dev.db`)
- For email to work, you need to:
  1. Sign up at https://resend.com
  2. Get your API key
  3. Verify your sender domain or use their test email
  4. Update `RESEND_API_KEY` and `RESEND_FROM_EMAIL`

---

### Step 4: Set Up Database

#### 4.1: Push Database Schema

Create the database and all tables:

```bash
npx prisma db push
```

**What this does**: Creates the SQLite database file and all tables based on your schema

**Expected output**: 
```
✔ Generated Prisma Client
Your database is now in sync with your schema.
```

#### 4.2: Generate Prisma Client

Generate the Prisma Client code:

```bash
npx prisma generate
```

**What this does**: Generates type-safe database client code for TypeScript

#### 4.3: Seed Database with Initial Data

Populate the database with test users and initial data:

```bash
npx prisma db seed
```

**What this does**: Creates default admin account and test data

**Default Admin Credentials** (created by seed):
- **Email**: `admin@store.com`
- **Password**: `admin123`

---

### Step 5: Clear Build Cache (Recommended)

Clean any previous build artifacts:

```bash
rm -rf .next
rm -f tsconfig.tsbuildinfo
```

**What this does**: Removes cached build files to ensure a fresh start

---

### Step 6: Start Development Server

Start the application:

```bash
npm run dev
```

**Expected output**:
```
> app@0.1.0 dev
> next dev

  ▲ Next.js 16.0.3
  - Local:        http://localhost:3000
  - Ready in 2.3s
```

**What this does**: Starts the Next.js development server with hot reload

---

### Step 7: Verify Installation

Open your browser and test these URLs:

1. **Homepage**: http://localhost:3000
   - ✅ Should load without errors
   
2. **Products**: http://localhost:3000/products
   - ✅ Should show product listing
   
3. **Login**: http://localhost:3000/login
   - ✅ Should show login form
   - Try logging in with admin credentials:
     - Email: `admin@store.com`
     - Password: `admin123`

4. **Admin Panel**: http://localhost:3000/admin
   - ✅ After login, should show admin dashboard
   - ✅ Should see modern purple "Sign Out" button
   
5. **Admin Orders**: http://localhost:3000/admin/orders
   - ✅ Should show orders dashboard with income calculations

---

## Quick Verification Commands

Run these commands in a **new terminal** (keep server running):

```bash
# Check if homepage is accessible
curl -I http://localhost:3000

# Check if products page is accessible  
curl -I http://localhost:3000/products

# Check if login page is accessible
curl -I http://localhost:3000/login
```

All should return: `HTTP/1.1 200 OK`

---

## Database Management

### View Database with Prisma Studio

Open a visual database browser:

```bash
npx prisma studio
```

This opens http://localhost:5555 where you can:
- View all data
- Edit records
- Add test data
- Manage users, products, orders, etc.

### Reset Database (if needed)

If you need to start fresh:

```bash
# Delete the database
rm prisma/dev.db

# Recreate and seed
npx prisma db push
npx prisma generate
npx prisma db seed
```

---

## Email Configuration (Optional but Recommended)

To enable email notifications for orders:

### Step 1: Sign up for Resend

1. Go to https://resend.com
2. Create a free account
3. Navigate to API Keys section
4. Create a new API key

### Step 2: Update .env

```env
RESEND_API_KEY="re_abc123xyz..."  # Your actual API key
RESEND_FROM_EMAIL="orders@yourdomain.com"  # Your verified email
```

### Step 3: Restart Server

```bash
# Press Ctrl+C to stop server
# Then restart:
npm run dev
```

---

## Testing the System

### Manual Testing Checklist

#### Frontend (Customer-facing):
- [ ] Browse products
- [ ] View product details
- [ ] Add items to cart
- [ ] Complete checkout
- [ ] View order history
- [ ] Post comments (when logged in)
- [ ] Use chat feature

#### Backend (Admin):
- [ ] Login to admin panel
- [ ] View orders dashboard
- [ ] Toggle order types (online/offline)
- [ ] Manage products (add/edit/delete)
- [ ] Manage staff
- [ ] Configure business settings
- [ ] View finance dashboard

### Automated Testing

Run linting to check for code issues:

```bash
npm run lint
```

---

## Common Issues & Solutions

### Issue 1: Port 3000 Already in Use

**Error**: `Port 3000 is already in use`

**Solution**:
```bash
# Find and kill the process using port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
PORT=3001 npm run dev
```

---

### Issue 2: Prisma Client Not Generated

**Error**: `@prisma/client did not initialize yet`

**Solution**:
```bash
npx prisma generate
npm run dev
```

---

### Issue 3: Database Schema Mismatch

**Error**: `Database schema is not in sync`

**Solution**:
```bash
npx prisma db push
npx prisma generate
npm run dev
```

---

### Issue 4: Module Not Found Errors

**Error**: `Cannot find module '...'`

**Solution**:
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
npm run dev
```

---

### Issue 5: TypeScript Errors

**Error**: Various TypeScript compilation errors

**Solution**:
```bash
# Clear build cache
rm -rf .next tsconfig.tsbuildinfo

# Regenerate Prisma types
npx prisma generate

# Restart server
npm run dev
```

---

## Project Structure Overview

```
Online store/
├── .env                      # Environment variables
├── package.json              # Dependencies
├── prisma/
│   ├── schema.prisma        # Database schema
│   ├── seed.ts              # Seed data
│   └── dev.db              # SQLite database
├── src/
│   ├── app/                # Next.js app directory
│   │   ├── actions/        # Server actions
│   │   ├── api/            # API routes
│   │   ├── admin/          # Admin pages
│   │   ├── products/       # Product pages
│   │   └── ...
│   └── ...
├── public/                 # Static assets
└── ...
```

---

## 🎓 Next Steps After Setup

1. **Customize Business Information**
   - Login as admin
   - Go to Settings
   - Update business name, address, hours

2. **Add Products**
   - Navigate to Products management
   - Add your actual products with images

3. **Configure Payment**
   - Set up payment instructions
   - Configure bank transfer details

4. **Add Staff** (if applicable)
   - Go to Staff Management
   - Add staff members with roles

5. **Test Complete Flow**
   - Place a test order
   - Process it in admin panel
   - Verify email notifications

---

## 🔄 Daily Workflow

### Starting Work
```bash
cd "/Users/mingyang/Desktop/Online store"
npm run dev
```

### Stopping Server
Press `Ctrl + C` in the terminal running the server

### After Making Changes
- Frontend changes: Auto-reload (no action needed)
- Database schema changes:
  ```bash
  npx prisma db push
  npx prisma generate
  # Restart server (Ctrl+C, then npm run dev)
  ```

---

## 📊 System Features Overview

### Customer Features:
- ✅ Product browsing and search
- ✅ Shopping cart
- ✅ Checkout and order placement
- ✅ Order history
- ✅ Product comments
- ✅ Live chat with admin
- ✅ User profile management

### Admin Features:
- ✅ Order management (online/offline)
- ✅ Product management
- ✅ Staff management with schedules
- ✅ Finance tracking (10% income calculation)
- ✅ Business settings configuration
- ✅ Chat management
- ✅ Email notifications
- ✅ Daily order summaries

---

## 📞 Support Resources

- **Next.js Documentation**: https://nextjs.org/docs
- **Prisma Documentation**: https://www.prisma.io/docs
- **NextAuth Documentation**: https://authjs.dev
- **Resend Documentation**: https://resend.com/docs

---

## ✅ Setup Complete Checklist

- [ ] Node.js installed
- [ ] Dependencies installed (`npm install`)
- [ ] Environment variables configured (`.env`)
- [ ] Database created (`npx prisma db push`)
- [ ] Prisma Client generated (`npx prisma generate`)
- [ ] Database seeded (`npx prisma db seed`)
- [ ] Server running (`npm run dev`)
- [ ] Homepage accessible (http://localhost:3000)
- [ ] Can login as admin
- [ ] Admin panel visible
- [ ] Orders page working

---

**🎉 Congratulations!** Your online store system is now set up and running!

**Last Updated**: 2025-11-22
**Server URL**: http://localhost:3000
**Admin Credentials**: admin@store.com / admin123
