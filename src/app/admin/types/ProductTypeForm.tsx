'use client'
import { useActionState } from 'react'
import { createProductType } from '@/app/actions/productTypes'

export default function ProductTypeForm() {
    const [state, formAction, isPending] = useActionState(createProductType, null)

    return (
        <form action={formAction} style={{ marginBottom: '2rem', padding: '1rem', background: 'white', borderRadius: '8px' }}>
            <h3>Add Product Type</h3>
            {state?.error && <p style={{ color: 'red' }}>{state.error}</p>}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
                <input name="name" placeholder="Type Name" required style={{ padding: '0.5rem' }} />
                <input name="image" type="file" accept="image/*" style={{ padding: '0.5rem' }} />
                <button disabled={isPending} style={{ padding: '0.5rem', background: '#0070f3', color: 'white', border: 'none', borderRadius: '4px' }}>
                    {isPending ? 'Adding...' : 'Add Type'}
                </button>
            </div>
        </form>
    )
}
