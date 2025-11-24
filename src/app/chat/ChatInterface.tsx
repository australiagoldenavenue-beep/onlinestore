'use client'
import { useActionState } from 'react'
import { sendMessage } from '../actions/chat'
import styles from './chat.module.css'

type Message = {
    id: string;
    content: string;
    createdAt: string;
};

export default function ChatInterface({ initialMessages }: { initialMessages: Message[] }) {
    const [state, formAction, isPending] = useActionState(sendMessage, null)

    return (
        <div className={styles.chatContainer}>
            <div className={styles.messagesContainer}>
                {initialMessages.length > 0 ? (
                    initialMessages.map((message) => (
                        <div key={message.id} className={styles.message}>
                            <div className={styles.messageHeader}>
                                <strong>You</strong>
                                <span className={styles.timestamp}>
                                    {new Date(message.createdAt).toLocaleString()}
                                </span>
                            </div>
                            <p className={styles.messageContent}>{message.content}</p>
                        </div>
                    ))
                ) : (
                    <p className={styles.noMessages}>No messages yet. Start a conversation!</p>
                )}
            </div>

            <form action={formAction} className={styles.messageForm}>
                {state?.error && <p className={styles.error}>{state.error}</p>}
                <div className={styles.inputContainer}>
                    <textarea
                        name="content"
                        placeholder="Type your message..."
                        required
                        className={styles.messageInput}
                        rows={3}
                    />
                    <button
                        type="submit"
                        disabled={isPending}
                        className={styles.sendButton}
                    >
                        {isPending ? 'Sending...' : 'Send'}
                    </button>
                </div>
            </form>
        </div>
    )
}
