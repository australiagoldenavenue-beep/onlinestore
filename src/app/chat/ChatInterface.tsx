'use client'
import { useActionState } from 'react'
import { sendMessage, deleteMessage } from '../actions/chat'
import styles from './chat.module.css'
import { useSession } from 'next-auth/react'

type Message = {
    id: string;
    content: string;
    createdAt: string;
    user?: { name: string | null };
};

export default function ChatInterface({ initialMessages }: { initialMessages: Message[] }) {
    const [state, formAction, isPending] = useActionState(sendMessage, null)
    const { data: session } = useSession()
    const isOwner = session?.user?.role === 'OWNER' || session?.user?.role === 'MANAGER'

    return (
        <div className={styles.chatContainer}>
            <div className={styles.messagesContainer}>
                {initialMessages.length > 0 ? (
                    initialMessages.map((message) => (
                        <div key={message.id} className={styles.message}>
                            <div className={styles.messageHeader}>
                                <strong>{message.user?.name || 'User'}</strong>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span className={styles.timestamp}>
                                        {new Date(message.createdAt).toLocaleString()}
                                    </span>
                                    {isOwner && (
                                        <button
                                            onClick={() => deleteMessage(message.id)}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                color: 'red',
                                                cursor: 'pointer',
                                                fontSize: '0.8rem',
                                                padding: '0 0.25rem'
                                            }}
                                            title="Delete Message"
                                        >
                                            ✕
                                        </button>
                                    )}
                                </div>
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
