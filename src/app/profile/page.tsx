import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import styles from './profile.module.css'

export default async function ProfilePage() {
    const session = await auth()
    if (!session?.user) redirect('/login')

    const orders = await prisma.order.findMany({
        where: { userId: session.user.id },
        include: { items: { include: { product: true } } },
        orderBy: { createdAt: 'desc' }
    })

    const getStatusBadgeClass = (status: string) => {
        switch (status) {
            case 'PENDING': return styles.statusPending
            case 'PROCESSING': return styles.statusProcessing
            case 'SHIPPED': return styles.statusShipped
            case 'DELIVERED': return styles.statusDelivered
            case 'CANCELLED': return styles.statusCancelled
            default: return styles.statusPending
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.profileCard}>
                <div className={styles.avatar}>
                    {session.user.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <h1 className={styles.title}>My Profile</h1>
                <div className={styles.infoGrid}>
                    <div className={styles.infoItem}>
                        <span className={styles.label}>Name</span>
                        <span className={styles.value}>{session.user.name}</span>
                    </div>
                    <div className={styles.infoItem}>
                        <span className={styles.label}>Email</span>
                        <span className={styles.value}>{session.user.email}</span>
                    </div>
                    <div className={styles.infoItem}>
                        <span className={styles.label}>Address</span>
                        <span className={styles.value}>{session.user.address || 'Not set'}</span>
                    </div>
                    <div className={styles.infoItem}>
                        <span className={styles.label}>Phone</span>
                        <span className={styles.value}>{session.user.phoneNumber || 'Not set'}</span>
                    </div>
                </div>
            </div>

            <h2 className={styles.ordersTitle}>Order History</h2>
            <div className={styles.ordersList}>
                {orders.length > 0 ? (
                    orders.map(order => (
                        <div key={order.id} className={styles.orderCard}>
                            <div className={styles.orderHeader}>
                                <div>
                                    <strong className={styles.orderId}>Order #{order.id.slice(-8).toUpperCase()}</strong>
                                    <div className={styles.orderDate}>{order.createdAt.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                                </div>
                                <span className={`${styles.statusBadge} ${getStatusBadgeClass(order.status)}`}>
                                    {order.status}
                                </span>
                            </div>
                            <div className={styles.orderItems}>
                                {order.items.map(item => (
                                    <div key={item.id} className={styles.orderItem}>
                                        <span className={styles.itemName}>{item.product.name} × {item.quantity}</span>
                                        <span className={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                            <div className={styles.orderTotal}>
                                Total: ${order.total.toFixed(2)}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className={styles.noOrders}>
                        <p>No orders yet</p>
                        <p className={styles.noOrdersSubtext}>Start shopping to see your orders here!</p>
                    </div>
                )}
            </div>
        </div>
    )
}
