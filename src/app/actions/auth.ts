'use server'

import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { z } from "zod"
import { redirect } from "next/navigation"

const RegisterSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
    name: z.string().min(1),
    address: z.string().min(1),
    phoneNumber: z.string().min(1),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
})

export async function register(prevState: unknown, formData: FormData) {
    const validatedFields = RegisterSchema.safeParse({
        email: formData.get('email'),
        password: formData.get('password'),
        confirmPassword: formData.get('confirmPassword'),
        name: formData.get('name'),
        address: formData.get('address'),
        phoneNumber: formData.get('phoneNumber'),
    })

    if (!validatedFields.success) {
        return { error: validatedFields.error.flatten().fieldErrors.confirmPassword?.[0] || "Invalid fields" }
    }

    const { email, password, name, address, phoneNumber } = validatedFields.data

    try {
        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        })

        if (existingUser) {
            return { error: "Email already in use" }
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                address,
                phoneNumber,
                role: 'USER', // Default role
            },
        })
    } catch {
        return { error: "Something went wrong" }
    }

    redirect('/signin')
}

import { signIn, signOut } from "@/auth"
import { AuthError } from "next-auth"



export async function authenticate(prevState: unknown, formData: FormData) {
    try {
        await signIn('credentials', {
            ...Object.fromEntries(formData),
            redirectTo: '/products',
        })
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return { error: 'Invalid credentials.' }
                default:
                    return { error: 'Something went wrong.' }
            }
        }
        throw error
    }
}


export async function logout() {
    await signOut({ redirectTo: '/' })
}
