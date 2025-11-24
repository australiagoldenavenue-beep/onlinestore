'use client'
import { useCart } from "@/context/CartContext"
import { Product } from "@prisma/client"
import { useState } from "react"
import styles from './product.module.css'

export default function AddToCartButton({ product }: { product: Product }) {
    const { addToCart } = useCart()
    const [quantity, setQuantity] = useState(1)
    const [adding, setAdding] = useState(false)

    const handleQuantityChange = (newQuantity: number) => {
        if (newQuantity >= 1 && newQuantity <= product.stock) {
            setQuantity(newQuantity)
        }
    }

    const handleAddToCart = () => {
        setAdding(true)
        addToCart({ id: product.id, name: product.name, price: product.price, quantity })
        setTimeout(() => {
            setAdding(false)
            setQuantity(1)
        }, 600)
    }

    return (
        <div className={styles.cartSection}>
            <div className={styles.quantitySelector}>
                <label className={styles.quantityLabel}>Quantity</label>
                <div className={styles.quantityControls}>
                    <button
                        onClick={() => handleQuantityChange(quantity - 1)}
                        disabled={quantity <= 1}
                        className={styles.quantityButton}
                        aria-label="Decrease quantity"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                    </button>
                    <input
                        type="number"
                        value={quantity}
                        onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                        min="1"
                        max={product.stock}
                        className={styles.quantityInput}
                        aria-label="Quantity"
                    />
                    <button
                        onClick={() => handleQuantityChange(quantity + 1)}
                        disabled={quantity >= product.stock}
                        className={styles.quantityButton}
                        aria-label="Increase quantity"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                    </button>
                </div>
            </div>

            <button
                onClick={handleAddToCart}
                disabled={product.isOutOfStock || product.stock === 0 || adding}
                className={`${styles.addToCartButton} ${adding ? styles.adding : ''}`}
            >
                {adding ? (
                    <>
                        <svg className={styles.checkIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                        Added!
                    </>
                ) : product.isOutOfStock || product.stock === 0 ? (
                    'Out of Stock'
                ) : (
                    <>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="9" cy="21" r="1" />
                            <circle cx="20" cy="21" r="1" />
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                        </svg>
                        Add to Cart
                    </>
                )}
            </button>
        </div>
    )
}
