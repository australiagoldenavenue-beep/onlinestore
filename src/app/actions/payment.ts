'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    apiVersion: '2024-11-20.acacia' as any // Cast to any to avoid type issues if version mismatch
})

export async function createPaymentIntent(orderId: string, amount: number) {
    try {
        // Create a payment intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Convert to cents
            currency: 'aud',
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
                    paymentIntentId: paymentIntentId,
                    paymentMethod: 'CARD'
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

export async function updatePaymentProof(orderId: string, proofUrl: string) {
    try {
        await prisma.order.update({
            where: { id: orderId },
            data: {
                paymentProofUrl: proofUrl,
                paymentMethod: 'BANK_TRANSFER'
            }
        })
        revalidatePath(`/payment/${orderId}`)
        return { success: true }
    } catch (error) {
        console.error('Error updating payment proof:', error)
        return { error: 'Failed to update payment proof' }
    }
}
