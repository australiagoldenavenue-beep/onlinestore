# 📘 Online Store System - Complete Setup Manual

**Version:** 1.0  
**Last Updated:** November 22, 2025  
**For:** System Users, Administrators, Developers

---

## 📑 Table of Contents

1. [System Overview](#system-overview)
2. [Prerequisites](#prerequisites)
3. [Quick Start Guide](#quick-start-guide)
4. [Detailed Setup Instructions](#detailed-setup-instructions)
5. [Database Configuration](#database-configuration)
6. [Email Service Setup](#email-service-setup)
7. [Environment Variables](#environment-variables)
8. [Initial System Setup](#initial-system-setup)
9. [Running the System](#running-the-system)
10. [System Access & Login](#system-access--login)
11. [Database Management](#database-management)
12. [Testing & Verification](#testing--verification)
13. [Troubleshooting](#troubleshooting)
14. [Daily Operations](#daily-operations)
15. [System Maintenance](#system-maintenance)
16. [Security Considerations](#security-considerations)
17. [Backup & Recovery](#backup--recovery)
18. [Deployment to Production](#deployment-to-production)
19. [FAQ](#faq)
20. [Support & Resources](#support--resources)

---

## 🎯 System Overview

### What is This System?

This is a **full-featured e-commerce platform** that includes:

**Customer-Facing Features:**
- Product browsing and search
- Shopping cart and checkout
- Order history and tracking
- Product reviews and comments
- Live chat with admin/staff
- User account management

**Admin/Business Features:**
- Order management (online & offline orders)
- Product and inventory management
- Staff management with scheduling
- Finance tracking and reporting
- Business settings configuration
- Customer communication tools
- Email notifications

### Technology Stack

- **Frontend/Backend:** Next.js 16 (React 19)
- **Database:** SQLite (development) or PostgreSQL (production)
- **Authentication:** NextAuth v5
- **Email Service:** Resend
- **ORM:** Prisma
- **Language:** TypeScript

### System Requirements

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| OS | macOS, Windows, Linux | macOS/Linux |
| Node.js | 18.x | 20.x or later |
| RAM | 4 GB | 8 GB |
| Storage | 1 GB | 5 GB |
| Internet | Required | Broadband |

---

## ✅ Prerequisites

Before starting the setup, ensure you have the following installed:

### 1. Node.js and npm

**Check if installed:**
```bash
node --version    # Should show v18.x or higher
npm --version     # Should show 9.x or higher
```

**Not installed?** Download from: https://nodejs.org/
- Download the **LTS (Long Term Support)** version
- Follow the installer instructions for your operating system

### 2. Git (Optional but Recommended)

**Check if installed:**
```bash
git --version
```

**Not installed?** Download from: https://git-scm.com/

### 3. Code Editor (Recommended)

- **Visual Studio Code**: https://code.visualstudio.com/
- **Alternative:** Any text editor will work

### 4. Terminal/Command Line Access

- **macOS:** Terminal (pre-installed)
- **Windows:** PowerShell or Command Prompt
- **Linux:** Terminal (pre-installed)

---

## 🚀 Quick Start Guide

**For experienced users who want to get started immediately:**

```bash
# 1. Navigate to project directory
cd "/Users/mingyang/Desktop/Online store"

# 2. Install dependencies
npm install

# 3. Set up database
npx prisma db push
npx prisma generate
npx prisma db seed

# 4. Start the server
npm run dev
```

Access the system at: http://localhost:3000

**Default Admin Login:**
- Email: `admin@store.com`
- Password: `admin123`

---

## 📖 Detailed Setup Instructions

### Step 1: Download or Locate the Project

Navigate to the project directory:

```bash
cd "/Users/mingyang/Desktop/Online store"
```

Verify you're in the correct directory:
```bash
ls -la
```

You should see files like: `package.json`, `prisma/`, `src/`, etc.

---

### Step 2: Install Dependencies

Install all required Node.js packages:

```bash
npm install
```

**What this does:**
- Downloads all third-party libraries
- Sets up development tools
- Prepares the project for use

**Expected output:**
```
added 524 packages in 45s
```

**Time required:** 1-3 minutes (depending on internet speed)

**Troubleshooting:**
- If you get permission errors, try: `sudo npm install` (macOS/Linux)
- If installation fails, delete `node_modules` and try again:
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  ```

---

## 🗄️ Database Configuration

The system supports two database options:

### Option A: SQLite (Default - For Development)

**Pros:**
- ✅ Zero configuration needed
- ✅ File-based (no server required)
- ✅ Perfect for development and testing
- ✅ Included by default

**Cons:**
- ⚠️ Not suitable for high-traffic production
- ⚠️ Single file can be easy to corrupt
- ⚠️ Limited concurrent connections

**Configuration:**

1. **Check `.env` file** - should contain:
   ```env
   DATABASE_URL="file:./dev.db"
   ```

2. **That's it!** SQLite requires no additional setup.

**Database file location:** `prisma/dev.db`

---

### Option B: PostgreSQL (For Production)

**Pros:**
- ✅ Production-ready
- ✅ Scalable and robust
- ✅ Better performance under load
- ✅ Free cloud hosting available

**Cons:**
- ⚠️ Requires additional setup
- ⚠️ Needs internet connection (if using cloud)

#### PostgreSQL - Cloud Setup (Recommended)

Choose ONE of these free cloud providers:

##### 1. Neon (Recommended) ⭐

**Free Tier:** 10 GB storage, 100 hours compute/month

**Setup Steps:**

1. **Sign up at:** https://neon.tech
   - Click "Sign Up"
   - Use GitHub, Google, or email
   - No credit card required

2. **Create a new project:**
   - Click "Create a project"
   - **Project name:** `online-store` (or your choice)
   - **Region:** Choose closest to you (e.g., US East, Europe)
   - **PostgreSQL version:** 16 (recommended)
   - Click "Create project"

3. **Get connection string:**
   - After creation, you'll see "Connection Details"
   - Copy the connection string (looks like):
     ```
     postgresql://username:password@ep-name-123.region.aws.neon.tech/dbname?sslmode=require
     ```
   - **Save this** - you'll need it for `.env` file

4. **Update `.env` file:**
   ```env
   DATABASE_URL="postgresql://username:password@ep-name-123.region.aws.neon.tech/dbname?sslmode=require"
   ```

5. **Update Prisma schema:**
   - Open `prisma/schema.prisma`
   - Change line 9 from:
     ```prisma
     provider = "sqlite"
     ```
   - To:
     ```prisma
     provider = "postgresql"
     ```

**Dashboard:** https://console.neon.tech

---

##### 2. Supabase (Alternative)

**Free Tier:** 500 MB database, unlimited API requests

**Setup Steps:**

1. **Sign up at:** https://supabase.com
   - Click "Start your project"
   - Sign up with GitHub (recommended)

2. **Create a new project:**
   - Click "New Project"
   - **Name:** `online-store`
   - **Database Password:** Create a strong password (save it!)
   - **Region:** Choose closest to you
   - **Pricing Plan:** Free
   - Click "Create new project" (takes ~2 minutes)

3. **Get connection string:**
   - Go to **Settings** → **Database**
   - Scroll to **"Connection string"**
   - Select **"URI"** tab
   - Copy and replace `[YOUR-PASSWORD]` with your actual password:
     ```
     postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
     ```

4. **Update `.env` file:** (same as Neon above)

5. **Update Prisma schema:** (same as Neon above)

**Dashboard:** https://supabase.com/dashboard

---

##### 3. Railway (Alternative)

**Free Tier:** 512 MB RAM, 1 GB storage

**Setup Steps:**

1. **Sign up at:** https://railway.app
   - Sign up with GitHub

2. **Create PostgreSQL database:**
   - Click "New Project"
   - Select "Deploy PostgreSQL"
   - Wait ~30 seconds for deployment

3. **Get connection string:**
   - Click on the PostgreSQL service
   - Go to "Connect" tab
   - Copy "Postgres Connection URL"

4. **Update `.env` and schema:** (same as Neon above)

**Dashboard:** https://railway.app/dashboard

---

#### PostgreSQL - Local Setup (Advanced)

If you want to run PostgreSQL on your own machine:

**macOS:**
```bash
# Install PostgreSQL
brew install postgresql@16

# Start PostgreSQL service
brew services start postgresql@16

# Create database
createdb onlinestore

# Connection string:
DATABASE_URL="postgresql://postgres:@localhost:5432/onlinestore"
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo -u postgres createdb onlinestore
```

**Windows:**
- Download installer from: https://www.postgresql.org/download/windows/
- Follow installation wizard
- Use pgAdmin to create database

---

## 📧 Email Service Setup

The system uses **Resend** for sending email notifications.

### Why Email is Important

The system sends emails for:
- Order confirmations (to customers)
- Order notifications (to business owner)
- Daily order summaries
- Password resets (future feature)

### Setting Up Resend (Free)

**Free Tier:** 100 emails per day, 3,000 per month

#### Step 1: Create Resend Account

1. Go to: https://resend.com
2. Click "Get Started"
3. Sign up (email or GitHub)
4. Verify your email address

#### Step 2: Get API Key

1. After login, click **"API Keys"** in sidebar
2. Click **"Create API Key"**
3. **Name:** `online-store-production` (or your choice)
4. **Permission:** Full access
5. Click **"Add"**
6. **Copy the API key** (starts with `re_...`)
   - ⚠️ **CRITICAL:** Save it now! You won't see it again
   - Store it securely (you'll add it to `.env`)

#### Step 3: Configure Sender Email

**Option A: Use Test Email (Quick Start)**

For testing and development:
- Sender email: `onboarding@resend.dev`
- Can only send to your verified email address
- No domain setup required
- Perfect for getting started

**Option B: Add Your Own Domain (Production)**

For production use with your business domain:

1. In Resend dashboard, go to **"Domains"**
2. Click **"Add Domain"**
3. Enter your domain (e.g., `yourstore.com`)
4. Add the DNS records shown:
   - **TXT record** for verification
   - **MX records** for email delivery
   - **CNAME records** for DKIM
5. Wait for verification (can take up to 48 hours)
6. Use emails like: `orders@yourstore.com`, `info@yourstore.com`

#### Step 4: Update .env File

```env
RESEND_API_KEY="re_your_actual_key_here"
RESEND_FROM_EMAIL="onboarding@resend.dev"
```

For production with your domain:
```env
RESEND_API_KEY="re_your_actual_key_here"
RESEND_FROM_EMAIL="orders@yourstore.com"
```

### Testing Email

After setup, you can test by:
1. Placing a test order on the site
2. Checking Resend dashboard → "Emails" section
3. Verifying email was sent and delivered

**Resend Dashboard:** https://resend.com/emails

---

## 🔧 Environment Variables

The `.env` file contains all configuration settings.

### Creating/Editing .env File

**Location:** Root of project directory (`/Users/mingyang/Desktop/Online store/.env`)

**How to edit:**

**Option 1: Using Code Editor**
```bash
code .env    # If using VS Code
```

**Option 2: Using Terminal**
```bash
nano .env    # macOS/Linux
notepad .env # Windows
```

### Complete .env Configuration

```env
# ===========================================
# DATABASE CONFIGURATION
# ===========================================

# For SQLite (Development - Default)
DATABASE_URL="file:./dev.db"

# For PostgreSQL (Production - Choose one)
# Neon:
# DATABASE_URL="postgresql://user:pass@ep-xxx.region.aws.neon.tech/db?sslmode=require"

# Supabase:
# DATABASE_URL="postgresql://postgres.xxx:pass@db.xxx.supabase.co:5432/postgres"

# Railway:
# DATABASE_URL="postgresql://postgres:pass@containers.railway.app:5432/railway"

# Local PostgreSQL:
# DATABASE_URL="postgresql://postgres:password@localhost:5432/onlinestore"


# ===========================================
# EMAIL SERVICE (Resend)
# ===========================================

# Get your API key from: https://resend.com/api-keys
RESEND_API_KEY="re_your_actual_api_key_here"

# For testing/development (can only send to your verified email):
RESEND_FROM_EMAIL="onboarding@resend.dev"

# For production (after adding your domain to Resend):
# RESEND_FROM_EMAIL="orders@yourdomain.com"


# ===========================================
# AUTHENTICATION
# ===========================================

# Generate a secure secret with: openssl rand -base64 32
AUTH_SECRET="6RYvPw0btkEstsu9f6IkPETIYosTOL8tlEn+h6ph3HA="

# For production deployment, add:
# NEXTAUTH_URL="https://yourdomain.com"


# ===========================================
# OPTIONAL: PRODUCTION SETTINGS
# ===========================================

# NODE_ENV="production"
# PORT=3000
```

### Generating AUTH_SECRET

For better security, generate a new authentication secret:

```bash
openssl rand -base64 32
```

Copy the output and use it as `AUTH_SECRET` value.

### Important Notes

- ⚠️ **Never commit `.env` file to Git** (it's in `.gitignore`)
- ⚠️ Keep your API keys secret
- ⚠️ Use different secrets for development and production
- ⚠️ Backup your `.env` file securely

---

## 🔨 Initial System Setup

After configuring environment variables, initialize the system:

### Step 1: Push Database Schema

Create all database tables:

```bash
npx prisma db push
```

**What this does:**
- Reads `prisma/schema.prisma`
- Creates all tables in your database
- Sets up relationships and indexes

**Expected output:**
```
Your database is now in sync with your Prisma schema.
✔ Generated Prisma Client
```

**Time required:** 10-30 seconds

---

### Step 2: Generate Prisma Client

Generate TypeScript types and database client:

```bash
npx prisma generate
```

**What this does:**
- Creates type-safe database client
- Generates TypeScript types from your schema
- Enables autocomplete in your code editor

**Expected output:**
```
✔ Generated Prisma Client
```

---

### Step 3: Seed Database

Populate database with initial data:

```bash
npx prisma db seed
```

**What this does:**
- Creates default admin account
- Adds sample data (optional)
- Sets up initial system settings

**Expected output:**
```
🌱 Seeding database...
✓ Created admin user
✓ Created sample settings
🌱 Database seeded successfully!
```

**Default credentials created:**
- **Email:** `admin@store.com`
- **Password:** `admin123`

⚠️ **Important:** Change the admin password after first login!

---

### Step 4: Clear Build Cache (Optional but Recommended)

```bash
rm -rf .next
rm -f tsconfig.tsbuildinfo
```

**What this does:**
- Removes previous build artifacts
- Ensures clean start
- Prevents caching issues

---

## 🏃 Running the System

### Starting the Development Server

```bash
npm run dev
```

**Expected output:**
```
> app@0.1.0 dev
> next dev

  ▲ Next.js 16.0.3
  - Local:        http://localhost:3000
  - Network:      http://192.168.x.x:3000
  - Ready in 2.3s
```

**What this means:**
- ✅ Server is running
- ✅ Access locally at: `http://localhost:3000`
- ✅ Access from network at: `http://192.168.x.x:3000`
- ✅ Hot reload enabled (changes auto-refresh)

### Stopping the Server

Press `Ctrl + C` in the terminal

### Starting on a Different Port

```bash
PORT=3001 npm run dev
```

### Running in Background (macOS/Linux)

```bash
npm run dev > server.log 2>&1 &
```

View logs:
```bash
tail -f server.log
```

Stop background server:
```bash
pkill -f "next dev"
```

---

## 🔐 System Access & Login

### Customer/Public Access

**Homepage:** http://localhost:3000

**Main Public Pages:**
- `/` - Homepage
- `/products` - Product listing
- `/products/[id]` - Product details
- `/reviews` - Customer reviews
- `/contact` - Contact information
- `/login` - User login
- `/register` - User registration

**User Features:**
- Browse products without login
- Must login to:
  - Add to cart and checkout
  - Post comments/reviews
  - Access chat
  - View order history

---

### Admin/Staff Access

**Admin Login:** http://localhost:3000/login

**Default Admin Credentials:**
- **Email:** `admin@store.com`
- **Password:** `admin123`

⚠️ **CRITICAL:** Change these credentials immediately after first login!

**Admin Pages:**
- `/admin` - Admin dashboard
- `/admin/orders` - Order management
- `/admin/products` - Product management
- `/admin/staff` - Staff management
- `/admin/settings` - System settings
- `/admin/finance` - Finance tracking
- `/admin/chat` - Customer chat

### User Roles

The system has 4 user roles:

| Role | Permissions | Use Case |
|------|-------------|----------|
| **USER** | Browse, purchase, comment, chat | Regular customers |
| **STAFF** | View orders, chat access | Store employees |
| **MANAGER** | Full admin access except some settings | Store managers |
| **ADMIN** | Complete system access | Business owner |

### Changing Admin Password

1. Login as admin
2. Go to admin dashboard
3. Navigate to user settings (future feature)

**Or via database:**
```bash
npx prisma studio
```
- Open Users table
- Find admin user
- Generate new hash: (use bcrypt online tool)
- Update password field

---

## 🗄️ Database Management

### Viewing Database with Prisma Studio

**Open visual database browser:**

```bash
npx prisma studio
```

**Access at:** http://localhost:5555

**Features:**
- ✅ View all tables
- ✅ Add/edit/delete records
- ✅ Search and filter
- ✅ Manage relationships
- ✅ Export data

**Common tasks in Prisma Studio:**

1. **View Users:**
   - Click "User" table
   - See all registered users

2. **View Orders:**
   - Click "Order" table
   - View order details
   - Click order → view related items

3. **Manage Products:**
   - Click "Product" table
   - Add new products
   - Update stock levels

4. **Edit Settings:**
   - Click "Settings" table
   - Modify system configurations

### Database Backup

**For SQLite:**

```bash
# Backup
cp prisma/dev.db prisma/dev.db.backup.$(date +%Y%m%d)

# Restore
cp prisma/dev.db.backup.20251122 prisma/dev.db
```

**For PostgreSQL:**

```bash
# Backup (if using local PostgreSQL)
pg_dump onlinestore > backup.sql

# Restore
psql onlinestore < backup.sql
```

**For Cloud PostgreSQL:**
- Neon: Automatic backups included
- Supabase: Backups in dashboard
- Railway: Logs and snapshots available

### Resetting Database

⚠️ **Warning:** This deletes ALL data!

```bash
# Delete and recreate database
npx prisma db push --force-reset

# Re-seed with initial data
npx prisma db seed
```

### Database Migrations (Production)

For production systems, use migrations:

```bash
# Create migration
npx prisma migrate dev --name init

# Apply migrations
npx prisma migrate deploy
```

---

## ✅ Testing & Verification

### Automated Testing Commands

**1. Check Server is Running:**
```bash
curl -I http://localhost:3000
```

Expected: `HTTP/1.1 200 OK`

**2. Test API Endpoints:**
```bash
# Test products API
curl http://localhost:3000/api/products

# Test settings API
curl http://localhost:3000/api/settings
```

**3. Run Linting:**
```bash
npm run lint
```

Expected: No errors (or only warnings)

**4. TypeScript Check:**
```bash
npx tsc --noEmit
```

Expected: No type errors

---

### Manual Testing Checklist

#### Customer Flow:
- [ ] Homepage loads successfully
- [ ] Can browse products
- [ ] Can view product details
- [ ] Can register new account
- [ ] Can login with account
- [ ] Can add products to cart
- [ ] Can complete checkout
- [ ] Order confirmation received
- [ ] Can view order history
- [ ] Can post comments
- [ ] Can access chat

#### Admin Flow:
- [ ] Can login as admin
- [ ] Admin dashboard displays correctly
- [ ] Can view all orders
- [ ] Can view order details
- [ ] Can toggle order status
- [ ] Can add new product
- [ ] Can edit existing product
- [ ] Can delete product
- [ ] Can add staff member
- [ ] Can view staff schedules
- [ ] Can update business settings
- [ ] Can view finance dashboard
- [ ] Can access customer chats

#### Email Testing:
- [ ] Place an order
- [ ] Check Resend dashboard for sent email
- [ ] Verify customer receives order confirmation
- [ ] Verify admin receives order notification

---

## 🔧 Troubleshooting

### Common Issues and Solutions

#### Issue 1: Port Already in Use

**Error:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution:**

**macOS/Linux:**
```bash
# Find process using port 3000
lsof -ti:3000

# Kill the process
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm run dev
```

**Windows:**
```cmd
# Find process
netstat -ano | findstr :3000

# Kill process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

---

#### Issue 2: Database Connection Failed

**Error:**
```
Can't reach database server at...
```

**For SQLite:**
- Check `DATABASE_URL` in `.env` is: `file:./dev.db`
- Ensure `prisma/` directory exists
- Run: `npx prisma db push`

**For PostgreSQL:**
- Verify DATABASE_URL is correct
- Check database is running (for local)
- For Neon: Check if project is active (free tier sleeps)
- Ensure `?sslmode=require` is in connection string
- Test connection:
  ```bash
  npx prisma db push
  ```

---

#### Issue 3: Prisma Client Not Found

**Error:**
```
@prisma/client did not initialize yet
```

**Solution:**
```bash
npx prisma generate
npm run dev
```

---

#### Issue 4: Module Not Found

**Error:**
```
Cannot find module 'xyz'
```

**Solution:**
```bash
# Clean reinstall
rm -rf node_modules package-lock.json
npm install

# Regenerate Prisma
npx prisma generate

# Restart server
npm run dev
```

---

#### Issue 5: Emails Not Sending

**Error:** No emails received

**Solutions:**

1. **Check Resend Dashboard:**
   - Go to https://resend.com/emails
   - Verify emails are being sent
   - Check for error messages

2. **Verify API Key:**
   - Check `RESEND_API_KEY` in `.env`
   - Ensure no extra spaces or quotes
   - Key should start with `re_`

3. **Check Sender Email:**
   - Using `onboarding@resend.dev`?
   - Can only send to verified email address
   - Check spam folder

4. **View Server Logs:**
   - Check terminal running `npm run dev`
   - Look for email-related errors

---

#### Issue 6: Build Errors

**Error:** Various TypeScript or build errors

**Solution:**
```bash
# Clear everything
rm -rf .next node_modules/.cache tsconfig.tsbuildinfo

# Regenerate
npx prisma generate

# Reinstall if needed
rm -rf node_modules
npm install

# Try again
npm run dev
```

---

#### Issue 7: 500 Internal Server Error

**Check:**
1. Terminal logs for error details
2. Database connection is working
3. Prisma Client is generated
4. `.env` file is complete

**Solution:**
```bash
# Full reset
npx prisma generate
rm -rf .next
npm run dev
```

---

#### Issue 8: Login Not Working

**Symptoms:** Can't login with admin credentials

**Solutions:**

1. **Check database was seeded:**
   ```bash
   npx prisma studio
   ```
   - Open Users table
   - Verify admin@store.com exists

2. **Re-seed database:**
   ```bash
   npx prisma db seed
   ```

3. **Check AUTH_SECRET in .env**
   - Must be present
   - Must be a valid base64 string

---

## 📅 Daily Operations

### Starting Work

```bash
# Navigate to project
cd "/Users/mingyang/Desktop/Online store"

# Start server
npm run dev
```

### Stopping Work

```bash
# Press Ctrl+C to stop server
Ctrl+C

# Or if running in background
pkill -f "next dev"
```

### Checking System Status

```bash
# Check if server is running
curl -I http://localhost:3000

# View database
npx prisma studio
```

### Monitoring Logs

Watch terminal output while server is running for:
- Incoming requests
- Errors
- Email sending status
- Database queries (if enabled)

---

## 🔄 System Maintenance

### Regular Tasks

#### Daily:
- [ ] Monitor order notifications
- [ ] Check email delivery (Resend dashboard)
- [ ] Review any error logs

#### Weekly:
- [ ] Backup database
- [ ] Update product inventory
- [ ] Review user registrations
- [ ] Clean old chat messages (if needed)

#### Monthly:
- [ ] Check for system updates: `npm outdated`
- [ ] Review finance reports
- [ ] Audit user accounts
- [ ] Check free tier usage (Neon, Resend, etc.)

### Updating Dependencies

**Check for updates:**
```bash
npm outdated
```

**Update packages:**
```bash
# Update all
npm update

# Update specific package
npm install package-name@latest

# After updates
npx prisma generate
npm run dev
```

### Database Maintenance

**Clean old data:**
```bash
# Open Prisma Studio
npx prisma studio

# Manually delete:
# - Old messages (older than 7 days)
# - Verification codes (expired)
# - Test orders (if any)
```

**Optimize database:**

For SQLite:
```bash
sqlite3 prisma/dev.db "VACUUM;"
```

For PostgreSQL: Automatic

---

## 🔒 Security Considerations

### Essential Security Practices

1. **Change Default Credentials:**
   - Change admin password immediately
   - Use strong, unique passwords
   - Never use `admin123` in production

2. **Protect .env File:**
   - Never commit to Git
   - Set proper file permissions:
     ```bash
     chmod 600 .env
     ```
   - Keep secure backups

3. **Use HTTPS in Production:**
   - Always use SSL/TLS
   - Vercel provides automatic HTTPS

4. **Keep Dependencies Updated:**
   - Run `npm audit` regularly
   - Update vulnerable packages:
     ```bash
     npm audit fix
     ```

5. **Secure API Keys:**
   - Use different keys for dev/production
   - Rotate keys regularly
   - Never expose in client-side code

6. **Database Security:**
   - Use strong database passwords
   - Enable row-level security (PostgreSQL)
   - Regular backups

### Security Checklist

- [ ] Changed default admin password
- [ ] Generated unique AUTH_SECRET
- [ ] Protected .env file
- [ ] Using HTTPS (production)
- [ ] Regular security updates
- [ ] Database backups enabled
- [ ] API keys secured
- [ ] No sensitive data in logs

---

## 💾 Backup & Recovery

### What to Backup

1. **Database**
2. **.env file** (securely!)
3. **Uploaded images** (public/ folder)
4. **Custom code changes**

### Backup Procedures

#### SQLite Database Backup

**Automatic backup script:**

Create `backup.sh`:
```bash
#!/bin/bash
backup_dir="backups"
mkdir -p "$backup_dir"
date_suffix=$(date +%Y%m%d_%H%M%S)

# Backup database
cp prisma/dev.db "$backup_dir/dev.db.$date_suffix"

# Backup .env (encrypted)
tar czf "$backup_dir/env.$date_suffix.tar.gz" .env
chmod 600 "$backup_dir/env.$date_suffix.tar.gz"

# Keep only last 30 days
find "$backup_dir" -name "dev.db.*" -mtime +30 -delete

echo "Backup completed: $date_suffix"
```

Run:
```bash
chmod +x backup.sh
./backup.sh
```

Schedule daily:
```bash
crontab -e
# Add line:
0 2 * * * cd /path/to/project && ./backup.sh
```

#### PostgreSQL Cloud Backup

**Neon:** 
- Automatic backups included
- Point-in-time recovery available
- Access via dashboard

**Supabase:**
- Daily automatic backups
- Download from dashboard
- Restore from snapshots

**Railway:**
- Volume snapshots available
- Manual backup via pg_dump

### Recovery Procedures

**Restore SQLite:**
```bash
# Stop server
Ctrl+C

# Restore backup
cp backups/dev.db.20251122_140000 prisma/dev.db

# Restart server
npm run dev
```

**Restore PostgreSQL:**
```bash
# From backup file
psql onlinestore < backup.sql

# Or restore via cloud dashboard
```

---

## 🚀 Deployment to Production

### Option 1: Vercel (Recommended)

**Pros:**
- ✅ Free hosting
- ✅ Automatic HTTPS
- ✅ Auto-deployment from Git
- ✅ Optimized for Next.js
- ✅ Built-in CDN

**Steps:**

1. **Create Vercel Account:**
   - Go to: https://vercel.com
   - Sign up with GitHub

2. **Import Project:**
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Or use Vercel CLI:
     ```bash
     npm install -g vercel
     vercel
     ```

3. **Configure Environment Variables:**
   - In Vercel dashboard → Settings → Environment Variables
   - Add each variable from your `.env`:
     - `DATABASE_URL` (use PostgreSQL, not SQLite)
     - `RESEND_API_KEY`
     - `RESEND_FROM_EMAIL`
     - `AUTH_SECRET`
     - `NEXTAUTH_URL` (your Vercel URL)

4. **Deploy:**
   ```bash
   vercel --prod
   ```

5. **Push Database Schema:**
   ```bash
   npx prisma db push
   npx prisma db seed
   ```

Your app will be live at: `https://your-app.vercel.app`

---

### Option 2: Self-Hosted VPS

**For advanced users:**

1. **Set up server** (Ubuntu/Debian):
   ```bash
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt install -y nodejs

   # Install PM2
   npm install -g pm2
   ```

2. **Deploy code:**
   ```bash
   git clone your-repo
   cd project
   npm install
   npx prisma generate
   npx prisma db push
   npm run build
   ```

3. **Run with PM2:**
   ```bash
   pm2 start npm --name "store" -- start
   pm2 save
   pm2 startup
   ```

4. **Set up Nginx reverse proxy** (for HTTPS)

---

### Production Checklist

- [ ] Using PostgreSQL (not SQLite)
- [ ] Changed all default passwords
- [ ] Generated production AUTH_SECRET
- [ ] Using real domain for email
- [ ] HTTPS enabled
- [ ] Environment variables set
- [ ] Database migrations run
- [ ] System tested thoroughly
- [ ] Backups configured
- [ ] Monitoring set up
- [ ] Error logging enabled

---

## ❓ FAQ

### General Questions

**Q: What database should I use?**  
A: SQLite for development/testing, PostgreSQL for production.

**Q: Is this system free to run?**  
A: Yes! Using SQLite + Resend free tier = $0/month.

**Q: Can I use this for a real business?**  
A: Yes, but use PostgreSQL and proper hosting (Vercel/VPS).

**Q: How many products can I have?**  
A: Unlimited (limited only by database storage).

**Q: How many orders can it handle?**  
A: Thousands per day (with PostgreSQL and proper hosting).

### Technical Questions

**Q: Can I customize the design?**  
A: Yes, all code is editable. Modify files in `src/app/`.

**Q: Can I add more features?**  
A: Yes, the codebase is fully extensible.

**Q: Do I need to know coding?**  
A: Basic knowledge helps, but this manual covers setup without coding.

**Q: Can I migrate from SQLite to PostgreSQL later?**  
A: Yes, use the `migrate-to-postgres.sh` script.

**Q: What happens if I exceed free tier limits?**  
A: Resend: Emails won't send. Neon: Database may pause. Upgrade as needed.

### Troubleshooting Questions

**Q: Server won't start  
A: Check if port 3000 is in use, verify dependencies installed.

**Q: Can't login as admin?**  
A: Re-seed database: `npx prisma db seed`

**Q: Emails not sending?**  
A: Check Resend API key, verify sender email, check dashboard.

**Q: Database errors?**  
A: Run `npx prisma db push` and `npx prisma generate`

---

## 📞 Support & Resources

### Documentation

- **This Manual:** Complete setup and operations guide
- **Next.js Docs:** https://nextjs.org/docs
- **Prisma Docs:** https://www.prisma.io/docs
- **NextAuth Docs:** https://authjs.dev
- **Resend Docs:** https://resend.com/docs

### Getting Help

1. **Check this manual** - Most issues covered here
2. **View server logs** - Error messages often explain the issue
3. **Search error messages** - Google the exact error
4. **Check service status pages:**
   - Neon: https://neon.tech/status
   - Resend: https://resend.com/status
   - Vercel: https://vercel-status.com

### Useful Commands Reference

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm start                # Start production server
npm run lint             # Check code quality

# Database
npx prisma studio        # Open database GUI
npx prisma db push       # Push schema to database
npx prisma generate      # Generate Prisma Client
npx prisma db seed       # Seed initial data
npx prisma migrate dev   # Create migration

# Maintenance
npm install              # Install dependencies
npm update               # Update packages
npm outdated             # Check for updates
npm audit                # Security check
npm audit fix            # Fix vulnerabilities

# Server Management
lsof -ti:3000            # Check port usage (macOS/Linux)
pkill -f "next dev"      # Stop server (background)
```

---

## 📋 Appendix

### Default System Settings

| Setting | Default Value | Configurable |
|---------|---------------|--------------|
| Port | 3000 | Yes (via PORT env) |
| Database | SQLite (dev.db) | Yes (via DATABASE_URL) |
| Admin Email | admin@store.com | Yes (change in DB) |
| Admin Password | admin123 | Yes (change ASAP!) |
| Email From | onboarding@resend.dev | Yes (via .env) |
| Session Timeout | 30 days | Yes (in code) |
| GST Rate | 10% | Yes (admin settings) |
| Chat Retention | 7 days | Yes (in code) |

### File Structure

```
Online store/
├── .env                    # Environment configuration
├── .gitignore              # Git ignore rules
├── package.json            # Dependencies
├── next.config.ts          # Next.js configuration
├── tsconfig.json           # TypeScript configuration
├── prisma/
│   ├── schema.prisma       # Database schema
│   ├── seed.ts             # Seed data script
│   └── dev.db              # SQLite database (if using)
├── src/
│   ├── app/                # Next.js app directory
│   │   ├── api/            # API routes
│   │   ├── admin/          # Admin pages
│   │   ├── products/       # Product pages
│   │   ├── actions/        # Server actions
│   │   └── ...
│   └── lib/                # Utilities
├── public/                 # Static assets
├── node_modules/           # Dependencies (auto-generated)
└── documentation files...
```

### System Limits

**SQLite (Development):**
- Max database size: ~2 GB (practical limit ~500 MB)
- Concurrent users: ~100
- Good for: Development, testing, small deployments

**PostgreSQL (Production):**
- Neon free: 10 GB storage
- Supabase free: 500 MB storage
- Railway free: 1 GB storage
- Concurrent users: Thousands
- Good for: Production, scaling

**Email (Resend Free):**
- 100 emails per day
- 3,000 emails per month
- 1 domain
- Good for: Small to medium stores

---

## ✅ Setup Completion Checklist

Print this page and check off each item:

### Prerequisites
- [ ] Node.js installed (v18+)
- [ ] npm installed
- [ ] Code editor ready
- [ ] Terminal accessible

### Installation
- [ ] Project located/downloaded
- [ ] Dependencies installed (`npm install`)
- [ ] No installation errors

### Database
- [ ] Database choice made (SQLite or PostgreSQL)
- [ ] If PostgreSQL: Cloud service account created
- [ ] If PostgreSQL: Connection string obtained
- [ ] Database schema pushed (`npx prisma db push`)
- [ ] Prisma Client generated (`npx prisma generate`)
- [ ] Database seeded (`npx prisma db seed`)

### Email
- [ ] Resend account created
- [ ] API key obtained
- [ ] Sender email configured

### Configuration
- [ ] .env file created/updated
- [ ] DATABASE_URL set correctly
- [ ] RESEND_API_KEY set
- [ ] RESEND_FROM_EMAIL set
- [ ] AUTH_SECRET set

### Testing
- [ ] Server starts successfully (`npm run dev`)
- [ ] Homepage loads (http://localhost:3000)
- [ ] Can login as admin
- [ ] Admin dashboard accessible
- [ ] Products page works
- [ ] Order system functional
- [ ] Email notifications work

### Security
- [ ] Changed admin password
- [ ] .env file protected
- [ ] Unique AUTH_SECRET generated

### Production (if applicable)
- [ ] Using PostgreSQL
- [ ] Deployed to hosting
- [ ] Environment variables set
- [ ] Testing completed
- [ ] Backups configured
- [ ] Monitoring enabled

---

**🎉 Congratulations!**

Your online store system is now set up and ready to use!

---

**Document Version:** 1.0  
**Last Updated:** November 22, 2025  
**Next Review:** As needed for major updates

---

For questions or issues not covered in this manual, refer to the support resources section or check the service-specific documentation.
