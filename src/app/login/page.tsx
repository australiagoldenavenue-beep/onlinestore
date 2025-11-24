'use client'

import { useActionState } from 'react'
import { authenticate } from '@/app/actions/auth'
import styles from './login.module.css'
import Link from 'next/link'

export default function LoginPage() {
    const [state, formAction, isPending] = useActionState(authenticate, null)

    return (
        <div className={styles.container}>
            <div className={styles.formCard}>
                <h1 className={styles.title}>Login</h1>
                <form action={formAction}>
                    {state?.error && <p className={styles.error}>{state.error}</p>}
                    <div className={styles.formGroup}>
                        <label htmlFor="email" className={styles.label}>Email</label>
                        <input type="email" id="email" name="email" required className={styles.input} />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="password" className={styles.label}>Password</label>
                        <input type="password" id="password" name="password" required className={styles.input} />
                    </div>
                    <button type="submit" className={styles.button} disabled={isPending}>
                        {isPending ? 'Logging in…' : 'Login'}
                    </button>
                </form>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
                    <Link href="/forgot-password" className={styles.link} style={{ marginTop: 0 }}>
                        Forgot Password?
                    </Link>
                    <Link href="/register" className={styles.link} style={{ marginTop: 0 }}>
                        Register
                    </Link>
                </div>
            </div>
        </div>
    )
}
