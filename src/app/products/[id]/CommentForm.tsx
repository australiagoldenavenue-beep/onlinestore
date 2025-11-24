'use client'
import { useActionState } from 'react'
import { addComment } from '@/app/actions/comments'
import styles from './product.module.css'

export default function CommentForm({ productId }: { productId: string }) {
    const [state, formAction, isPending] = useActionState(addComment.bind(null, productId), null)

    return (
        <form action={formAction} className={styles.commentForm}>
            {state?.error && <p className={styles.formError}>{state.error}</p>}
            <div className={styles.formGroup}>
                <label htmlFor="content" className={styles.formLabel}>Share your thoughts</label>
                <textarea
                    id="content"
                    name="content"
                    required
                    placeholder="Tell us what you think about this product..."
                    className={styles.commentInput}
                    rows={4}
                />
            </div>
            <button
                type="submit"
                disabled={isPending}
                className={styles.submitButton}
            >
                {isPending ? (
                    <>
                        <svg className={styles.spinner} width="20" height="20" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.25" />
                            <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" opacity="0.75" />
                        </svg>
                        Posting...
                    </>
                ) : (
                    <>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                        Post Review
                    </>
                )}
            </button>
        </form>
    )
}
