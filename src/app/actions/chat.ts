'use server'
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const MessageSchema = z.object({
    content: z.string().min(1),
})

export async function sendMessage(prevState: any, formData: FormData) {
    const session = await auth()
    if (!session?.user) return { error: "Not logged in" }

    const validatedFields = MessageSchema.safeParse({
        content: formData.get('content'),
    })

    if (!validatedFields.success) {
        return { error: "Invalid message" }
    }

    // Get or create chat for user
    let chat = await prisma.chat.findFirst({
        where: { userId: session.user.id }
    })

    if (!chat) {
        chat = await prisma.chat.create({
            data: {
                userId: session.user.id,
                title: "General Chat"
            }
        })
    }

    await prisma.message.create({
        data: {
            content: validatedFields.data.content,
            chatId: chat.id,
            userId: session.user.id,
        },
    })

    revalidatePath('/chat')
    return { success: true }
}

export async function getMessages() {
    const session = await auth()
    if (!session?.user) return []

    const chat = await prisma.chat.findFirst({
        where: { userId: session.user.id },
        include: {
            messages: {
                orderBy: { createdAt: 'asc' }
            }
        }
    })

    return chat?.messages || []
}
