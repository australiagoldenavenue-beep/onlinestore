'use client'

import { useState } from 'react'
import styles from './orders.module.css'
import ReviewModal from './ReviewModal'

type Order = {
    id: string
    createdAt: string
    status: string
    total: number
    items: {
        id: string
        quantity: number
        price: number
        product: {
            id: string
            name: string
        }
    }[]
}

export default function OrderHistoryList({ orders }: { orders: Order[] }) {
    const [activeTab, setActiveTab] = useState('ALL')
    const [reviewModal, setReviewModal] = useState<{ isOpen: boolean, productId: string, productName: string }>({
        isOpen: false,
        productId: '',
        productName: ''
    })

    const getStatusBadgeClass = (status: string) => {
        switch (status) {
            case 'PENDING': return styles.statusPending
            case 'PAID':
            case 'PROCESSING': return styles.statusProcessing
            case 'SHIPPED': return styles.statusShipped
            case 'COMPLETED':
            case 'DELIVERED': return styles.statusDelivered
            case 'CANCELLED': return styles.statusCancelled
            default: return styles.statusPending
        }
    }

    const filteredOrders = orders.filter(order => {
        if (activeTab === 'ALL') return true
        if (activeTab === 'PENDING') return order.status === 'PENDING'
        if (activeTab === 'PROCESSING') return ['PAID', 'PROCESSING', 'SHIPPED'].includes(order.status)
        if (activeTab === 'PROCESSED') return ['COMPLETED', 'DELIVERED'].includes(order.status)
        if (activeTab === 'CANCELLED') return order.status === 'CANCELLED'
        return true
    })

    const tabs = [
        { id: 'ALL', label: 'All Orders' },
        { id: 'PENDING', label: 'Pending Orders' },
        { id: 'PROCESSING', label: 'Processing (Paid)' },
        { id: 'PROCESSED', label: 'Processed Orders' },
        { id: 'CANCELLED', label: 'Cancelled' },
    ]

    const canReview = (status: string) => {
        return ['PAID', 'PROCESSING', 'SHIPPED', 'COMPLETED', 'DELIVERED'].includes(status)
    }

    return (
        <div>
            <div className={styles.tabs}>
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        className={`${styles.tab} ${activeTab === tab.id ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className={styles.ordersList}>
                {filteredOrders.length > 0 ? (
                    filteredOrders.map(order => (
                        <div key={order.id} className={styles.orderCard}>
                            <div className={styles.orderHeader}>
                                <div>
                                    <div className={styles.orderId}>Order #{order.id.slice(-8).toUpperCase()}</div>
                                    <div className={styles.orderDate}>
                                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </div>
                                </div>
                                <span className={`${styles.statusBadge} ${getStatusBadgeClass(order.status)}`}>
                                    {order.status}
                                </span>
                            </div>
                            <div className={styles.orderItems}>
                                {order.items.map(item => (
                                    <div key={item.id} className={styles.orderItem}>
                                        <div>
                                            <span className={styles.itemName}>{item.product.name}</span>
                                            <span className={styles.itemQuantity}>× {item.quantity}</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <span className={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</span>
                                            {canReview(order.status) && (
                                                <button
                                                    className={styles.reviewButton}
                                                    onClick={() => setReviewModal({
                                                        isOpen: true,
                                                        productId: item.product.id,
                                                        productName: item.product.name
                                                    })}
                                                >
                                                    Review
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className={styles.orderFooter}>
                                <span className={styles.totalLabel}>Total Amount</span>
                                <span className={styles.totalAmount}>${order.total.toFixed(2)}</span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className={styles.emptyState}>
                        <span className={styles.emptyStateIcon}>📦</span>
                        <p className={styles.emptyStateText}>No orders found in this category.</p>
                    </div>
                )}
            </div>

            <ReviewModal
                isOpen={reviewModal.isOpen}
                productId={reviewModal.productId}
                productName={reviewModal.productName}
                onClose={() => setReviewModal(prev => ({ ...prev, isOpen: false }))}
            />
        </div>
    )
}
