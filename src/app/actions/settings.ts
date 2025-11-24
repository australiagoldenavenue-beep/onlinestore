'use server'
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"



type FormState = { success?: boolean; message?: string; error?: string };

export async function updateSettings(prevState: FormState | null, formData: FormData): Promise<FormState> {
    const session = await auth()
    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'OWNER' && session.user.role !== 'MANAGER')) {
        return { error: 'Unauthorized' }
    }

    console.log('Updating settings with data:', Object.fromEntries(formData))

    const keys = ['ownerEmail', 'bankName', 'accountNumber', 'accountHolder', 'paymentInstructions', 'alertMessage', 'businessName', 'businessAddress', 'openingHours', 'backgroundImageUrl']

    try {
        for (const key of keys) {
            const value = formData.get(key) as string
            // Allow saving empty strings to clear settings
            if (value !== null) {
                await prisma.settings.upsert({
                    where: { key },
                    update: { value },
                    create: { key, value }
                })
            }
        }

        revalidatePath('/admin/settings')
        revalidatePath('/')
        return { success: true, message: 'Settings updated successfully' }
    } catch {
        return { error: 'Failed to update settings' }
    }
}
