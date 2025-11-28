# Publish System with Custom Domain Guide

This guide explains how to publish your online store using GitHub and Netlify, and connect it to your own custom domain.

## Prerequisites

1.  **GitHub Account**: You need an account at [github.com](https://github.com).
2.  **Netlify Account**: You need an account at [netlify.com](https://netlify.com).
3.  **Domain Name**: You must have purchased a domain name (e.g., `universa.com.au`) from a registrar (like GoDaddy, Namecheap, Google Domains, etc.).

---

## Step 1: Push Your Code to GitHub

1.  **Create a New Repository on GitHub**:
    *   Go to [github.com/new](https://github.com/new).
    *   Name your repository (e.g., `online-store`).
    *   Make it **Private** (recommended for your business code) or **Public**.
    *   Do **not** initialize with README, .gitignore, or License (you already have these).
    *   Click **Create repository**.

2.  **Push Your Code**:
    *   Copy the commands shown under "…or push an existing repository from the command line".
    *   They will look like this (replace `YOUR_USERNAME` with your actual GitHub username):

    ```bash
    git remote add origin https://github.com/YOUR_USERNAME/online-store.git
    git branch -M main
    git push -u origin main
    ```

    *   Run these commands in your terminal.

---

## Step 2: Connect to Netlify

1.  **Log in to Netlify**.
2.  Click **"Add new site"** > **"Import from existing project"**.
3.  Select **GitHub**.
4.  Authorize Netlify to access your GitHub account.
5.  Select the `online-store` repository you just created.
6.  **Configure Build Settings**:
    *   Netlify should automatically detect the settings from your `netlify.toml` file.
    *   **Build command**: `prisma generate && npm run build`
    *   **Publish directory**: `.next` (or left blank if using the plugin)
7.  **Environment Variables**:
    *   Click **"Show advanced"** or go to **Site Settings > Environment variables** after the site is created.
    *   You MUST add the following variables (copy them from your local `.env` file):
        *   `NEXTAUTH_SECRET`
        *   `NEXTAUTH_URL` (Set this to your Netlify URL initially, e.g., `https://your-site.netlify.app`. You will update this to your custom domain later.)
        *   `RESEND_API_KEY`
        *   `DATABASE_URL` (For now, use `file:./prisma/dev.db` if sticking with SQLite, but see the **Critical Database Warning** below).

8.  Click **Deploy Site**.

---

## Step 3: Configure Custom Domain

Once your site is deployed and running on a `netlify.app` subdomain:

1.  Go to **Site configuration** > **Domain management**.
2.  Click **"Add a domain"**.
3.  Enter your custom domain name (e.g., `universa.com.au`).
4.  Click **Verify**.
5.  Click **Add domain**.

---

## Step 4: Configure DNS (Point Domain to Netlify)

Netlify will show you DNS settings to configure. You have two options:

### Option A: Use Netlify DNS (Recommended)
1.  Click **"Set up Netlify DNS"**.
2.  Netlify will give you 4 nameservers (e.g., `dns1.p01.nsone.net`, etc.).
3.  Log in to your **Domain Registrar** (where you bought the domain).
4.  Find the **Nameservers** settings for your domain.
5.  Replace the existing nameservers with the 4 provided by Netlify.
6.  **Wait**: It can take up to 24-48 hours for changes to propagate, but often happens within minutes.

### Option B: Use External DNS (CNAME/A Record)
If you want to keep your DNS managed by your registrar:
1.  In Netlify, look for the required **A Record** (for root domain) and **CNAME Record** (for `www`).
2.  Log in to your Domain Registrar's DNS settings.
3.  Add/Update the **A Record** for `@` (root) to point to Netlify's load balancer IP (usually `75.2.60.5`).
4.  Add/Update the **CNAME Record** for `www` to point to your Netlify site URL (e.g., `your-site-name.netlify.app`).

---

## Step 5: Update Configuration

Once your domain is active (e.g., `https://universa.com.au` works):

1.  Go back to **Netlify Site Settings > Environment variables**.
2.  Update `NEXTAUTH_URL` to your new domain: `https://universa.com.au`.
3.  Trigger a new deployment (or wait for the next push) for changes to take effect.

---

## ⚠️ CRITICAL DATABASE WARNING

**You are currently using SQLite (`file:./prisma/dev.db`).**

*   **The Problem**: Netlify is a "serverless" platform. The file system is **read-only** and **temporary**.
*   **The Consequence**: Every time you deploy a new version of your site, **YOUR DATABASE WILL BE RESET**. All user accounts, orders, and products added *after* deployment will be lost.
*   **The Solution**: You **MUST** switch to a hosted PostgreSQL database for a real online store.
    *   Services like **Neon**, **Supabase**, or **Railway** offer free PostgreSQL databases.
    *   We have a guide for this: `SETUP_GUIDE_FREE_SQL.md`.
    *   **Action**: Before launching to real customers, follow the `SETUP_GUIDE_FREE_SQL.md` to migrate your database to the cloud.
