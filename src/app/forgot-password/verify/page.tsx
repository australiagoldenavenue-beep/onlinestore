'use client'

import { useActionState, Suspense, useState, useEffect } from 'react'
import { verifyAndResetPassword } from '@/app/actions/auth-reset'
import styles from '../forgot-password.module.css'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'

function VerifyForm() {
    const [state, formAction, isPending] = useActionState(verifyAndResetPassword, null)
    const searchParams = useSearchParams()
    const emailParam = searchParams.get('email') || ''
    const codeParam = searchParams.get('code') || ''

    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [validationError, setValidationError] = useState('')

    useEffect(() => {
        if (state?.success) {
            const emailInput = document.getElementById('email') as HTMLInputElement
            const email = emailInput?.value || emailParam

            signIn("credentials", {
                email,
                password,
                redirect: true,
                callbackUrl: '/'
            })
        }
    }, [state, password, emailParam])

    const handleSubmit = (formData: FormData) => {
        setValidationError('')

        if (password !== confirmPassword) {
            setValidationError("Passwords do not match")
            return
        }

        if (password.length < 6) {
            setValidationError("Password must be at least 6 characters")
            return
        }

        formAction(formData)
    }

    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <h1 className={styles.title}>Set New Password</h1>
                <p className={styles.subtitle}>Enter the code sent to your email</p>
            </div>

            <form action={handleSubmit} className={styles.form}>
                {(state?.error || validationError) && (
                    <div className={styles.error}>
                        {state?.error || validationError}
                    </div>
                )}

                <div className={styles.formGroup}>
                    <label htmlFor="email" className={styles.label}>Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        className={styles.input}
                        defaultValue={emailParam}
                        placeholder="Enter your email"
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="code" className={styles.label}>Verification Code</label>
                    <input
                        type="text"
                        id="code"
                        name="code"
                        required
                        className={styles.input}
                        placeholder="6-digit code"
                        defaultValue={codeParam}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="newPassword" className={styles.label}>New Password</label>
                    <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        required
                        className={styles.input}
                        minLength={6}
                        placeholder="Enter new password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="confirmPassword" className={styles.label}>Confirm Password</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        required
                        className={styles.input}
                        minLength={6}
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>

                <button type="submit" className={styles.button} disabled={isPending}>
                    {isPending ? 'Resetting...' : 'Reset Password'}
                </button>
            </form>

            <div className={styles.footer}>
                <Link href="/signin" className={styles.link}>
                    Back to Login
                </Link>
            </div>
        </div>
    )
}

export default function VerifyPage() {
    return (
        <div className={styles.container}>
            <Suspense fallback={<div>Loading...</div>}>
                <VerifyForm />
            </Suspense>
        </div>
    )
}
