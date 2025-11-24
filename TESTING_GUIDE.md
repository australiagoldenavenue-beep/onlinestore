# Testing Guide - Online Store

## Quick Start

### 1. Environment Setup

First, set up your environment variables:

```bash
# Add these to your .env file
RESEND_API_KEY="re_your_api_key_here"
RESEND_FROM_EMAIL="onboarding@resend.dev"
```

**Getting a Resend API Key:**
1. Go to https://resend.com
2. Sign up for a free account
3. Navigate to API Keys
4. Create a new API key
5. Copy and paste it into your `.env` file

> **Note**: For testing, you can use Resend's test email `onboarding@resend.dev`. For production, you'll need to verify your domain.

### 2. Start the Development Server

```bash
npm run dev
```

The server will start at http://localhost:3000

---

## Testing Walkthrough

### Test 1: Register a New User

1. Navigate to http://localhost:3000/register
2. Fill in the registration form:
   - Email: `test@example.com`
   - Password: `password123`
   - Name: `Test User`
   - Address: `123 Test St, Test City`
   - Phone: `0412345678`
3. Click "Register"
4. You should be redirected to the login page

### Test 2: Admin Setup

**Create an Admin User** (using database directly):

```bash
npm run dev
```

While the server is running, in another terminal:

```bash
# Open Prisma Studio to manage database
npx prisma studio
```

1. Go to http://localhost:5555
2. Click on "User" table
3. Find your test user
4. Change the `role` field from `USER` to `ADMIN`
5. Save

### Test 3: Configure Payment Settings (Admin)

1. Login as admin at http://localhost:3000/login
2. Go to http://localhost:3000/admin/settings
3. Fill in the settings:
   - **Owner Email**: Your email (for notifications)
   - **Bank Name**: `Test Bank`
   - **Account Number**: `123456789`
   - **Account Holder**: `Business Name`
   - **Payment Instructions**: `Please transfer the amount and include the order reference.`
4. Click "Save Settings"

### Test 4: Add Products (Admin)

1. Go to http://localhost:3000/admin/products
2. You should see sample products from the seed script
3. Add a new product:
   - Name: `Test Product`
   - Description: `A test product for testing`
   - Price: `99.99`
   - Stock: `10`
   - Image URL: Any image URL or leave blank
   - Type: Select `Electronics` or `Clothing`
4. Click "Create Product"

### Test 5: Customer Purchase Flow

**Logout and login as a regular user:**

1. Logout from admin
2. Login as the test user you created
3. Go to http://localhost:3000
4. Browse products
5. Click on a product to view details
6. Click "Add to Cart"
7. Go to http://localhost:3000/cart
8. Add an order note: `Please deliver between 9am-5pm`
9. Click "Checkout"

**Expected Result:**
- Order is created
- You're redirected to payment page showing bank details
- **Email sent to customer** with order confirmation
- **Email sent to owner** with order notification

### Test 6: View Order in Admin Panel

1. Logout and login as admin
2. Go to http://localhost:3000/admin/orders
3. You should see the new order
4. Check that the order note appears
5. Verify customer details (address, phone)

### Test 7: Test Out-of-Stock Product

1. As admin, go to http://localhost:3000/admin/products
2. Create or edit a product
3. Check "Out of Stock"
4. Add a note: `Available again on December 1st`
5. Save

**As customer:**
1. Browse to that product
2. You should see a red "Out of Stock" badge
3. The "Add to Cart" button should be disabled
4. The out-of-stock note should be visible

### Test 8: Daily Email Summary

The daily summary is scheduled for 22:00 (10 PM) automatically. To test immediately:

**Option 1: Wait until 22:00**
- The cron job will run automatically
- Owner email will receive summary of today's orders

**Option 2: Manually Trigger** (for testing)

Create a test API route:

```typescript
// src/app/api/test-email/route.ts
import { triggerDailySummary } from '@/lib/cron'

export async function GET() {
  await triggerDailySummary()
  return Response.json({ message: 'Daily summary triggered' })
}
```

Then visit: http://localhost:3000/api/test-email

---

## Email Testing Tips

### View Emails in Development

**Option 1: Use Real Email**
- Set owner email to your actual email address
- Emails will be sent to your inbox
- Check spam folder if not received

**Option 2: Resend Dashboard**
- Login to https://resend.com
- Go to "Emails" section
- View all sent emails in the dashboard
- Preview email content

### Expected Emails

**Order Confirmation (to customer):**
- Subject: `Order Confirmation - #[orderID]`
- Contains: Order details, items, payment instructions

**Order Notification (to owner):**
- Subject: `New Order - #[orderID]`
- Contains: Customer info, order details

**Daily Summary (to owner):**
- Subject: `Daily Order Summary - [date]`
- Contains: All orders from today, total revenue

---

## Common Issues & Solutions

### Issue: "Missing API key" error

**Solution:**
```bash
# Make sure .env file has:
RESEND_API_KEY="re_your_actual_key"
```

Restart the dev server after adding the key.

### Issue: Emails not sending

**Check:**
1. Resend API key is valid
2. Owner email is configured in Admin Settings
3. Check Resend dashboard for error logs
4. Check terminal console for error messages

### Issue: Can't access admin panel

**Solution:**
1. Make sure user role is set to `ADMIN` in database
2. Use Prisma Studio: `npx prisma studio`
3. Update the user's role field

### Issue: Database is empty

**Solution:**
Run the seed script:
```bash
npx prisma db seed
```

This will create sample products with types.

---

## Testing Checklist

- [ ] User registration works
- [ ] User can login
- [ ] Admin settings can be configured
- [ ] Products can be created/viewed
- [ ] Shopping cart works
- [ ] Checkout creates order
- [ ] Payment page displays correctly
- [ ] Customer receives confirmation email
- [ ] Owner receives order notification
- [ ] Orders appear in admin panel
- [ ] Out-of-stock products show correctly
- [ ] Product types display properly
- [ ] Daily summary can be triggered (or wait for 22:00)

---

## Production Deployment Notes

When deploying to production:

1. **Verify Domain with Resend**
   - Add your domain in Resend dashboard
   - Update DNS records
   - Change `RESEND_FROM_EMAIL` to your domain email

2. **Environment Variables**
   - Set all environment variables in production
   - Use strong `NEXTAUTH_SECRET`
   - Update `NEXTAUTH_URL` to production URL

3. **Database**
   - Migrate to PostgreSQL or MySQL for production
   - Update `DATABASE_URL` in `.env`
   - Run migrations: `npx prisma migrate deploy`

4. **Cron Jobs**
   - If deploying to Vercel/Netlify (serverless):
     - Use external cron service (e.g., Vercel Cron, EasyCron)
     - Or create API route and trigger with external scheduler
   - If deploying to VPS/dedicated server:
     - Cron jobs will work as-is

---

## Quick Commands Reference

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Open Prisma Studio (database GUI)
npx prisma studio

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Seed database with sample data
npx prisma db seed

# Push schema changes to database
npx prisma db push

# Generate Prisma client
npx prisma generate
```

---

## Support

If you encounter any issues:

1. Check the terminal console for error messages
2. Check browser console for frontend errors
3. Review Resend dashboard for email delivery issues
4. Ensure all environment variables are set correctly

Happy testing! 🚀
