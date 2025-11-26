# Resend Setup Guide for universa.com.au

## Current Configuration
Your system is already configured with:
- **API Key**: `re_LEMxU7o3_HoqvFANQHmHECx5AMQNXNhXT`
- **From Email**: `noreply@universa.com.au`
- **Domain**: `universa.com.au`

## Required Resend Account Setup Steps

### 1. Log into Resend
1. Go to [https://resend.com/login](https://resend.com/login)
2. Email: `australia.golden.avenue@gmail.com`
3. Password: `Jyzgg23ooooo`

### 2. Verify Your Domain (universa.com.au)

#### a) Add Domain in Resend
1. Navigate to **Domains** in the left sidebar
2. Click **Add Domain**
3. Enter: `universa.com.au`
4. Click **Add**

#### b) Add DNS Records
Resend will provide you with DNS records to add to your domain. You need to add these records to your domain registrar (where you registered universa.com.au):

**Required DNS Records:**
1. **TXT Record** (for domain verification)
   - Type: `TXT`
   - Name: `@` or `universa.com.au`
   - Value: (provided by Resend, something like `resend-verification=...`)

2. **MX Records** (for email receiving - optional but recommended)
   - Type: `MX`
   - Name: `@` or `universa.com.au`
   - Priority: `10`
   - Value: (provided by Resend)

3. **SPF Record** (TXT)
   - Type: `TXT`
   - Name: `@` or `universa.com.au`
   - Value: `v=spf1 include:_spf.resend.com ~all`

4. **DKIM Records** (CNAME)
   - Type: `CNAME`
   - Name: (provided by Resend, something like `resend._domainkey`)
   - Value: (provided by Resend)

5. **DMARC Record** (TXT - optional but recommended)
   - Type: `TXT`
   - Name: `_dmarc`
   - Value: `v=DMARC1; p=none; rua=mailto:australia.golden.avenue@gmail.com`

#### c) Verify Domain
1. After adding DNS records (wait 10-15 minutes for DNS propagation)
2. Go back to Resend dashboard
3. Click **Verify** next to your domain
4. If successful, you'll see a green checkmark ✓

### 3. Verify API Key is Active
1. Go to **API Keys** in Resend dashboard
2. Verify your API key `re_LEMxU7o3_HoqvFANQHmHECx5AMQNXNhXT` is listed and active
3. If not, create a new API key and update your `.env` file

### 4. Test Email Sending
Once domain is verified:
1. Use the password reset feature on your website
2. Check if emails are sent successfully
3. Monitor email delivery in Resend dashboard under **Logs**

## Email Features Currently Implemented

Your system sends emails for:
1. **Password Reset Verification Codes** - `sendVerificationCode(email, code)`
2. **Order Confirmation** - `sendOrderConfirmation(orderId)`
3. **Order Notifications to Owner** - `sendOrderNotification(orderId)`
4. **Daily Order Summaries** - `sendDailySummary()`

All emails will be sent from: `noreply@universa.com.au`

## Troubleshooting

### Domain Not Verified
- Wait 15-30 minutes after adding DNS records
- Use DNS checker tools to verify records are propagated
- Contact your domain registrar if issues persist

### Emails Not Sending
- Check Resend dashboard **Logs** for error messages
- Verify domain is verified (green checkmark)
- Check API key is active
- Review server logs for error messages

### Email Going to Spam
- Ensure all DNS records (SPF, DKIM, DMARC) are properly configured
- Warm up your domain by sending gradually increasing volume
- Avoid spam trigger words in subject lines and content

## Important Notes
- DNS propagation can take up to 48 hours (usually 10-30 minutes)
- You cannot send emails from a domain until it's verified
- Free Resend plan allows 100 emails/day, 3,000 emails/month
- Monitor your email quota in Resend dashboard

## Support
- Resend Documentation: https://resend.com/docs
- Resend Support: https://resend.com/support
