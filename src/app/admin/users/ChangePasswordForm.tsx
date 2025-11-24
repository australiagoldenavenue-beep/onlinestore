'use client'

import { useActionState } from 'react'
import { changePassword } from '@/app/actions/users'

export default function ChangePasswordForm({ userId }: { userId: string }) {
    const [state, formAction, isPending] = useActionState(changePassword, null)

    return (
        <form action={formAction} style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
            <input type="hidden" name="userId" value={userId} />
            <input name="newPassword" type="password" placeholder="New Password" required style={{ padding: '0.25rem' }} />
            <button disabled={isPending} style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}>
                {isPending ? '...' : 'Set Pwd'}
            </button>
            {state?.error && <span style={{ color: 'red', fontSize: '0.8rem' }}>Error</span>}
            {state?.success && <span style={{ color: 'green', fontSize: '0.8rem' }}>Done</span>}
        </form>
    )
}
