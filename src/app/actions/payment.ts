'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function processPayment(orderId: string, _paymentDetails: unknown) {
    try {
        // Simulate payment processing delay
        await new Promise(resolve => setTimeout(resolve, 2000))

        // Simulate random success/failure (mostly success for demo)
        // In a real app, verify card details with Stripe/etc.
        const isSuccess = true

        if (isSuccess) {
            await prisma.order.update({
                where: { id: orderId },
                data: { status: 'PAID' }
            })

            revalidatePath(`/payment/${orderId}`)
            return { success: true }
        } else {
            return { error: 'Payment declined. Please try again.' }
        }
    } catch (error) {
        console.error('Payment processing error:', error)
        return { error: 'System error processing payment.' }
    }
}
