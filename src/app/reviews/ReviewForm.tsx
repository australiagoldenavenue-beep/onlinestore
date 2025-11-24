'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

type Product = {
    id: string
    name: string
}

export default function ReviewForm() {
    const router = useRouter()
    const [products, setProducts] = useState<Product[]>([])
    const [selectedProduct, setSelectedProduct] = useState('')
    const [content, setContent] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [loadingProducts, setLoadingProducts] = useState(false)

    // Load products when component mounts
    useEffect(() => {
        async function loadProducts() {
            setLoadingProducts(true)
            try {
                const res = await fetch('/api/products')
                const data = await res.json()
                setProducts(data)
            } catch (err) {
                console.error('Error loading products:', err)
            } finally {
                setLoadingProducts(false)
            }
        }
        loadProducts()
    }, [])

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        if (!selectedProduct || !content.trim()) {
            setError('Please select a product and write a review')
            return
        }

        setLoading(true)
        setError('')

        try {
            const res = await fetch('/api/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productId: selectedProduct,
                    content: content.trim()
                })
            })

            if (!res.ok) {
                throw new Error('Failed to submit review')
            }

            setContent('')
            setSelectedProduct('')
            router.refresh()
        } catch {
            setError('Failed to submit review. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            background: 'rgba(255, 255, 255, 0.95)',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
            {error && (
                <div style={{
                    padding: '1rem',
                    background: '#fee',
                    color: '#c00',
                    borderRadius: '8px'
                }}>
                    {error}
                </div>
            )}

            <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                    Select Product
                </label>
                <select
                    value={selectedProduct}
                    onChange={(e) => setSelectedProduct(e.target.value)}
                    required
                    disabled={loadingProducts}
                    style={{
                        width: '100%',
                        padding: '0.75rem',
                        borderRadius: '8px',
                        border: '2px solid #e0e0e0',
                        fontSize: '1rem',
                        transition: 'border-color 0.3s'
                    }}
                >
                    <option value="">
                        {loadingProducts ? 'Loading products...' : 'Choose a product'}
                    </option>
                    {products.map((product) => (
                        <option key={product.id} value={product.id}>
                            {product.name}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                    Your Review
                </label>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Share your thoughts about this product..."
                    required
                    rows={4}
                    style={{
                        width: '100%',
                        padding: '0.75rem',
                        borderRadius: '8px',
                        border: '2px solid #e0e0e0',
                        fontSize: '1rem',
                        resize: 'vertical',
                        transition: 'border-color 0.3s'
                    }}
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                style={{
                    padding: '0.75rem 1.5rem',
                    background: loading ? '#ccc' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'transform 0.2s',
                }}
            >
                {loading ? 'Submitting...' : 'Submit Review'}
            </button>
        </form>
    )
}
