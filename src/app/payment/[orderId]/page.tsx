'use client'

import { useState, useEffect, use } from 'react'
import { processPayment } from '@/app/actions/payment'
import { useRouter } from 'next/navigation'
import styles from './payment.module.css'

export default function PaymentPage({ params }: { params: Promise<{ orderId: string }> }) {
    const { orderId } = use(params)
    const router = useRouter()
    const [isProcessing, setIsProcessing] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)
    const [countdown, setCountdown] = useState(5)
    const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank'>('card')
    const [settings, setSettings] = useState<Record<string, string>>({})
    const [orderTotal, setOrderTotal] = useState(0)

    // Card state
    const [cardNumber, setCardNumber] = useState('')
    const [cardType, setCardType] = useState('')
    const [expiry, setExpiry] = useState('')
    const [cvc, setCvc] = useState('')
    const [name, setName] = useState('')

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

    const detectCardType = (number: string) => {
        const cleanNumber = number.replace(/\D/g, '')
        if (cleanNumber.match(/^4/)) return 'Visa'
        if (cleanNumber.match(/^5[1-5]/)) return 'Mastercard'
        if (cleanNumber.match(/^3[47]/)) return 'Amex'
        if (cleanNumber.match(/^6(?:011|5)/)) return 'Discover'
        return ''
    }

    const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value
        setCardNumber(val)
        setCardType(detectCardType(val))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsProcessing(true)
        setError('')

        try {
            const result = await processPayment(orderId, {
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
        } catch {
            setError('An unexpected error occurred')
        } finally {
            setIsProcessing(false)
        }
    }

    if (success) {
        return (
            <>

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
            </>
        )
    }

    return (
        <>

            <div className={styles.container}>
                <div className={styles.card}>
                    <h1 className={styles.title}>Secure Payment</h1>
                    <p style={{ textAlign: 'center', color: '#666', marginBottom: '1.5rem' }}>
                        Order ID: <strong>{orderId}</strong>
                    </p>

                    {error && (
                        <div className={styles.error}>
                            {error}
                        </div>
                    )}

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
                        <form onSubmit={handleSubmit}>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Cardholder Name</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="John Doe"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    className={styles.input}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>
                                    Card Number
                                    {cardType && <span className={styles.cardTypeBadge}>{cardType}</span>}
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="0000 0000 0000 0000"
                                    maxLength={19}
                                    value={cardNumber}
                                    onChange={handleCardNumberChange}
                                    className={styles.input}
                                />
                            </div>

                            <div className={styles.row}>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Expiry Date</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="MM/YY"
                                        maxLength={5}
                                        value={expiry}
                                        onChange={e => setExpiry(e.target.value)}
                                        className={styles.input}
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>CVC</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="123"
                                        maxLength={4}
                                        value={cvc}
                                        onChange={e => setCvc(e.target.value)}
                                        className={styles.input}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isProcessing}
                                className={styles.payButton}
                            >
                                {isProcessing ? 'Processing Payment...' : 'Pay Now'}
                            </button>
                        </form>
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

                            {settings.paymentInstructions && (
                                <div className={styles.instructionsCard}>
                                    <h3 className={styles.instructionsTitle}>📝 Payment Instructions</h3>
                                    <p className={styles.instructionsText}>{settings.paymentInstructions}</p>
                                </div>
                            )}

                            <div className={styles.warningCard}>
                                <p>⚠️ <strong>Important:</strong> Please include your Order ID <strong>{orderId}</strong> in the payment reference to ensure your order is processed correctly.</p>
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
            </div>
        </>
    )
}
