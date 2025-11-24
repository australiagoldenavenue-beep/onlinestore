import { prisma } from "@/lib/prisma"
import { updateOrderStatus, updateOrderType } from "@/app/actions/orders"
import type { Order, User, OrderItem, Product } from "@prisma/client"

import { auth } from "@/auth"
import { redirect } from "next/navigation"

export const dynamic = 'force-dynamic'

type OrderWithRelations = Order & {
    user: User
    items: (OrderItem & {
        product: Product
    })[]
}

export default async function OrdersPage() {
    const session = await auth()
    const role = session?.user?.role
    if (role !== 'ADMIN' && role !== 'OWNER' && role !== 'MANAGER') {
        redirect('/admin')
    }

    const orders = await prisma.order.findMany({
        include: { user: true, items: { include: { product: true } } },
        orderBy: { createdAt: 'desc' },
        take: 50 // Limit to prevent memory crash
    })

    // Calculate statistics
    const onlineOrders = orders.filter(order => order.orderType === 'ONLINE')
    const offlineOrders = orders.filter(order => order.orderType === 'OFFLINE')

    const validStatuses = ['PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'COMPLETED']
    const totalOrdersProcessed = orders.filter(order => validStatuses.includes(order.status)).length

    const validOrders = orders.filter(order => validStatuses.includes(order.status))
    const totalOrderValue = validOrders.reduce((sum, order) => sum + order.total, 0)
    const totalIncome = totalOrderValue * 0.1 // 10% of total orders

    return (
        <div>
            <h1 style={{ marginBottom: '2rem' }}>Orders Management</h1>

            {/* Statistics Dashboard */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem',
                marginBottom: '2rem'
            }}>
                <div style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    padding: '1.5rem',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}>
                    <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Total Orders Processed</div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', marginTop: '0.5rem' }}>{totalOrdersProcessed}</div>
                </div>

                <div style={{
                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    color: 'white',
                    padding: '1.5rem',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}>
                    <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Total Order Value</div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', marginTop: '0.5rem' }}>${totalOrderValue.toFixed(2)}</div>
                </div>

                <div style={{
                    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                    color: 'white',
                    padding: '1.5rem',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}>
                    <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>GST</div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', marginTop: '0.5rem' }}>${totalIncome.toFixed(2)}</div>
                </div>
            </div>

            {/* Online Orders Section */}
            <div style={{ marginBottom: '3rem' }}>
                <h2 style={{
                    fontSize: '1.5rem',
                    marginBottom: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}>
                    <span style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '6px',
                        fontSize: '0.9rem'
                    }}>
                        {onlineOrders.length}
                    </span>
                    Online Orders
                </h2>
                <div style={{ display: 'grid', gap: '1rem' }}>
                    {onlineOrders.length === 0 ? (
                        <div style={{
                            background: 'white',
                            padding: '2rem',
                            borderRadius: '8px',
                            textAlign: 'center',
                            color: '#999'
                        }}>
                            No online orders yet
                        </div>
                    ) : (
                        onlineOrders.map(order => (
                            <OrderCard key={order.id} order={order} />
                        ))
                    )}
                </div>
            </div>

            {/* Offline Orders Section */}
            <div>
                <h2 style={{
                    fontSize: '1.5rem',
                    marginBottom: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}>
                    <span style={{
                        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                        color: 'white',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '6px',
                        fontSize: '0.9rem'
                    }}>
                        {offlineOrders.length}
                    </span>
                    Offline Orders
                </h2>
                <div style={{ display: 'grid', gap: '1rem' }}>
                    {offlineOrders.length === 0 ? (
                        <div style={{
                            background: 'white',
                            padding: '2rem',
                            borderRadius: '8px',
                            textAlign: 'center',
                            color: '#999'
                        }}>
                            No offline orders yet
                        </div>
                    ) : (
                        offlineOrders.map(order => (
                            <OrderCard key={order.id} order={order} />
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}

// Order Card Component
function OrderCard({ order }: { order: OrderWithRelations }) {
    const statusColors: Record<string, string> = {
        PENDING: '#ff9800',
        PAID: '#2196f3',
        PROCESSING: '#2196f3',
        SHIPPED: '#9c27b0',
        DELIVERED: '#4caf50',
        COMPLETED: '#4caf50',
        CANCELLED: '#f44336',
    }

    const orderTypeColor = order.orderType === 'ONLINE' ? '#667eea' : '#f5576c'

    return (
        <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            border: '1px solid #f0f0f0',
            transition: 'all 0.3s ease'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                        <strong style={{ fontSize: '1.1rem' }}>Order #{order.id.slice(-6)}</strong>
                        <span style={{
                            background: orderTypeColor,
                            color: 'white',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            textTransform: 'uppercase'
                        }}>
                            {order.orderType}
                        </span>
                        <span style={{
                            background: statusColors[order.status],
                            color: 'white',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            fontWeight: '600'
                        }}>
                            {order.status}
                        </span>
                    </div>
                    <div style={{ color: '#666', fontSize: '0.9rem' }}>
                        Customer: {order.user.name} ({order.user.email})
                    </div>
                    <div style={{ color: '#999', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                        {new Date(order.createdAt).toLocaleString()}
                    </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '1.5rem', color: '#333' }}>
                        ${order.total.toFixed(2)}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.25rem' }}>
                        GST: ${(order.total * 0.1).toFixed(2)}
                    </div>
                </div>
            </div>

            {order.note && (
                <div style={{
                    marginBottom: '1rem',
                    padding: '0.75rem',
                    background: '#f9f9f9',
                    borderRadius: '6px',
                    borderLeft: '3px solid #667eea'
                }}>
                    <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.25rem' }}>Order Note:</div>
                    <div style={{ fontStyle: 'italic', color: '#333' }}>{order.note}</div>
                </div>
            )}

            <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.5rem', color: '#666' }}>
                    Order Items:
                </div>
                {order.items.map((item) => (
                    <div key={item.id} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        borderBottom: '1px solid #f0f0f0',
                        padding: '0.5rem 0',
                        fontSize: '0.95rem'
                    }}>
                        <span>{item.product.name} × {item.quantity}</span>
                        <span style={{ fontWeight: '600' }}>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                ))}
            </div>


            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {/* Status Update Buttons */}
                <form action={updateOrderStatus.bind(null, order.id, 'PENDING')}>
                    <button
                        disabled={order.status === 'PENDING'}
                        style={{
                            padding: '0.6rem 1rem',
                            cursor: order.status === 'PENDING' ? 'not-allowed' : 'pointer',
                            background: order.status === 'PENDING' ? '#ddd' : '#ff9800',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontWeight: '600',
                            fontSize: '0.9rem',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        Mark Pending
                    </button>
                </form>
                <form action={updateOrderStatus.bind(null, order.id, 'COMPLETED')}>
                    <button
                        disabled={order.status === 'COMPLETED'}
                        style={{
                            padding: '0.6rem 1rem',
                            cursor: order.status === 'COMPLETED' ? 'not-allowed' : 'pointer',
                            background: order.status === 'COMPLETED' ? '#ddd' : '#4caf50',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontWeight: '600',
                            fontSize: '0.9rem',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        Mark Completed
                    </button>
                </form>
                <form action={updateOrderStatus.bind(null, order.id, 'CANCELLED')}>
                    <button
                        disabled={order.status === 'CANCELLED'}
                        style={{
                            padding: '0.6rem 1rem',
                            cursor: order.status === 'CANCELLED' ? 'not-allowed' : 'pointer',
                            background: order.status === 'CANCELLED' ? '#ddd' : '#f44336',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontWeight: '600',
                            fontSize: '0.9rem',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        Cancel Order
                    </button>
                </form>

                {/* Divider */}
                <div style={{ width: '1px', background: '#ddd', margin: '0 0.25rem' }}></div>

                {/* Order Type Toggle Buttons */}
                <form action={updateOrderType.bind(null, order.id, 'ONLINE')}>
                    <button
                        disabled={order.orderType === 'ONLINE'}
                        style={{
                            padding: '0.6rem 1rem',
                            cursor: order.orderType === 'ONLINE' ? 'not-allowed' : 'pointer',
                            background: order.orderType === 'ONLINE' ? '#ddd' : '#667eea',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontWeight: '600',
                            fontSize: '0.9rem',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        Set Online
                    </button>
                </form>
                <form action={updateOrderType.bind(null, order.id, 'OFFLINE')}>
                    <button
                        disabled={order.orderType === 'OFFLINE'}
                        style={{
                            padding: '0.6rem 1rem',
                            cursor: order.orderType === 'OFFLINE' ? 'not-allowed' : 'pointer',
                            background: order.orderType === 'OFFLINE' ? '#ddd' : '#f5576c',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontWeight: '600',
                            fontSize: '0.9rem',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        Set Offline
                    </button>
                </form>
            </div>
        </div>
    )
}
