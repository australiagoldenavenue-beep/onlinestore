'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const UpdateProfileSchema = z.object({
    userId: z.string(),
    hourlyRate: z.coerce.number().min(0),
})

const UpdateScheduleSchema = z.object({
    staffProfileId: z.string(),
    dayOfWeek: z.number().min(0).max(6),
    startTime: z.string(),
    endTime: z.string(),
    isEnabled: z.boolean(),
})

export async function updateStaffProfile(formData: FormData) {
    const userId = formData.get('userId') as string
    const hourlyRate = formData.get('hourlyRate')

    const result = UpdateProfileSchema.safeParse({ userId, hourlyRate })
    if (!result.success) {
        return { error: "Invalid input" }
    }

    try {
        await prisma.staffProfile.upsert({
            where: { userId: result.data.userId },
            create: { userId: result.data.userId, hourlyRate: result.data.hourlyRate },
            update: { hourlyRate: result.data.hourlyRate },
        })
        // Revalidate both the staff list and the individual staff page
        revalidatePath('/admin/staff')
        revalidatePath(`/admin/staff/${userId}`)
        return { success: true }
    } catch (error) {
        console.error(error)
        return { error: "Failed to update profile" }
    }
}

export async function updateStaffSchedule(data: {
    staffProfileId: string
    dayOfWeek: number
    startTime: string
    endTime: string
    isEnabled: boolean
}) {
    const result = UpdateScheduleSchema.safeParse(data)
    if (!result.success) {
        return { error: "Invalid input" }
    }

    try {
        await prisma.staffSchedule.upsert({
            where: {
                staffProfileId_dayOfWeek: {
                    staffProfileId: data.staffProfileId,
                    dayOfWeek: data.dayOfWeek
                }
            },
            create: { ...data },
            update: { ...data }
        })
        revalidatePath(`/admin/staff`)
        return { success: true }
    } catch (error) {
        console.error(error)
        return { error: "Failed to update schedule" }
    }
}
