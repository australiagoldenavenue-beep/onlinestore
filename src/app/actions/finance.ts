'use server'

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const FinanceRecordSchema = z.object({
    amount: z.coerce.number(),
    description: z.string().optional(),
    orderCount: z.coerce.number().int().default(0),
    gstRate: z.coerce.number(), // 0 or 0.1
    date: z.string(), // YYYY-MM-DD
})

type FormState = { success?: boolean; error?: string };

export async function addFinanceRecord(prevState: FormState | null, formData: FormData): Promise<FormState> {
    const session = await auth()
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'OWNER')) {
        return { error: 'Unauthorized' }
    }

    const validatedFields = FinanceRecordSchema.safeParse({
        amount: formData.get('amount'),
        description: formData.get('description'),
        orderCount: formData.get('orderCount'),
        gstRate: formData.get('gstRate'),
        date: formData.get('date'),
    })

    if (!validatedFields.success) {
        return { error: "Invalid fields" }
    }

    const { amount, description, orderCount, gstRate, date } = validatedFields.data

    try {
        await prisma.financeRecord.create({
            data: {
                amount,
                description,
                orderCount,
                gstRate,
                date: new Date(date),
                type: 'INCOME', // Default to INCOME for now as per request
                category: 'Manual Entry'
            }
        })

        revalidatePath('/admin/finance')
        return { success: true }
    } catch (error) {
        console.error("Failed to add finance record:", error)
        return { error: "Failed to add record" }
    }
}

export async function deleteFinanceRecord(id: string) {
    const session = await auth()
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'OWNER')) {
        throw new Error('Unauthorized')
    }

    await prisma.financeRecord.delete({ where: { id } })
    revalidatePath('/admin/finance')
}
