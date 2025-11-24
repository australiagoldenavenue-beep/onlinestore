import { prisma } from "@/lib/prisma"

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
    const [userCount, productCount, totalOrders, processedOrders] = await Promise.all([
        prisma.user.count(),
        prisma.product.count(),
        prisma.order.count(),
        prisma.order.count({ where: { status: { in: ['PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'COMPLETED'] } } })
    ])

    const stats = [
        { label: 'Total Users', value: userCount, color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
        { label: 'Total Products', value: productCount, color: 'linear-gradient(135deg, #6B8DD6 0%, #8E37D7 100%)' },
        { label: 'Total Orders', value: totalOrders, color: 'linear-gradient(135deg, #FF9A9E 0%, #FECFEF 99%, #FECFEF 100%)' },
        { label: 'Orders Processed', value: processedOrders, color: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)' },
    ]

    return (
        <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#333' }}>Dashboard</h1>
            <p style={{ color: '#666', marginBottom: '2rem' }}>Overview of your store&apos;s performance</p>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '1.5rem'
            }}>
                {stats.map((stat, index) => (
                    <div key={index} style={{
                        padding: '1.5rem',
                        background: stat.color,
                        borderRadius: '16px',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                        color: 'white',
                        transition: 'transform 0.2s ease',
                    }}>
                        <h3 style={{
                            fontSize: '1rem',
                            fontWeight: '500',
                            opacity: 0.9,
                            marginBottom: '0.5rem'
                        }}>
                            {stat.label}
                        </h3>
                        <p style={{
                            fontSize: '2.5rem',
                            fontWeight: 'bold',
                            letterSpacing: '-0.025em'
                        }}>
                            {stat.value}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    )
}
