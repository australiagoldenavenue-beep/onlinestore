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

export async function createProduct(prevState: FormState | null, formData: FormData): Promise<FormState> {
    const validatedFields = ProductSchema.safeParse({
        name: formData.get('name'),
        description: formData.get('description'),
        price: formData.get('price'),
        stock: formData.get('stock'),
        imageUrl: formData.get('imageUrl'),
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
    await prisma.product.delete({
        where: { id },
    })
    revalidatePath('/admin/products')
}
