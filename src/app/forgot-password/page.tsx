'use client'

import { useActionState } from 'react'
import { requestPasswordReset } from '@/app/actions/auth-reset'
import styles from './forgot-password.module.css'
import Link from 'next/link'

export default function ForgotPasswordPage() {
    const [state, formAction, isPending] = useActionState(requestPasswordReset, null)

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Reset Password</h1>
                    <p className={styles.subtitle}>Enter your email to receive a verification code</p>
                </div>

                {state?.success ? (
                    <div className={styles.success}>
                        <p>{state.message}</p>
                        <Link href={`/forgot-password/verify?email=${encodeURIComponent(state.email || '')}`} className={styles.button} style={{ display: 'block', marginTop: '1rem', textDecoration: 'none', textAlign: 'center' }}>
                            Enter Verification Code
                        </Link>
                    </div>
                ) : (
                    <form action={formAction} className={styles.form}>
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

                <div className={styles.footer}>
                    <Link href="/signin" className={styles.link}>
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    )
}
