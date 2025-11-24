'use client'
import { useActionState } from 'react'
import { createProduct } from '@/app/actions/products'

type ProductType = {
    id: string
    name: string
}

export default function ProductForm({ types }: { types: ProductType[] }) {
    const [state, formAction, isPending] = useActionState(createProduct, null)

    return (
        <form action={formAction} style={{ marginBottom: '2rem', padding: '1rem', background: 'white', borderRadius: '8px' }}>
            <h3>Add Product</h3>
            {state?.error && <p style={{ color: 'red' }}>{state.error}</p>}
            <div style={{ display: 'grid', gap: '1rem', maxWidth: '400px' }}>
                <input name="name" placeholder="Name" required style={{ padding: '0.5rem' }} />
                <textarea name="description" placeholder="Description" required style={{ padding: '0.5rem' }} />
                <input name="price" type="number" step="0.01" placeholder="Price" required style={{ padding: '0.5rem' }} />
                <input name="stock" type="number" placeholder="Stock" required style={{ padding: '0.5rem' }} />
                <input name="image" type="file" accept="image/*" style={{ padding: '0.5rem' }} />

                <select name="typeId" style={{ padding: '0.5rem' }}>
                    <option value="">Select Type</option>
                    {types.map(type => (
                        <option key={type.id} value={type.id}>{type.name}</option>
                    ))}
                </select>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input type="checkbox" name="isOutOfStock" id="isOutOfStock" />
                    <label htmlFor="isOutOfStock">Mark as Out of Stock</label>
                </div>

                <input name="outOfStockNote" placeholder="Out of Stock Note" style={{ padding: '0.5rem' }} />

                <button disabled={isPending} style={{ padding: '0.5rem', background: '#0070f3', color: 'white', border: 'none', borderRadius: '4px' }}>
                    {isPending ? 'Adding...' : 'Add Product'}
                </button>
            </div>
        </form>
    )
}
