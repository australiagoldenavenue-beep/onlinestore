'use client'

import { useActionState } from 'react'
import { createUser } from '@/app/actions/users'

export default function CreateUserForm() {
    const [state, formAction, isPending] = useActionState(createUser, null)

    return (
        <form action={formAction} style={{ marginBottom: '2rem', padding: '1rem', background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h3>Create New User / Staff</h3>
            {state?.error && <p style={{ color: 'red' }}>{state.error}</p>}
            {state?.success && <p style={{ color: 'green' }}>User created successfully!</p>}

            <div style={{ display: 'grid', gap: '1rem', maxWidth: '400px' }}>
                <input name="name" placeholder="Name" required style={{ padding: '0.5rem' }} />
                <input name="email" type="email" placeholder="Email" required style={{ padding: '0.5rem' }} />
                <input name="password" type="password" placeholder="Password" required style={{ padding: '0.5rem' }} />

                <select name="role" style={{ padding: '0.5rem' }}>
                    <option value="USER">User (Client)</option>
                    <option value="STAFF">Staff</option>
                    <option value="MANAGER">Manager</option>
                    <option value="ADMIN">Admin</option>
                </select>

                <button disabled={isPending} style={{ padding: '0.5rem', background: '#0070f3', color: 'white', border: 'none', borderRadius: '4px' }}>
                    {isPending ? 'Creating...' : 'Create User'}
                </button>
            </div>
        </form>
    )
}
