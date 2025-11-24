'use client'

import { useEffect } from 'react'
import { useFormState, useFormStatus } from 'react-dom'
import { addComment } from '@/app/actions/comments'
import styles from './orders.module.css'

type ReviewModalProps = {
    productId: string
    productName: string
    isOpen: boolean
    onClose: () => void
}

const initialState = {
    error: '',
    success: false
}

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <button type="submit" className={styles.submitButton} disabled={pending}>
            {pending ? 'Submitting...' : 'Submit Review'}
        </button>
    )
}

export default function ReviewModal({ productId, productName, isOpen, onClose }: ReviewModalProps) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [state, formAction] = useFormState(addComment.bind(null, productId) as any, initialState)

    useEffect(() => {
        if (state?.success) {
            const timer = setTimeout(() => {
                onClose()
            }, 2000)
            return () => clearTimeout(timer)
        }
    }, [state, onClose])

    if (!isOpen) return null

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                    <h3 className={styles.modalTitle}>Review {productName}</h3>
                    <button onClick={onClose} className={styles.closeButton}>×</button>
                </div>

                {state?.success ? (
                    <div className={styles.successMessage}>
                        ✅ Review submitted successfully!
                    </div>
                ) : (
                    <form action={formAction} className={styles.reviewForm}>
                        <div className={styles.formGroup}>
                            <label htmlFor="content" className={styles.label}>Your Review</label>
                            <textarea
                                id="content"
                                name="content"
                                rows={4}
                                className={styles.textarea}
                                placeholder="Share your thoughts about this product..."
                                required
                            />
                        </div>
                        {state?.error && <div className={styles.errorMessage}>{state.error}</div>}
                        <div className={styles.modalActions}>
                            <button type="button" onClick={onClose} className={styles.cancelButton}>
                                Cancel
                            </button>
                            <SubmitButton />
                        </div>
                    </form>
                )}
            </div>
        </div>
    )
}
