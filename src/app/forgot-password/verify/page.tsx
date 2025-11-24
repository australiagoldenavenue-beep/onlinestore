'use client'

import { useActionState } from 'react'
import { verifyAndResetPassword } from '@/app/actions/auth-reset'
import styles from '../forgot-password.module.css'
import Link from 'next/link'

export default function VerifyPage() {
    const [state, formAction, isPending] = useActionState(verifyAndResetPassword, null)

    return (
        <div className={styles.container}>
            <div className={styles.formCard}>
                <h1 className={styles.title}>Set New Password</h1>
                <form action={formAction}>
                    {state?.error && <p className={styles.error}>{state.error}</p>}

                    <div className={styles.formGroup}>
                        <label htmlFor="email" className={styles.label}>Email</label>
                        <input type="email" id="email" name="email" required className={styles.input} />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="code" className={styles.label}>Verification Code</label>
                        <input type="text" id="code" name="code" required className={styles.input} placeholder="6-digit code" />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="newPassword" className={styles.label}>New Password</label>
                        <input type="password" id="newPassword" name="newPassword" required className={styles.input} minLength={6} />
                    </div>

                    <button type="submit" className={styles.button} disabled={isPending}>
                        {isPending ? 'Resetting...' : 'Reset Password'}
                    </button>
                </form>

                <Link href="/login" className={styles.link}>
                    Back to Login
                </Link>
            </div>
        </div>
    )
}
