import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { revalidatePath } from 'next/cache'

export async function POST(request: NextRequest) {
    try {
        const session = await auth()

        // Only ADMIN and OWNER can update staff info
        if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'OWNER')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
        }

        const body = await request.json()
        const { userId, phoneNumber, address, tfn, bankAccount, passportNumber, visaType } = body

        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
        }

        // Upsert staff profile with new information
        await prisma.staffProfile.upsert({
            where: { userId },
            create: {
                userId,
                phoneNumber: phoneNumber || null,
                address: address || null,
                tfn: tfn || null,
                bankAccount: bankAccount || null,
                passportNumber: passportNumber || null,
                visaType: visaType || null,
            },
            update: {
                phoneNumber: phoneNumber || null,
                address: address || null,
                tfn: tfn || null,
                bankAccount: bankAccount || null,
                passportNumber: passportNumber || null,
                visaType: visaType || null,
            }
        })

        // Revalidate the staff pages
        revalidatePath('/admin/staff')
        revalidatePath(`/admin/staff/${userId}`)

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error updating staff info:', error)
        return NextResponse.json({ error: 'Failed to update staff information' }, { status: 500 })
    }
}
