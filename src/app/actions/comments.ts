'use server'
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const CommentSchema = z.object({
    content: z.string().min(1),
})

export async function addComment(productId: string, prevState: unknown, formData: FormData) {
    const session = await auth()
    if (!session?.user) return { error: "Not logged in" }

    const validatedFields = CommentSchema.safeParse({
        content: formData.get('content'),
    })

    if (!validatedFields.success) {
        return { error: "Invalid fields" }
    }

    await prisma.comment.create({
        data: {
            ...validatedFields.data,
            productId,
            userId: session.user.id,
        },
    })

    revalidatePath(`/products/${productId}`)
    return { success: true }
}

export async function deleteComment(commentId: string, productId: string) {
    const session = await auth()
    if (!session?.user || (session.user.role !== 'OWNER' && session.user.role !== 'MANAGER')) {
        throw new Error('Unauthorized')
    }

    await prisma.comment.delete({
        where: { id: commentId }
    })

    revalidatePath(`/products/${productId}`)
}
