# Real Payment Integration Guide 💳➡️🏦

## Current Status ⚠️

**IMPORTANT**: Your system currently uses a **DEMO/SIMULATION** payment system. When customers enter their card details:
- ✅ The order status changes to "PAID" in the database
- ❌ **NO real money is charged from the customer's card**
- ❌ **NO money goes to any bank account**

This is just for testing and development purposes.

---

## How to Accept Real Card Payments & Receive Money

To actually charge customers' cards and receive money in your business bank account, you need to integrate a **Payment Service Provider (PSP)**. Here are your options:

### 🌟 Recommended: Stripe (Most Popular)

**Why Stripe?**
- Easy integration with Next.js
- Supports 135+ currencies
- Money automatically transfers to your bank account
- Strong fraud protection
- Excellent documentation
- Used by millions of businesses worldwide

**Setup Process:**

#### 1. Create a Stripe Account
1. Go to https://stripe.com
2. Click "Start now" to create an account
3. Provide your business information
4. **Connect your bank account** (this is where money will be deposited)
5. Complete identity verification

#### 2. Install Stripe in Your Project
```bash
npm install stripe @stripe/stripe-js
```

#### 3. Get Your API Keys
1. Log into Stripe Dashboard
2. Go to Developers → API keys
3. Copy your **Publishable key** and **Secret key**
4. Add to your `.env.local` file:
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

#### 4. Implement Stripe Payment

**Replace** `/src/app/actions/payment.ts` with:

```typescript
'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2024-11-20.acacia'
})

export async function createPaymentIntent(orderId: string, amount: number) {
    try {
        // Create a payment intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Convert to cents
            currency: 'aud', // Change to your currency (usd, eur, etc.)
            metadata: {
                orderId: orderId
            }
        })

        return { 
            success: true, 
            clientSecret: paymentIntent.client_secret 
        }
    } catch (error) {
        console.error('Payment intent creation error:', error)
        return { error: 'Failed to initialize payment' }
    }
}

export async function confirmPayment(orderId: string, paymentIntentId: string) {
    try {
        // Verify payment was successful
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
        
        if (paymentIntent.status === 'succeeded') {
            // Update order status
            await prisma.order.update({
                where: { id: orderId },
                data: { 
                    status: 'PAID',
                    paymentIntentId: paymentIntentId // Store for reference
                }
            })

            revalidatePath(`/payment/${orderId}`)
            return { success: true }
        } else {
            return { error: 'Payment not completed' }
        }
    } catch (error) {
        console.error('Payment confirmation error:', error)
        return { error: 'Payment verification failed' }
    }
}
```

#### 5. Update Payment Page

Update `/src/app/payment/[orderId]/page.tsx` to use Stripe Elements:

```typescript
'use client'

import { useState, useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { createPaymentIntent, confirmPayment } from '@/app/actions/payment'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

function PaymentForm({ orderId, amount }: { orderId: string, amount: number }) {
    const stripe = useStripe()
    const elements = useElements()
    const [isProcessing, setIsProcessing] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        if (!stripe || !elements) return
        
        setIsProcessing(true)
        setError('')

        try {
            // Step 1: Create payment intent on server
            const intentResult = await createPaymentIntent(orderId, amount)
            
            if (!intentResult.success || !intentResult.clientSecret) {
                setError(intentResult.error || 'Payment initialization failed')
                return
            }

            // Step 2: Confirm card payment with Stripe
            const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
                intentResult.clientSecret,
                {
                    payment_method: {
                        card: elements.getElement(CardElement)!,
                    }
                }
            )

            if (stripeError) {
                setError(stripeError.message || 'Payment failed')
            } else if (paymentIntent.status === 'succeeded') {
                // Step 3: Update order in database
                await confirmPayment(orderId, paymentIntent.id)
                setSuccess(true)
            }
        } catch (err) {
            setError('An unexpected error occurred')
        } finally {
            setIsProcessing(false)
        }
    }

    if (success) {
        return <div>✅ Payment Successful! Redirecting...</div>
    }

    return (
        <form onSubmit={handleSubmit}>
            <CardElement />
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <button type="submit" disabled={!stripe || isProcessing}>
                {isProcessing ? 'Processing...' : `Pay $${amount.toFixed(2)}`}
            </button>
        </form>
    )
}

export default function PaymentPage({ params }: { params: Promise<{ orderId: string }> }) {
    // Fetch order details and render PaymentForm wrapped in Elements provider
    return (
        <Elements stripe={stripePromise}>
            <PaymentForm orderId={orderId} amount={orderTotal} />
        </Elements>
    )
}
```

