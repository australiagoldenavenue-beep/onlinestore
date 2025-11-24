'use server'

import { prisma } from "@/lib/prisma"
import { sendVerificationCode } from "@/lib/email"
import bcrypt from "bcryptjs"
import { redirect } from "next/navigation"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function requestPasswordReset(prevState: any, formData: FormData) {
    const email = formData.get('email') as string

    if (!email) {
        return { error: "Email is required" }
    }

    try {
        const user = await prisma.user.findUnique({ where: { email } })

        // Always return success to prevent email enumeration, but only send if user exists
        if (user) {
            // Generate 6 digit code
            const code = Math.floor(100000 + Math.random() * 900000).toString()
            const expiresAt = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes

            // Save code
            await prisma.verificationCode.create({
                data: {
                    email,
                    code,
                    expiresAt
                }
            })

            // Send email
            await sendVerificationCode(email, code)
        }

        return { success: true, message: "If an account exists with this email, a verification code has been sent." }
    } catch (error) {
        console.error("Reset password error:", error)
        return { error: "Something went wrong. Please try again." }
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function verifyAndResetPassword(prevState: any, formData: FormData) {
    const email = formData.get('email') as string
    const code = formData.get('code') as string
    const newPassword = formData.get('newPassword') as string

    if (!email || !code || !newPassword) {
        return { error: "All fields are required" }
    }

    try {
        // Verify code
        const verificationRecord = await prisma.verificationCode.findFirst({
            where: {
                email,
                code,
                expiresAt: { gt: new Date() }
            },
            orderBy: { createdAt: 'desc' }
        })

        if (!verificationRecord) {
            return { error: "Invalid or expired verification code" }
        }

        // Update password
        const hashedPassword = await bcrypt.hash(newPassword, 10)
        await prisma.user.update({
            where: { email },
            data: { password: hashedPassword }
        })

        // Delete used codes
        await prisma.verificationCode.deleteMany({
            where: { email }
        })

    } catch (error) {
        console.error("Verify reset error:", error)
        return { error: "Failed to reset password" }
    }

    redirect('/login?reset=success')
}
