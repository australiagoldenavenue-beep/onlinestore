'use client'
import { createContext, useContext, useState, useEffect } from 'react'

type CartItem = {
    id: string
    name: string
    price: number
    quantity: number
}

type CartContextType = {
    items: CartItem[]
    addToCart: (item: CartItem) => void
    removeFromCart: (id: string) => void
    clearCart: () => void
    isLoaded: boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([])
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        if (typeof window !== 'undefined') {
            try {
                const saved = localStorage.getItem('cart')
                if (saved) {
                    const parsed = JSON.parse(saved)
                    if (Array.isArray(parsed)) {
                        setItems(parsed)
                    } else {
                        console.error('Cart data is not an array:', parsed)
                        setItems([])
                    }
                }
            } catch (e) {
                console.error('Failed to load cart data:', e)
                setItems([])
            } finally {
                setIsLoaded(true)
            }
        } else {
            setIsLoaded(true)
        }
    }, [])

    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('cart', JSON.stringify(items))
        }
    }, [items, isLoaded])

    const addToCart = (newItem: CartItem) => {
        setItems(prev => {
            const existing = prev.find(item => item.id === newItem.id)
            if (existing) {
                return prev.map(item => item.id === newItem.id ? { ...item, quantity: item.quantity + newItem.quantity } : item)
            }
            return [...prev, newItem]
        })
    }

    const removeFromCart = (id: string) => {
        setItems(prev => prev.filter(item => item.id !== id))
    }

    const clearCart = () => setItems([])

    return (
        <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart, isLoaded }}>
            {children}
        </CartContext.Provider>
    )
}

export const useCart = () => {
    const context = useContext(CartContext)
    if (!context) throw new Error('useCart must be used within a CartProvider')
    return context
}
