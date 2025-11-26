'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { authenticate } from '@/app/actions/auth'
import styles from './Auth.module.css'
import Link from 'next/link'

function SubmitButton() {
    const { pending } = useFormStatus()

    return (
        <button className={styles.button} disabled={pending}>
            {pending ? 'Signing in...' : 'Sign In'}
        </button>
    )
}

export default function LoginForm() {
    const [state, dispatch] = useActionState(authenticate, undefined)

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1 className={styles.title}>Welcome Back</h1>
                <p className={styles.subtitle}>Please sign in to continue</p>

                <form action={dispatch}>
                    {state?.error && (
                        <div className={styles.error}>
                            {state.error}
                        </div>
                    )}

                    <div className={styles.formGroup}>
                        <label htmlFor="email" className={styles.label}>Email</label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            required
                            className={styles.input}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="password" className={styles.label}>Password</label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            required
                            minLength={6}
                            className={styles.input}
                        />
                    </div>

                    <SubmitButton />

                    <div className={styles.footer}>
                        Don&apos;t have an account?
                        <Link href="/register" className={styles.link}>
                            Sign up
                        </Link>
                    </div>
                    <div className={styles.footer} style={{ marginTop: '0.5rem' }}>
                        <Link href="/forgot-password" className={styles.link}>
                            Forgot Password?
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    )
}
