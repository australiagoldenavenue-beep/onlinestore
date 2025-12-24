# Free Deployment Guide (Vercel)

You want to use your **own domain** (`universa.com.au`) and pay **$0**.
**Vercel** is the best choice because their "Hobby" plan is 100% free forever for personal projects and allows custom domains for free.

## Why is it free?
Vercel offers a generous "Hobby" tier. Unless you have millions of visitors or commercial enterprise needs, you will likely never hit the limits.

---

## 5-Minute Setup Guide

### 1. Sign Up (Free)
1.  Go to [vercel.com/signup](https://vercel.com/signup).
2.  Choose **"Continue with GitHub"**.
3.  Authorize Vercel to access your GitHub account.

### 2. Connect Your Repo
1.  Once logged in, you will see your Dashboard.
2.  Click **"Add New..."** -> **"Project"**.
3.  You will see `onlinestore` in the list (imported from GitHub).
4.  Click **Import**.

### 3. Setup Config (Copy/Paste)
The screen will ask for "Environment Variables". You **MUST** paste your keys here for the site to work. open your local `.env` file and copy these values:

| Name | Value Example |
| :--- | :--- |
| `DATABASE_URL` | `postgresql://postgres...:6543/postgres?pgbouncer=true` |
| `DIRECT_URL` | `postgresql://postgres...:5432/postgres` |
| `NEXTAUTH_SECRET` | (Your secret string) |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://siufhcsqvhheoameqsxp.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | (Your public key) |
| `RESEND_API_KEY` | (Your Resend key) |
| `NEXTAUTH_URL` | `https://universa.com.au` |

Click **Deploy**.

### 4. Connect Your Domain (Free)
1.  Wait for the deployment to finish (Green "Congratulations!" screen).
2.  Click **"Continue to Dashboard"**.
3.  Go to the **Settings** tab (top right).
4.  Click **Domains** (left sidebar).
5.  Type `universa.com.au` and click **Add**.
6.  Select the option recommended (usually "Add to...").

### 5. Final Step: DNS (The Connection)
Vercel will show you some numbers/text (DNS Records). You need to tell the internet that `universa.com.au` lives on Vercel.

1.  Log in to where you bought your domain (e.g., GoDaddy, Namecheap, CrazyDomains).
2.  Find **DNS Management** or **DNS Records**.
3.  **Delete** any existing "A Records" or "CNAME" records for `www` or `@`.
4.  **Add** the records Vercel gives you:
    *   **Type**: `A` | **Host**: `@` | **Value**: `76.76.21.21`
    *   **Type**: `CNAME` | **Host**: `www` | **Value**: `cname.vercel-dns.com`

**Wait up to 1 hour.**
Your site will be live at `https://universa.com.au` for free!
