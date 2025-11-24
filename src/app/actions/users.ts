'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import bcrypt from "bcryptjs"

const CreateUserSchema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(6),
    role: z.enum(['USER', 'STAFF', 'ADMIN', 'MANAGER']),
})

const ChangePasswordSchema = z.object({
    userId: z.string(),
    newPassword: z.string().min(6),
})

type FormState = { success?: boolean; error?: string };

import { auth } from "@/auth"

export async function createUser(prevState: FormState | null, formData: FormData): Promise<FormState> {
    const session = await auth()
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'OWNER' && session.user.role !== 'MANAGER')) {
        return { error: 'Unauthorized' }
    }

    const validatedFields = CreateUserSchema.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password'),
        role: formData.get('role'),
    })

    if (!validatedFields.success) {
        return { error: "Invalid fields" }
    }

    const { email, password, name, role } = validatedFields.data

    // Admin Account Constraints
    if (role === 'ADMIN') {
        // Only Owner and Manager can create Admins
        if (session.user.role !== 'OWNER' && session.user.role !== 'MANAGER') {
            return { error: "Only Owner or Manager can create Admin accounts" }
        }

        // Limit to 2 Admins
        const adminCount = await prisma.user.count({ where: { role: 'ADMIN' } })
        if (adminCount >= 2) {
            return { error: "Maximum 2 Admin accounts allowed" }
        }
    }

    try {
        const existingUser = await prisma.user.findUnique({ where: { email } })
        if (existingUser) {
            return { error: "User already exists" }
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role,
            },
        })

        revalidatePath('/admin/users')
        return { success: true }
    } catch (error) {
        console.error("Failed to create user:", error)
        return { error: "Failed to create user" }
    }
}

export async function changePassword(prevState: FormState | null, formData: FormData): Promise<FormState> {
    const session = await auth()
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'OWNER' && session.user.role !== 'MANAGER')) {
        return { error: 'Unauthorized' }
    }

    const validatedFields = ChangePasswordSchema.safeParse({
        userId: formData.get('userId'),
        newPassword: formData.get('newPassword'),
    })

    if (!validatedFields.success) {
        return { error: "Invalid password (min 6 chars)" }
    }

    const { userId, newPassword } = validatedFields.data

    try {
        const targetUser = await prisma.user.findUnique({ where: { id: userId } })
        if (!targetUser) {
            return { error: "User not found" }
        }

        // Only Owner/Manager can change Admin password
        if (targetUser.role === 'ADMIN' && session.user.role !== 'OWNER' && session.user.role !== 'MANAGER') {
            return { error: "Only Owner or Manager can change Admin passwords" }
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10)

        await prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword },
        })

        revalidatePath('/admin/users')
        return { success: true }
    } catch (error) {
        console.error("Failed to update password:", error)
        return { error: "Failed to update password" }
    }
}

export async function deleteUser(formData: FormData) {
    const session = await auth()
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'OWNER' && session.user.role !== 'MANAGER')) {
        throw new Error('Unauthorized')
    }

    const id = formData.get('id') as string
    try {
        const targetUser = await prisma.user.findUnique({ where: { id } })
        if (!targetUser) return

        // Only Owner or Manager can delete Admin
        if (targetUser.role === 'ADMIN' && session.user.role !== 'OWNER' && session.user.role !== 'MANAGER') {
            throw new Error("Only Owner or Manager can delete Admin accounts")
        }

        await prisma.user.delete({ where: { id } })
        revalidatePath('/admin/users')
    } catch (error) {
        console.error("Failed to delete user:", error)
    }
}
