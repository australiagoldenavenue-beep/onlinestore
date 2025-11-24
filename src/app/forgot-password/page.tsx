'use client'

import { useActionState } from 'react'
import { requestPasswordReset } from '@/app/actions/auth-reset'
import styles from './forgot-password.module.css'
import Link from 'next/link'

export default function ForgotPasswordPage() {
    const [state, formAction, isPending] = useActionState(requestPasswordReset, null)

    return (
        <div className={styles.container}>
            <div className={styles.formCard}>
                <h1 className={styles.title}>Reset Password</h1>

                {state?.success ? (
                    <div className={styles.success}>
                        <p>{state.message}</p>
                        <Link href="/forgot-password/verify" className={styles.button} style={{ display: 'block', marginTop: '1rem', textDecoration: 'none' }}>
                            Enter Verification Code
                        </Link>
                    </div>
                ) : (
                    <form action={formAction}>
                        {state?.error && <p className={styles.error}>{state.error}</p>}
                        <div className={styles.formGroup}>
                            <label htmlFor="email" className={styles.label}>Email</label>
                            <input type="email" id="email" name="email" required className={styles.input} placeholder="Enter your email" />
                        </div>
                        <button type="submit" className={styles.button} disabled={isPending}>
                            {isPending ? 'Sending...' : 'Send Verification Code'}
                        </button>
                    </form>
                )}

                <Link href="/login" className={styles.link}>
                    Back to Login
                </Link>
            </div>
        </div>
    )
}
