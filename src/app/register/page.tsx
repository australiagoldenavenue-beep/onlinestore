'use client'

import { useActionState } from 'react'
import { register } from '@/app/actions/auth'
import styles from './register.module.css'
import Link from 'next/link'

export default function RegisterPage() {
    const [state, formAction, isPending] = useActionState(register, null)

    return (
        <div className={styles.container}>
            <div className={styles.formCard}>
                <h1 className={styles.title}>Register</h1>
                <form action={formAction}>
                    {state?.error && <p className={styles.error}>{state.error}</p>}
                    <div className={styles.formGroup}>
                        <label htmlFor="name" className={styles.label}>Name</label>
                        <input type="text" id="name" name="name" required className={styles.input} />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="address" className={styles.label}>Address</label>
                        <input type="text" id="address" name="address" required className={styles.input} />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="phoneNumber" className={styles.label}>Phone Number</label>
                        <input type="tel" id="phoneNumber" name="phoneNumber" required className={styles.input} />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="email" className={styles.label}>Email</label>
                        <input type="email" id="email" name="email" required className={styles.input} />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="password" className={styles.label}>Password</label>
                        <input type="password" id="password" name="password" required minLength={6} className={styles.input} />
                    </div>
                    <button type="submit" className={styles.button} disabled={isPending}>
                        {isPending ? 'Registering...' : 'Register'}
                    </button>
                </form>
                <Link href="/login" className={styles.link}>
                    Already have an account? Login
                </Link>
            </div>
        </div>
    )
}
