'use server'
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const ProductSchema = z.object({
    name: z.string().min(1),
    description: z.string(),
    price: z.coerce.number().min(0),
    stock: z.coerce.number().int().min(0),
    imageUrl: z.string().optional(),
    typeId: z.string().optional(),
    isOutOfStock: z.coerce.boolean(),
    outOfStockNote: z.string().optional(),
})

type FormState = { success?: boolean; error?: string };

import { writeFile } from 'fs/promises'
import path from 'path'

import { auth } from "@/auth"

export async function createProduct(prevState: FormState | null, formData: FormData): Promise<FormState> {
    const session = await auth()
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'STAFF' && session.user.role !== 'OWNER')) {
        return { error: 'Unauthorized' }
    }

    const imageFile = formData.get('image') as File | null
    let imageUrl = ''

    if (imageFile && imageFile.size > 0) {
        // Limit image size to 5MB to prevent memory issues
        if (imageFile.size > 5 * 1024 * 1024) {
            return { error: "Image size too large (max 5MB)" }
        }

        const buffer = Buffer.from(await imageFile.arrayBuffer())
        const filename = Date.now() + '_' + imageFile.name.replaceAll(' ', '_')
        const uploadDir = path.join(process.cwd(), 'public/uploads')

        // Ensure directory exists (optional, but good practice if not guaranteed)
        // For now assuming public/uploads exists or we create it manually once.
        // Actually, let's try to write.

        try {
            await writeFile(path.join(uploadDir, filename), buffer)
            imageUrl = `/uploads/${filename}`
        } catch (error) {
            console.error('Error uploading file:', error)
            return { error: "Failed to upload image" }
        }
    }

    const validatedFields = ProductSchema.safeParse({
        name: formData.get('name'),
        description: formData.get('description'),
        price: formData.get('price'),
        stock: formData.get('stock'),
        imageUrl: imageUrl,
        typeId: formData.get('typeId'),
        isOutOfStock: formData.get('isOutOfStock') === 'on',
        outOfStockNote: formData.get('outOfStockNote'),
    })

    if (!validatedFields.success) {
        return { error: "Invalid fields" }
    }

    await prisma.product.create({
        data: validatedFields.data,
    })

    revalidatePath('/admin/products')
    return { success: true }
}

export async function deleteProduct(id: string) {
    const session = await auth()
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'STAFF' && session.user.role !== 'OWNER')) {
        throw new Error('Unauthorized')
    }

    await prisma.product.delete({
        where: { id },
    })
    revalidatePath('/admin/products')
}
