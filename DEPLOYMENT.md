# System Deployment

This repository contains the full source code for the Online Store system.
The system is built with **Next.js**, **Prisma**, **Supabase** (PostgreSQL), and **Stripe**.

## How to Run

Since this is a dynamic application (requires database, authentication, and payments), it cannot be hosted on static file hosts like classic GitHub Pages. It requires a Node.js server.

### Prerequisites
1.  **Node.js** (v18+)
2.  **PostgreSQL Database** (Supabase recommended)
3.  **Stripe Account**
4.  **Resend Account** (for emails)

### Environment Variables
You must configure the `.env` file with your credentials (see `.env.example`).

### Deployment Options

1.  **Container (Docker)**: Build the application as a Docker container and deploy it to any cloud provider supporting Docker (DigitalOcean, AWS ECS, Google Cloud Run, GitHub Container Registry).
2.  **VPS (Virtual Private Server)**: SSH into your server, clone this repo, run `npm install`, `npm run build`, and `npm start`. Use a process manager like PM2 to keep it running.
3.  **PaaS**: Deploy to Platform-as-a-Service providers like Railway, Render, or Heroku by connecting this GitHub repository.

## Custom Domain

To link `universa.com.au`:
1.  Deploy the running application to a server/service.
2.  Get the **IP Address** or **CNAME** of that server.
3.  Go to your Domain Registrar.
4.  Point your domain's A Record or CNAME to that server.

## Database

The system uses **Supabase**. Ensure your `DATABASE_URL` and `DIRECT_URL` are correctly set in your runner's environment variables.
