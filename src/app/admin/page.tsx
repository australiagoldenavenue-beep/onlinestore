import { prisma } from "@/lib/prisma"

export default async function AdminDashboard() {
    const [userCount, productCount, orderCount] = await Promise.all([
        prisma.user.count(),
        prisma.product.count(),
        prisma.order.count(),
    ])

    return (
        <div>
            <h1>Dashboard</h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginTop: '1rem' }}>
                <div style={{ padding: '1rem', background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <h3>Users</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{userCount}</p>
                </div>
                <div style={{ padding: '1rem', background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <h3>Products</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{productCount}</p>
                </div>
                <div style={{ padding: '1rem', background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <h3>Orders</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{orderCount}</p>
                </div>
            </div>
        </div>
    )
}
