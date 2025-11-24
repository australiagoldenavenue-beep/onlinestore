# Resend Email Service Configuration

## Setup Instructions

1. **Sign up for Resend**
   - Go to https://resend.com
   - Create a free account

2. **Get your API Key**
   - In the Resend dashboard, go to API Keys
   - Create a new API key
   - Copy the key

3. **Add to .env file**
   ```
   RESEND_API_KEY="re_your_actual_api_key_here"
   RESEND_FROM_EMAIL="onboarding@resend.dev"
   ```

4. **For Production**
   - Verify your domain in Resend
   - Update `RESEND_FROM_EMAIL` to use your verified domain
   - Example: `RESEND_FROM_EMAIL="noreply@yourdomain.com"`

## Testing

- For development, you can use Resend's test email: `onboarding@resend.dev`
- Emails will be sent but marked as test emails
- For production, you must verify your domain

## Daily Summary Schedule

- The system sends a daily order summary email at 22:00 (10 PM) Australia/Sydney time
- To change the timezone, edit `src/lib/cron.ts` and update the `timezone` option
