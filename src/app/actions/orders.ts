'use server'
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

import { auth } from "@/auth"

export async function updateOrderStatus(id: string, status: string) {
    const session = await auth()
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'OWNER' && session.user.role !== 'MANAGER')) {
        throw new Error('Unauthorized')
    }
    await prisma.order.update({
        where: { id },
        data: { status },
    })
    revalidatePath('/admin/orders')
}

export async function updateOrderType(id: string, orderType: string) {
    const session = await auth()
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'OWNER' && session.user.role !== 'MANAGER')) {
        throw new Error('Unauthorized')
    }
    await prisma.order.update({
        where: { id },
        data: { orderType },
    })
    revalidatePath('/admin/orders')
}

