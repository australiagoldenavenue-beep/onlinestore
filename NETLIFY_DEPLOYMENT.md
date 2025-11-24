# Netlify Deployment Guide

## ✅ Prisma Fix Implemented

The following changes have been made to fix the `PrismaClientInitializationError` on Netlify:

### 1. Prerequisites (Verified)
- ✅ `@prisma/client` is in `dependencies` (package.json line 13)
- ✅ `prisma` CLI is in `devDependencies` (package.json line 31)
- ✅ `prisma/schema.prisma` is committed to the repository

### 2. Postinstall Script Added
**File: `package.json`**
```json
{
  "scripts": {
    "postinstall": "prisma generate"
  }
}
```
This ensures Prisma Client regenerates on every `npm install` on Netlify's build environment.

### 3. Binary Targets Configuration
**File: `prisma/schema.prisma`**
```prisma
generator client {
  provider      = "prisma-client-js"
  binaryTargets = ["native", "debian-openssl-3.0.x"]
}
```
- `native` - Supports your local development environment (macOS)
- `debian-openssl-3.0.x` - Supports Netlify's Linux build environment

### 4. Netlify Build Configuration
**File: `netlify.toml`** (newly created)
```toml
[build]
  command = "prisma generate && npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```
This provides a double-safety mechanism by explicitly running `prisma generate` before the build.

---

## 🚀 Deployment Steps

### Step 1: Create a GitHub Repository
1. Go to [github.com](https://github.com) and sign in
2. Click the **+** icon → **New repository**
3. Name: `online-store` (or your preferred name)
4. Set to **Private** or **Public** as needed
5. Do NOT initialize with README (your project already has files)
6. Click **Create repository**

### Step 2: Connect Local Repository to GitHub
Copy the repository URL from GitHub, then run:

```bash
cd "/Users/mingyang/Desktop/Online store"
git remote add origin <your-github-repo-url>
```

Example:
```bash
git remote add origin https://github.com/yourusername/online-store.git
```

### Step 3: Commit All Changes
```bash
git add .
git commit -m "Complete online store with Prisma Netlify deployment fix"
```

### Step 4: Push to GitHub
```bash
git push -u origin main
```

If you encounter branch name issues, you may need:
```bash
git branch -M main
git push -u origin main
```

### Step 5: Connect to Netlify
1. Go to [app.netlify.com](https://app.netlify.com) and sign in
2. Click **Add new site** → **Import an existing project**
3. Choose **GitHub** as your Git provider
4. Authorize Netlify to access your GitHub account
5. Select your `online-store` repository
6. Netlify should auto-detect the settings:
   - **Build command**: `prisma generate && npm run build` (from netlify.toml)
   - **Publish directory**: `.next`
   - **Framework**: Next.js

### Step 6: Configure Environment Variables
Before deploying, add your environment variables in Netlify:

1. In Netlify, go to **Site settings** → **Environment variables**
2. Add the following variables:

```
DATABASE_URL=file:./dev.db
NEXTAUTH_SECRET=<your-secret-key>
NEXTAUTH_URL=<your-netlify-url>
RESEND_API_KEY=<your-resend-key>
```

**Important**: For production, consider using a cloud database instead of SQLite:
- PostgreSQL (recommended): [Neon](https://neon.tech), [Supabase](https://supabase.com), [Railway](https://railway.app)
- Update `DATABASE_URL` accordingly

### Step 7: Clear Cache and Deploy
1. Go to **Deploys** tab
2. Click **Trigger deploy** → **Clear cache and deploy site**
3. Monitor the build logs

### Step 8: Verify Deployment
Check the build logs for:
- ✅ `prisma generate` runs successfully
- ✅ No `PrismaClientInitializationError`
- ✅ Build completes successfully
- ✅ Site deploys and is accessible

---

## 🔍 Troubleshooting

### If Build Still Fails
1. **Check build logs** for the specific error
2. **Verify environment variables** are set correctly
3. **Check DATABASE_URL** - SQLite may not work well on Netlify (use PostgreSQL instead)
4. **Try another cache clear**: Deploys → Options → Clear cache and retry deploy

### SQLite Limitations on Netlify
SQLite databases are file-based and don't persist on Netlify's ephemeral filesystem. For production:
1. Use PostgreSQL with a provider like Neon or Supabase
2. Update `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
3. Run migrations on your production database
4. Redeploy

### Common Errors
- **"Unable to find binary"**: Fixed by `binaryTargets` configuration
- **"Cached dependencies"**: Fixed by `postinstall` script and cache clearing
- **"Database connection error"**: Check `DATABASE_URL` environment variable

---

## 📚 Additional Resources
- [Prisma Netlify Deployment Guide](https://pris.ly/d/netlify-build)
- [Next.js on Netlify](https://docs.netlify.com/frameworks/next-js/overview/)
- [Netlify Environment Variables](https://docs.netlify.com/environment-variables/overview/)

---

## ✨ Summary

All Prisma deployment fixes have been implemented:
1. ✅ Postinstall script regenerates Prisma Client
2. ✅ Binary targets support both development and deployment
3. ✅ Netlify.toml provides explicit build configuration
4. ✅ All prerequisites verified

**You're ready to deploy!** Follow the deployment steps above to push your code and deploy to Netlify.
