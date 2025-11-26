'use client'

import { useState, useEffect, use } from 'react'
import { createPaymentIntent, confirmPayment, updatePaymentProof } from '@/app/actions/payment'
import { useRouter } from 'next/navigation'
import styles from './payment.module.css'
import QRCode from "react-qr-code"
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'

// Initialize Stripe outside of component to avoid recreating it
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

function PaymentForm({ orderId, amount, onSuccess }: { orderId: string, amount: number, onSuccess: () => void }) {
    const stripe = useStripe()
    const elements = useElements()
    const [isProcessing, setIsProcessing] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!stripe || !elements) return

        setIsProcessing(true)
        setError('')

        try {
            // Step 1: Create payment intent on server
            const intentResult = await createPaymentIntent(orderId, amount)

            if (!intentResult.success || !intentResult.clientSecret) {
                setError(intentResult.error || 'Payment initialization failed')
                setIsProcessing(false)
                return
            }

            // Step 2: Confirm card payment with Stripe
            const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
                intentResult.clientSecret,
                {
                    payment_method: {
                        card: elements.getElement(CardElement)!,
                    }
                }
            )

            if (stripeError) {
                setError(stripeError.message || 'Payment failed')
            } else if (!paymentIntent) {
                setError('No response from payment processor. Please try again.')
            } else if (paymentIntent.status === 'succeeded') {
                // Step 3: Update order in database
                const confirmation = await confirmPayment(orderId, paymentIntent.id)
                if (confirmation?.error) {
                    setError(confirmation.error)
                    return
                }
                onSuccess()
            } else {
                const statusMessage: Record<string, string> = {
                    requires_action: 'Additional card authentication is required. Please complete the verification prompt and try again.',
                    processing: 'Your payment is still processing. We will email you once it completes.',
                    requires_payment_method: 'Your card was declined. Please use a different payment method.',
                }
                setError(statusMessage[paymentIntent.status] || `Payment status: ${paymentIntent.status}. Please contact support if this continues.`)
            }
        } catch (err) {
            console.error(err)
            setError('An unexpected error occurred')
        } finally {
            setIsProcessing(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className={styles.stripeForm}>
            <div className={styles.formGroup}>
                <label className={styles.label}>Card Details</label>
                <div className={styles.stripeElementContainer}>
                    <CardElement options={{
                        style: {
                            base: {
                                fontSize: '16px',
                                color: '#424770',
                                '::placeholder': {
                                    color: '#aab7c4',
                                },
                            },
                            invalid: {
                                color: '#9e2146',
                            },
                        },
                    }} />
                </div>
            </div>

            {error && <div className={styles.error}>{error}</div>}

            <button
                type="submit"
                disabled={!stripe || isProcessing}
                className={styles.payButton}
            >
                {isProcessing ? 'Processing Payment...' : `Pay $${amount.toFixed(2)}`}
            </button>
        </form>
    )
}

