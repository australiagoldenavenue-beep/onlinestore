'use server'
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { sendOrderConfirmation, sendOrderNotification } from "@/lib/email"

export async function checkout(items: { id: string, quantity: number, price: number }[], note?: string) {
    const session = await auth()
    if (!session?.user) {
        redirect('/login')
    }

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

    const order = await prisma.order.create({
        data: {
            userId: session.user.id,
            total,
            status: 'PENDING',
            note,
            items: {
                create: items.map(item => ({
                    productId: item.id,
                    quantity: item.quantity,
                    price: item.price,
                })),
            },
        },
    })

    // Send emails asynchronously (don't wait for them to complete)
    sendOrderConfirmation(order.id).catch(console.error)
    sendOrderNotification(order.id).catch(console.error)

    return { orderId: order.id }
}
