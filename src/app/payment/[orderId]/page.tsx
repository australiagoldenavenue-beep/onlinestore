'use client'

import { useState, useEffect } from 'react'
import { processPayment } from '@/app/actions/payment'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'

export default function PaymentPage({ params }: { params: { orderId: string } }) {
    const router = useRouter()
    const [isProcessing, setIsProcessing] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    // Card state
    const [cardNumber, setCardNumber] = useState('')
    const [expiry, setExpiry] = useState('')
    const [cvc, setCvc] = useState('')
    const [name, setName] = useState('')

    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => {
                router.push('/profile') // Redirect to order history (profile usually has orders)
            }, 5000)
            return () => clearTimeout(timer)
        }
    }, [success, router])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsProcessing(true)
        setError('')

        try {
            const result = await processPayment(params.orderId, {
                cardNumber,
                expiry,
                cvc,
                name
            })

            if (result.success) {
                setSuccess(true)
            } else {
                setError(result.error || 'Payment failed')
            }
        } catch (err) {
            setError('An unexpected error occurred')
        } finally {
            setIsProcessing(false)
        }
    }

    if (success) {
        return (
            <>
                <Navbar />
                <div style={{
                    minHeight: '80vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    padding: '2rem'
                }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
                    <h1 style={{ color: 'green', marginBottom: '1rem' }}>Payment Successful!</h1>
                    <p style={{ fontSize: '1.2rem', color: '#666' }}>Thank you for your purchase.</p>
                    <p style={{ marginTop: '2rem', color: '#888' }}>Redirecting to your orders in 5 seconds...</p>
                    <button
                        onClick={() => router.push('/profile')}
                        style={{
                            marginTop: '2rem',
                            padding: '0.75rem 1.5rem',
                            background: '#0070f3',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Go to Orders Now
                    </button>
                </div>
            </>
        )
    }

    return (
        <>
            <Navbar />
            <div style={{ maxWidth: '500px', margin: '2rem auto', padding: '2rem', background: 'white', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <h1 style={{ marginBottom: '2rem', textAlign: 'center' }}>Secure Payment</h1>

                {error && (
                    <div style={{ background: '#ffebee', color: '#c62828', padding: '1rem', borderRadius: '4px', marginBottom: '1.5rem', textAlign: 'center' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>Cardholder Name</label>
                        <input
                            type="text"
                            required
                            placeholder="John Doe"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #ddd', fontSize: '1rem' }}
                        />
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>Card Number</label>
                        <input
                            type="text"
                            required
                            placeholder="0000 0000 0000 0000"
                            maxLength={19}
                            value={cardNumber}
                            onChange={e => setCardNumber(e.target.value)}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #ddd', fontSize: '1rem' }}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>Expiry Date</label>
                            <input
                                type="text"
                                required
                                placeholder="MM/YY"
                                maxLength={5}
                                value={expiry}
                                onChange={e => setExpiry(e.target.value)}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #ddd', fontSize: '1rem' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>CVC</label>
                            <input
                                type="text"
                                required
                                placeholder="123"
                                maxLength={4}
                                value={cvc}
                                onChange={e => setCvc(e.target.value)}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #ddd', fontSize: '1rem' }}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isProcessing}
                        style={{
                            width: '100%',
                            padding: '1rem',
                            background: isProcessing ? '#ccc' : '#0070f3',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '1.1rem',
                            fontWeight: '600',
                            cursor: isProcessing ? 'not-allowed' : 'pointer',
                            transition: 'background 0.2s'
                        }}
                    >
                        {isProcessing ? 'Processing Payment...' : 'Pay Now'}
                    </button>
                </form>
            </div>
        </>
    )
}
