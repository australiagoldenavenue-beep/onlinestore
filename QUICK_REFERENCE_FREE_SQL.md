# 🎯 Quick Reference: Free SQL Setup

## 🚀 TL;DR - Fastest Path to Free PostgreSQL

### 1️⃣ Get Free PostgreSQL (Pick ONE)

**Option A: Neon (Recommended)**
1. Sign up: https://neon.tech
2. Create project → Copy connection string
3. Format: `postgresql://user:pass@ep-xxx.region.aws.neon.tech/db?sslmode=require`

**Option B: Supabase**
1. Sign up: https://supabase.com
2. New Project → Copy connection string
3. Replace `[YOUR-PASSWORD]` with your password

**Option C: Railway**
1. Sign up: https://railway.app
2. Deploy PostgreSQL → Copy connection string

---

### 2️⃣ Get Free Email

1. Sign up: https://resend.com
2. Create API Key → Copy key (starts with `re_...`)
3. Use `onboarding@resend.dev` as sender (for testing)

---

### 3️⃣ Update Your Project

**Quick Migration:**
```bash
# Run the automated migration script
./migrate-to-postgres.sh
```

**Or Manual Steps:**

1. Update `.env`:
```env
DATABASE_URL="postgresql://your-connection-string-here"
RESEND_API_KEY="re_your_key_here"
RESEND_FROM_EMAIL="onboarding@resend.dev"
```

2. Update `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"  // Change from "sqlite"
  url      = env("DATABASE_URL")
}
```

3. Run commands:
```bash
npx prisma db push
npx prisma generate
npx prisma db seed
npm run dev
```

---

## 📊 Free Tier Comparison

| Service | Database Size | Emails/Day | Best For |
|---------|---------------|------------|----------|
| **Neon** | 10 GB | - | Fast setup, serverless |
| **Supabase** | 500 MB | - | Full platform, auth included |
| **Railway** | 1 GB | - | Simple, Docker-based |
| **Resend** | - | 100 | Email notifications |

---

## ✅ Verification Commands

```bash
# Check database connection
npx prisma studio

# Test server
curl -I http://localhost:3000

# View logs
npm run dev
```

---

## 🆘 Quick Fixes

**Can't connect to database?**
```bash
# Add SSL mode to DATABASE_URL
DATABASE_URL="postgresql://...?sslmode=require"
```

**Emails not working?**
```bash
# Check API key in .env (no quotes inside)
RESEND_API_KEY=re_abc123
```

**Schema errors?**
```bash
npx prisma db push --force-reset
npx prisma db seed
```

---

## 📱 Admin Login

After setup:
- URL: http://localhost:3000/login
- Email: `admin@store.com`
- Password: `admin123`

---

## 💰 Total Cost: $0

All services have generous free tiers perfect for getting started!

**See SETUP_GUIDE_FREE_SQL.md for complete details.**