#### 6. Add Payment Intent ID to Database Schema

Update `prisma/schema.prisma`:

```prisma
model Order {
  id              String   @id @default(cuid())
  userId          String
  total           Float
  status          String   @default("PENDING")
  paymentIntentId String?  // Add this line
  createdAt       DateTime @default(now())
  // ... rest of fields
}
```

Then run:
```bash
npx prisma migrate dev --name add_payment_intent_id
```

---

### 💰 How Money Flows with Stripe

1. **Customer enters card details** → Stripe securely processes the card
2. **Stripe charges the customer's card** → Customer sees charge immediately
3. **Stripe holds the money** → For 2-7 days (fraud protection)
4. **Stripe transfers to your bank account** → Automatic deposits (daily, weekly, or monthly)
5. **You receive money** → Money appears in the bank account you connected

**Stripe Fees**: ~2.9% + $0.30 per transaction (varies by country)

---

### 🌐 Alternative Payment Providers

#### PayPal
- **Pros**: Widely trusted, easy for customers who have PayPal accounts
- **Cons**: Higher fees (~3.5% + $0.30), more chargebacks
- **Setup**: https://developer.paypal.com

#### Square
- **Pros**: Great for retail + online, flat fee structure
- **Cons**: Mainly US/Canada/Australia focused
- **Setup**: https://developer.squareup.com

#### Adyen
- **Pros**: Enterprise-grade, global coverage
- **Cons**: Complex setup, higher minimums
- **Setup**: https://www.adyen.com

---

### 🏦 Bank Transfer Option (Already Implemented!)

Your system already supports bank transfers! This requires NO integration fees:

1. Customer sees your bank account details
2. Customer manually transfers money
3. You receive money in your bank account (1-2 business days)
4. You manually update order status to "PAID" in the admin panel

**To enable**: Go to Admin → Settings → Payment Account Details and add your bank details.

---

## Quick Start Recommendation

For most businesses, we recommend starting with **Stripe**:

1. ✅ Sign up at https://stripe.com
2. ✅ Connect your bank account
3. ✅ Use **Test Mode** first (test cards, no real money)
4. ✅ Implement the code above
5. ✅ Test with Stripe test card: `4242 4242 4242 4242`
6. ✅ When ready, switch to **Live Mode** (real money!)

---

## Testing

### Stripe Test Cards (Test Mode Only):
- **Success**: `4242 4242 4242 4242`
- **Declined**: `4000 0000 0000 0002`
- **Requires 3D Secure**: `4000 0025 0000 3155`
- **Use any future expiry date and any 3-digit CVC**

---

## Security Notes

⚠️ **CRITICAL**:
- Never store raw card numbers in your database
- Always use HTTPS in production
- Use Stripe's secure card elements (they handle PCI compliance)
- Keep your `STRIPE_SECRET_KEY` secret (never commit to Git)
- Use environment variables for all API keys

---

## Support

**Stripe Documentation**: https://stripe.com/docs
**Stripe Support**: Available 24/7 via dashboard chat

---

## Summary

**Current State**: Demo only, no real money
**To Accept Real Payments**: 
1. Sign up for Stripe
2. Connect your bank account to Stripe
3. Install and integrate Stripe SDK
4. Money will automatically flow: Customer Card → Stripe → Your Bank Account

**Timeline**: 
- Stripe signup: 15 minutes
- Integration: 2-3 hours (if following this guide)
- First payout: 7-14 days after first payment (initial verification period)
- Regular payouts: 2-7 days after payment

Would you like me to help you implement the Stripe integration?
