import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { getMessages } from "../actions/chat"
import ChatInterface from "./ChatInterface"
import styles from './page.module.css'

export const dynamic = 'force-dynamic'

export default async function ChatPage() {
    const session = await auth()

    if (!session) {
        redirect('/login')
    }

    const messages = await getMessages()
    const serializedMessages = messages.map((m) => ({
        ...m,
        createdAt: m.createdAt.toISOString()
    }))

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Chat</h1>
                <p className={styles.subtitle}>Welcome to the chat! Send messages to communicate with our team.</p>
            </div>
            <ChatInterface initialMessages={serializedMessages} />
        </div>
    )
}
