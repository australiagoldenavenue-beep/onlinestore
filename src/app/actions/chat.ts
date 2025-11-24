'use server'
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const MessageSchema = z.object({
    content: z.string().min(1),
})

export async function sendMessage(prevState: unknown, formData: FormData) {
    const session = await auth()
    if (!session?.user) return { error: "Not logged in" }

    const validatedFields = MessageSchema.safeParse({
        content: formData.get('content'),
    })

    if (!validatedFields.success) {
        return { error: "Invalid message" }
    }

    // Get or create community chat
    // Use title for lookup to be safe with potential schema caching issues
    let chat = await prisma.chat.findFirst({
        where: { title: "Community Chat" }
    })

    if (!chat) {
        chat = await prisma.chat.create({
            data: {
                userId: session.user.id,
                title: "Community Chat",
                isCommunity: true
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

    // Cleanup messages older than 7 days
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    try {
        await prisma.message.deleteMany({
            where: {
                createdAt: {
                    lt: sevenDaysAgo
                }
            }
        })
    } catch (error) {
        console.error("Failed to cleanup old messages:", error)
    }

    const chat = await prisma.chat.findFirst({
        where: { title: "Community Chat" },
        include: {
            messages: {
                orderBy: { createdAt: 'asc' },
                include: {
                    user: {
                        select: { name: true }
                    }
                }
            }
        }
    })

    return chat?.messages || []
}

export async function deleteMessage(messageId: string) {
    const session = await auth()
    if (!session?.user || (session.user.role !== 'OWNER' && session.user.role !== 'MANAGER')) {
        throw new Error('Unauthorized')
    }

    await prisma.message.delete({
        where: { id: messageId }
    })

    revalidatePath('/chat')
}