export default function PaymentPage({ params }: { params: Promise<{ orderId: string }> }) {
    const { orderId } = use(params)
    const router = useRouter()
    const [success, setSuccess] = useState(false)
    const [countdown, setCountdown] = useState(5)
    const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank'>('card')
    const [settings, setSettings] = useState<Record<string, string>>({})
    const [orderTotal, setOrderTotal] = useState(0)
    const [uploading, setUploading] = useState(false)
    const [proofStatus, setProofStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null)

    // Fetch settings and order info
    useEffect(() => {
        async function fetchData() {
            try {
                const [settingsRes, orderRes] = await Promise.all([
                    fetch('/api/settings'),
                    fetch(`/api/orders/${orderId}`)
                ])

                if (settingsRes.ok) {
                    const data = await settingsRes.json()
                    setSettings(data)
                }

                if (orderRes.ok) {
                    const orderData = await orderRes.json()
                    setOrderTotal(orderData.total)
                }
            } catch (err) {
                console.error('Failed to fetch data:', err)
            }
        }
        fetchData()
    }, [orderId])

    useEffect(() => {
        if (success) {
            const timer = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer)
                        router.push('/profile')
                        return 0
                    }
                    return prev - 1
                })
            }, 1000)
            return () => clearInterval(timer)
        }
    }, [success, router])

    if (success) {
        return (
            <div className={styles.container}>
                <div className={styles.card}>
                    <div className={styles.successContainer}>
                        <div className={styles.successIcon}>✅</div>
                        <h1 className={styles.successTitle}>Payment Successful!</h1>
                        <p className={styles.successText}>Thank you for your purchase.</p>
                        <p className={styles.redirectText}>Redirecting to your orders in {countdown} seconds...</p>
                        <button
                            onClick={() => router.push('/profile')}
                            className={styles.orderButton}
                        >
                            Go to Orders Now
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1 className={styles.title}>Secure Payment</h1>
                <p style={{ textAlign: 'center', color: '#666', marginBottom: '1.5rem' }}>
                    Order ID: <strong>{orderId}</strong>
                </p>

                {/* Payment Method Tabs */}
                <div className={styles.paymentTabs}>
                    <button
                        type="button"
                        className={`${styles.tab} ${paymentMethod === 'card' ? styles.activeTab : ''}`}
                        onClick={() => setPaymentMethod('card')}
                    >
                        💳 Card Payment
                    </button>
                    <button
                        type="button"
                        className={`${styles.tab} ${paymentMethod === 'bank' ? styles.activeTab : ''}`}
                        onClick={() => setPaymentMethod('bank')}
                    >
                        🏦 Bank Transfer
                    </button>
                </div>

                {/* Card Payment Form */}
                {paymentMethod === 'card' && (
                    <Elements stripe={stripePromise}>
                        <PaymentForm
                            orderId={orderId}
                            amount={orderTotal}
                            onSuccess={() => setSuccess(true)}
                        />
                    </Elements>
                )}

                {/* Bank Transfer Information */}
                {paymentMethod === 'bank' && (
                    <div className={styles.bankTransferSection}>
                        <div className={styles.bankInfoCard}>
                            <h3 className={styles.bankInfoTitle}>📋 Bank Account Details</h3>

                            <div className={styles.infoRow}>
                                <span className={styles.infoLabel}>Bank Name:</span>
                                <span className={styles.infoValue}>{settings.bankName || 'Not configured'}</span>
                            </div>

                            <div className={styles.infoRow}>
                                <span className={styles.infoLabel}>Account Number:</span>
                                <span className={styles.infoValue}>{settings.accountNumber || 'Not configured'}</span>
                            </div>

                            <div className={styles.infoRow}>
                                <span className={styles.infoLabel}>Account Holder:</span>
                                <span className={styles.infoValue}>{settings.accountHolder || 'Not configured'}</span>
                            </div>

                            <div className={styles.infoRow}>
                                <span className={styles.infoLabel}>Amount to Transfer:</span>
                                <span className={styles.infoValueHighlight}>${orderTotal.toFixed(2)}</span>
                            </div>

                            <div className={styles.infoRow}>
                                <span className={styles.infoLabel}>Reference (Order ID):</span>
                                <span className={styles.infoValueHighlight}>{orderId}</span>
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
                            <div style={{ background: 'white', padding: '15px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', textAlign: 'center' }}>
                                <div style={{ marginBottom: '10px', fontSize: '0.9rem', fontWeight: '600', color: '#555' }}>Scan to Pay</div>
                                <div style={{ height: "auto", margin: "0 auto", maxWidth: 128, width: "100%" }}>
                                    <QRCode
                                        size={256}
                                        style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                        value={`Bank: ${settings.bankName}\nAccount: ${settings.accountNumber}\nHolder: ${settings.accountHolder}\nAmount: $${orderTotal.toFixed(2)}\nRef: ${orderId}`}
                                        viewBox={`0 0 256 256`}
                                    />
                                </div>
                            </div>
                        </div>

                        {settings.paymentInstructions && (
                            <div className={styles.instructionsCard}>
                                <h3 className={styles.instructionsTitle}>📝 Payment Instructions</h3>
                                <p className={styles.instructionsText}>{settings.paymentInstructions}</p>
                            </div>
                        )}

                        <div className={styles.warningCard}>
                            <p>⚠️ <strong>Important:</strong> Please include your Order ID <strong>{orderId}</strong> in the payment reference to ensure your order is processed correctly.</p>
                        </div>

                        <div className={styles.uploadSection} style={{ marginTop: '20px', padding: '20px', background: '#f8f9fa', borderRadius: '8px', border: '1px dashed #ccc' }}>
                            <h3 style={{ marginTop: 0, fontSize: '1.1rem' }}>📤 Upload Payment Proof</h3>
                            <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '15px' }}>
                                Already paid? Upload a screenshot of your transfer receipt to speed up processing.
                            </p>

                            <input
                                type="file"
                                accept="image/*"
                                onChange={async (e) => {
                                    if (!e.target.files?.length) return

                                    const file = e.target.files[0]
                                    if (file.size > 5 * 1024 * 1024) {
                                        alert('File is too large. Max 5MB.')
                                        return
                                    }

                                    setUploading(true)
                                    setProofStatus(null)
                                    const formData = new FormData()
                                    formData.append('file', file)

                                    try {
                                        const res = await fetch('/api/upload', {
                                            method: 'POST',
                                            body: formData
                                        })

                                        if (!res.ok) throw new Error('Upload failed')

                                        const data = await res.json()

                                        const result = await updatePaymentProof(orderId, data.url)
                                        if (result.success) {
                                            setProofStatus({
                                                type: 'success',
                                                message: 'Payment proof uploaded. Our team will verify and update your order status shortly.'
                                            })
                                        } else {
                                            setProofStatus({
                                                type: 'error',
                                                message: result.error || 'Failed to update order with payment proof.'
                                            })
                                        }
                                    } catch (error) {
                                        console.error(error)
                                        setProofStatus({
                                            type: 'error',
                                            message: 'Error uploading file. Please try again.'
                                        })
                                    } finally {
                                        setUploading(false)
                                    }
                                }}
                                disabled={uploading}
                                style={{ display: 'block', width: '100%', marginBottom: '10px' }}
                            />
                            {uploading && <p style={{ color: '#0070f3' }}>Uploading...</p>}
                            {proofStatus && (
                                <p style={{
                                    color: proofStatus.type === 'success' ? '#047857' : '#b91c1c',
                                    background: proofStatus.type === 'success' ? '#ecfdf5' : '#fef2f2',
                                    border: `1px solid ${proofStatus.type === 'success' ? '#34d399' : '#fecaca'}`,
                                    padding: '10px',
                                    borderRadius: '8px'
                                }}>
                                    {proofStatus.message}
                                </p>
                            )}
                        </div>

                        <button
                            onClick={() => router.push('/profile')}
                            className={styles.returnButton}
                        >
                            Return to My Orders
                        </button>
                    </div>
                )}
            </div>
        </div >
    )
}
