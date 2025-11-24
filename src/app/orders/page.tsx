import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import styles from './orders.module.css'
import OrderHistoryList from './OrderHistoryList'

export const dynamic = 'force-dynamic'

export default async function OrdersPage() {
    const session = await auth()
    if (!session?.user) redirect('/login')

    const orders = await prisma.order.findMany({
        where: {
            userId: session.user.id,
        },
        include: { items: { include: { product: true } } },
        orderBy: { createdAt: 'desc' }
    })

    const serializedOrders = orders.map(order => ({
        id: order.id,
        createdAt: order.createdAt.toISOString(),
        status: order.status,
        total: order.total,
        items: order.items.map(item => ({
            id: item.id,
            quantity: item.quantity,
            price: item.price,
            product: {
                id: item.product.id,
                name: item.product.name
            }
        }))
    }))

    return (
        <div className={styles.container}>
            <h1 className={styles.pageTitle}>
                <span>📦</span> Order History
            </h1>
            <OrderHistoryList orders={serializedOrders} />
        </div>
    )
}
