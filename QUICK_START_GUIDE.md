# 🚀 Quick Start - One Page Reference

**For:** System Users | **Last Updated:** 2025-11-22

---

## ⚡ 5-Minute Setup (SQLite)

```bash
# 1. Navigate to project
cd "/Users/mingyang/Desktop/Online store"

# 2. Install dependencies
npm install

# 3. Set up database
npx prisma db push
npx prisma generate
npx prisma db seed

# 4. Start server
npm run dev
```

**Access:** http://localhost:3000  
**Admin Login:** admin@store.com / admin123

---

## 📂 .env File Configuration

Create/edit `.env` in project root:

```env
# Database (choose one)
DATABASE_URL="file:./dev.db"  # SQLite (development)
# DATABASE_URL="postgresql://..." # PostgreSQL (production)

# Email (get from resend.com)
RESEND_API_KEY="re_your_key_here"
RESEND_FROM_EMAIL="onboarding@resend.dev"

# Auth (generate: openssl rand -base64 32)
AUTH_SECRET="6RYvPw0btkEstsu9f6IkPETIYosTOL8tlEn+h6ph3HA="
```

---

## 🗄️ Database Options

### SQLite (Default - Development)
✅ Zero configuration  
✅ File-based  
⚠️ Not for high-traffic production  

```env
DATABASE_URL="file:./dev.db"
```

### PostgreSQL (Production)

**Free Cloud Options:**

| Service | Free Tier | Sign Up |
|---------|-----------|---------|
| **Neon** ⭐ | 10 GB | https://neon.tech |
| **Supabase** | 500 MB | https://supabase.com |
| **Railway** | 1 GB | https://railway.app |

**Steps:**
1. Sign up (no credit card)
2. Create PostgreSQL database
3. Copy connection string
4. Update `.env`:
   ```env
   DATABASE_URL="postgresql://user:pass@host/db?sslmode=require"
   ```
5. Update `prisma/schema.prisma`:
   ```prisma
   provider = "postgresql"  // change from "sqlite"
   ```
6. Run: `npx prisma db push`

---

## 📧 Email Setup (Resend)

**Free:** 100 emails/day

1. Sign up: https://resend.com
2. Get API key (starts with `re_`)
3. Update `.env`:
   ```env
   RESEND_API_KEY="re_abc123..."
   RESEND_FROM_EMAIL="onboarding@resend.dev"
   ```

---

## 🔧 Common Commands

```bash
# Start server
npm run dev

# Stop server
Ctrl + C

# View/edit database
npx prisma studio

# Reset database
npx prisma db push --force-reset
npx prisma db seed

# Check for errors
npm run lint

# Update dependencies
npm update

# Clear cache and restart
rm -rf .next && npm run dev
```

---

## 🌐 Access URLs

### Public Pages
- Homepage: http://localhost:3000
- Products: http://localhost:3000/products
- Reviews: http://localhost:3000/reviews
- Contact: http://localhost:3000/contact
- Login: http://localhost:3000/login

### Admin Pages (after login)
- Dashboard: http://localhost:3000/admin
- Orders: http://localhost:3000/admin/orders
- Products: http://localhost:3000/admin/products
- Staff: http://localhost:3000/admin/staff
- Settings: http://localhost:3000/admin/settings
- Finance: http://localhost:3000/admin/finance

---

## 🔐 Default Credentials

**Admin Account:**
- Email: `admin@store.com`
- Password: `admin123`

⚠️ **Change password immediately after first login!**

---

## ⚠️ Troubleshooting

### Server won't start
```bash
# Port in use?
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm run dev
```

### Database errors
```bash
npx prisma generate
npx prisma db push
npm run dev
```

### Module not found
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Emails not sending
- Check `RESEND_API_KEY` in `.env`
- Visit https://resend.com/emails to see logs
- Using `onboarding@resend.dev`? Can only send to your verified email

### Can't login
```bash
# Re-create admin account
npx prisma db seed
```

---

## 📊 System Status Checks

```bash
# Is server running?
curl -I http://localhost:3000

# Check Node version
node --version  # Should be v18+

# Check dependencies
npm list --depth=0

# View database
npx prisma studio  # Opens at http://localhost:5555
```

---

## 🔄 Daily Workflow

**Start work:**
```bash
cd "/Users/mingyang/Desktop/Online store"
npm run dev
```

**Stop work:**
```bash
Ctrl + C
```

---

## 💾 Quick Backup

```bash
# Backup SQLite database
cp prisma/dev.db prisma/dev.db.backup.$(date +%Y%m%d)

# Backup .env
cp .env .env.backup
```

---

## 🚀 Deploy to Production

**Vercel (Recommended):**
1. Sign up: https://vercel.com
2. Install CLI: `npm install -g vercel`
3. Deploy: `vercel --prod`
4. Add environment variables in dashboard
5. Use PostgreSQL (not SQLite)

---

## 📋 Quick Checklist

Setup complete when:
- [ ] `npm run dev` starts without errors
- [ ] http://localhost:3000 loads
- [ ] Can login with admin@store.com
- [ ] Admin dashboard accessible
- [ ] Products page works
- [ ] Orders can be created
- [ ] Emails send (check Resend dashboard)

---

## 🆘 Need More Help?

**Read the complete manual:**  
`SYSTEM_SETUP_MANUAL.md` (in project root)

**Covers:**
- Detailed setup instructions
- PostgreSQL configuration
- Email service setup
- Security best practices
- Backup procedures
- Production deployment
- Complete troubleshooting guide

---

## 📞 Quick Links

- **Neon Dashboard:** https://console.neon.tech
- **Supabase Dashboard:** https://supabase.com/dashboard
- **Resend Dashboard:** https://resend.com/emails
- **Vercel Dashboard:** https://vercel.com/dashboard

---

## ⚙️ Environment Variables Quick Reference

| Variable | Required | Example | Get From |
|----------|----------|---------|----------|
| DATABASE_URL | Yes | `file:./dev.db` | Local file or cloud DB |
| RESEND_API_KEY | Yes | `re_abc123...` | https://resend.com |
| RESEND_FROM_EMAIL | Yes | `onboarding@resend.dev` | Resend settings |
| AUTH_SECRET | Yes | `base64string...` | `openssl rand -base64 32` |

---

## 🎯 Migration from SQLite to PostgreSQL

**Quick migration:**
```bash
./migrate-to-postgres.sh
```

**Or manually:**
1. Get PostgreSQL connection string
2. Update `DATABASE_URL` in `.env`
3. Update `provider` in `prisma/schema.prisma`
4. Run: `npx prisma db push && npx prisma db seed`

---

## 💡 Pro Tips

- Use SQLite for development, PostgreSQL for production
- Start with Resend's test email (`onboarding@resend.dev`)
- Run `npx prisma studio` to visually manage data
- Keep `.env` file backed up securely (don't commit to Git)
- Change admin password after first login
- Check Resend dashboard to monitor email delivery
- Free tiers are generous - perfect for getting started

---

**Total Setup Time:** 5-15 minutes  
**Total Cost:** $0 (using free tiers)

**For detailed instructions, see: SYSTEM_SETUP_MANUAL.md**
