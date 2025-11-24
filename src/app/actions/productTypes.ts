'use server'
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

import { writeFile } from 'fs/promises'
import path from 'path'

const ProductTypeSchema = z.object({
    name: z.string().min(1),
    imageUrl: z.string().optional(),
})

type FormState = { success?: boolean; error?: string };

import { auth } from "@/auth"

export async function createProductType(prevState: FormState | null, formData: FormData): Promise<FormState> {
    const session = await auth()
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'STAFF' && session.user.role !== 'OWNER')) {
        return { error: 'Unauthorized' }
    }

    const imageFile = formData.get('image') as File | null
    let imageUrl = ''

    if (imageFile && imageFile.size > 0) {
        const buffer = Buffer.from(await imageFile.arrayBuffer())
        const filename = Date.now() + '_' + imageFile.name.replaceAll(' ', '_')
        const uploadDir = path.join(process.cwd(), 'public/uploads')

        try {
            await writeFile(path.join(uploadDir, filename), buffer)
            imageUrl = `/uploads/${filename}`
        } catch (error) {
            console.error('Error uploading file:', error)
            return { error: "Failed to upload image" }
        }
    }

    const validatedFields = ProductTypeSchema.safeParse({
        name: formData.get('name'),
        imageUrl: imageUrl,
    })

    if (!validatedFields.success) {
        return { error: "Invalid fields" }
    }

    try {
        await prisma.productType.create({
            data: validatedFields.data,
        })
    } catch {
        return { error: "Type already exists or other error" }
    }

    revalidatePath('/admin/types')
    revalidatePath('/admin/products')
    return { success: true }
}

export async function deleteProductType(id: string) {
    const session = await auth()
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'STAFF' && session.user.role !== 'OWNER')) {
        throw new Error('Unauthorized')
    }

    try {
        await prisma.productType.delete({
            where: { id },
        })
        revalidatePath('/admin/types')
        revalidatePath('/admin/products')
    } catch (e) {
        console.error("Failed to delete type", e)
    }
}
