---
description: Complete system setup from scratch
---

# Complete System Setup Workflow

Follow these steps to set up the online store system from start to finish:

## Prerequisites Check

1. Verify Node.js is installed (v18+):
```bash
node --version
```

2. Verify npm is installed:
```bash
npm --version
```

## Setup Steps

// turbo
1. Navigate to project directory:
```bash
cd "/Users/mingyang/Desktop/Online store"
```

// turbo
2. Install all dependencies:
```bash
npm install
```

3. Review and configure `.env` file:
   - Update `RESEND_API_KEY` if you have one
   - Update `RESEND_FROM_EMAIL` if you have one
   - Other values are pre-configured

// turbo
4. Push database schema to create tables:
```bash
npx prisma db push
```

// turbo
5. Generate Prisma Client types:
```bash
npx prisma generate
```

// turbo
6. Seed database with initial data:
```bash
npx prisma db seed
```

// turbo
7. Clear build cache:
```bash
rm -rf .next && rm -f tsconfig.tsbuildinfo
```

8. Start the development server:
```bash
npm run dev
```

9. Open browser and verify:
   - Homepage: http://localhost:3000
   - Login: http://localhost:3000/login (admin@store.com / admin123)
   - Admin: http://localhost:3000/admin
   - Orders: http://localhost:3000/admin/orders

## Verification

// turbo
10. Test homepage accessibility:
```bash
curl -I http://localhost:3000
```

// turbo
11. Run linting check:
```bash
npm run lint
```

## Optional: View Database

12. Open Prisma Studio to view/edit data:
```bash
npx prisma studio
```

## Success Indicators

✅ Server running on http://localhost:3000
✅ No errors in terminal
✅ Can login with admin@store.com / admin123
✅ Admin panel loads
✅ Orders page shows dashboard

## Default Credentials

- **Admin**: admin@store.com / admin123
