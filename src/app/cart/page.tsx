'use client'
import { useCart } from "@/context/CartContext"
import { checkout } from "@/app/actions/checkout"
import { useRouter } from "next/navigation"
import { useState } from "react"
import styles from './cart.module.css'

export default function CartPage() {
    const { items, removeFromCart, clearCart, isLoaded } = useCart()
    const router = useRouter()
    const [isCheckingOut, setIsCheckingOut] = useState(false)
    const [note, setNote] = useState('')

    if (!isLoaded) {
        return (
            <>
                <div style={{ padding: '4rem', textAlign: 'center', color: '#718096' }}>Loading cart...</div>
            </>
        )
    }

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

    const handleCheckout = async () => {
        setIsCheckingOut(true)
        try {
            const result = await checkout(items, note)
            if (result?.orderId) {
                clearCart()
                router.push(`/payment/${result.orderId}`)
            }
        } catch {
            alert('Checkout failed. Please login.')
            router.push('/login')
        } finally {
            setIsCheckingOut(false)
        }
    }

    return (
        <>

            <div className={styles.container}>
                <h1 className={styles.title}>Shopping Cart</h1>

                {items.length === 0 ? (
                    <div className={styles.emptyCart}>
                        <h2>Your cart is empty</h2>
                        <p>Looks like you haven&apos;t added anything yet.</p>
                    </div>
                ) : (
                    <div className={styles.content}>
                        <div className={styles.cartItems}>
                            {items.map(item => (
                                <div key={item.id} className={styles.item}>
                                    <div className={styles.itemInfo}>
                                        <h3>{item.name}</h3>
                                        <div className={styles.itemPrice}>${item.price.toFixed(2)}</div>
                                    </div>
                                    <div className={styles.itemQuantity}>x {item.quantity}</div>
                                    <button onClick={() => removeFromCart(item.id)} className={styles.removeButton}>
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className={styles.summary}>
                            <h2 className={styles.summaryTitle}>Order Summary</h2>

                            <div className={styles.summaryRow}>
                                <span>Subtotal</span>
                                <span>${total.toFixed(2)}</span>
                            </div>
                            <div className={styles.summaryRow}>
                                <span>Tax (Included)</span>
                                <span>${(total * 0.1).toFixed(2)}</span>
                            </div>

                            <textarea
                                placeholder="Add a note to your order (optional)..."
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                className={styles.noteInput}
                                rows={3}
                            />

                            <div className={styles.totalRow}>
                                <span>Total</span>
                                <span>${total.toFixed(2)}</span>
                            </div>

                            <button
                                onClick={handleCheckout}
                                disabled={isCheckingOut}
                                className={styles.checkoutButton}
                            >
                                {isCheckingOut ? 'Processing...' : 'Proceed to Payment'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}
