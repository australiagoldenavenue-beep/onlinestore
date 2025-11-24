'use server'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Providers from '@/components/Providers';
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { z } from "zod"
import { redirect } from "next/navigation"

const RegisterSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().min(1),
    address: z.string().min(1),
    phoneNumber: z.string().min(1),
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function sendMessage(prevState: any, formData: FormData) {
    const validatedFields = RegisterSchema.safeParse({
        email: formData.get('email'),
        password: formData.get('password'),
        name: formData.get('name'),
        address: formData.get('address'),
        phoneNumber: formData.get('phoneNumber'),
    })

    if (!validatedFields.success) {
        return { error: "Invalid fields" }
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

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const session = await auth()
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
    } catch (error) {
        return { error: "Something went wrong" }
    }

    redirect('/login')
}

import { signIn, signOut } from "@/auth"
import { AuthError } from "next-auth"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function authenticate(prevState: any, formData: FormData) {
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function Navbar() {
    await signOut()
}
