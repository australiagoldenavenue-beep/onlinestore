import { prisma } from "@/lib/prisma"
import { updateOrderStatus } from "@/app/actions/orders"

export default async function OrdersPage() {
    const orders = await prisma.order.findMany({
        include: { user: true, items: { include: { product: true } } },
        orderBy: { createdAt: 'desc' }
    })

    return (
        <div>
            <h1>Orders</h1>
            <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
                {orders.map(order => (
                    <div key={order.id} style={{ background: 'white', padding: '1rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <div>
                                <strong>Order #{order.id.slice(-6)}</strong> by {order.user.name} ({order.user.email})
                                <br />
                                <span style={{ color: '#666', fontSize: '0.9rem' }}>{order.createdAt.toLocaleString()}</span>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>${order.total}</div>
                                <div>Status: {order.status}</div>
                            </div>
                        </div>
                        {order.note && (
                            <div style={{ marginBottom: '1rem', padding: '0.5rem', background: '#f9f9f9', borderRadius: '4px', fontStyle: 'italic' }}>
                                Note: {order.note}
                            </div>
                        )}
                        <div style={{ marginBottom: '1rem' }}>
                            {order.items.map(item => (
                                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', padding: '0.5rem 0' }}>
                                    <span>{item.product.name} x {item.quantity}</span>
                                    <span>${item.price * item.quantity}</span>
                                </div>
                            ))}
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <form action={updateOrderStatus.bind(null, order.id, 'PENDING')}>
                                <button disabled={order.status === 'PENDING'} style={{ padding: '0.5rem', cursor: 'pointer' }}>Mark Pending</button>
                            </form>
                            <form action={updateOrderStatus.bind(null, order.id, 'COMPLETED')}>
                                <button disabled={order.status === 'COMPLETED'} style={{ padding: '0.5rem', cursor: 'pointer', background: '#4caf50', color: 'white', border: 'none', borderRadius: '4px' }}>Mark Completed</button>
                            </form>
                            <form action={updateOrderStatus.bind(null, order.id, 'CANCELLED')}>
                                <button disabled={order.status === 'CANCELLED'} style={{ padding: '0.5rem', cursor: 'pointer', background: '#f44336', color: 'white', border: 'none', borderRadius: '4px' }}>Cancel</button>
                            </form>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
