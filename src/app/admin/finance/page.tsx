import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import AddRecordForm from "./AddRecordForm"
import { deleteFinanceRecord } from "@/app/actions/finance"

export const dynamic = 'force-dynamic'

export default async function FinancePage() {
    const session = await auth()
    const role = session?.user?.role
    if (role !== 'ADMIN' && role !== 'OWNER' && role !== 'MANAGER') {
        redirect('/admin')
    }

    // Fetch all completed orders
    const orders = await prisma.order.findMany({
        where: {
            status: {
                in: ['COMPLETED', 'PAID']
            }
        },
        orderBy: { createdAt: 'desc' },
        take: 500 // Limit to prevent memory crash, but allow enough for stats
    })

    // Fetch manual records
    const manualRecords = await prisma.financeRecord.findMany({
        orderBy: { date: 'desc' },
        take: 100 // Limit to prevent memory crash
    })

    // Group data by date and type
    type FinanceRow = {
        date: string
        type: 'Online Store' | 'Manual/Offline'
        orderCount: number
        grossSales: number
        income: number
        gst: number
        net: number
        details: { desc: string, amount: number, id?: string }[]
    }

    const rows: FinanceRow[] = []
    const dailyOnline: Record<string, FinanceRow> = {}

    // Process Online Orders
    orders.forEach(order => {
        const date = order.createdAt.toISOString().split('T')[0]
        if (!dailyOnline[date]) {
            dailyOnline[date] = {
                date,
                type: 'Online Store',
                orderCount: 0,
                grossSales: 0,
                income: 0,
                gst: 0,
                net: 0,
                details: []
            }
        }

        const orderTotal = order.total
        // Business Logic: Income is Total Sale
        const income = orderTotal

        // GST is 10% of total sale
        const gst = orderTotal * 0.10
        // Net income is total income - gst
        const net = income - gst

        dailyOnline[date].orderCount += 1
        dailyOnline[date].grossSales += orderTotal
        dailyOnline[date].income += income
        dailyOnline[date].gst += gst
        dailyOnline[date].net += net
    })

    // Add Online rows to main list
    Object.values(dailyOnline).forEach(row => rows.push(row))

    // Process Manual Records
    manualRecords.forEach(record => {
        const date = record.date.toISOString().split('T')[0]
        const amount = record.amount

        // Business Logic: GST is 10% of total sale (amount)
        // Net income is total income - gst
        let gst = 0
        let net = amount

        if (record.gstRate > 0) {
            gst = amount * record.gstRate // Typically 0.10
            net = amount - gst
        }

        rows.push({
            date,
            type: 'Manual/Offline',
            orderCount: record.orderCount,
            grossSales: amount,
            income: amount,
            gst: gst,
            net: net,
            details: [{
                desc: record.description || 'Manual Entry',
                amount: amount,
                id: record.id
            }]
        })
    })

    // Sort by date desc, then type
    rows.sort((a, b) => {
        if (a.date !== b.date) return b.date.localeCompare(a.date)
        return a.type.localeCompare(b.type)
    })

    return (
        <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '2rem' }}>Financial Management</h1>

            <AddRecordForm />

            <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ background: '#f8fafc' }}>
                        <tr>
                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#475569' }}>Date</th>
                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#475569' }}>Source</th>
                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#475569' }}>Orders</th>
                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#475569' }}>Gross Sales</th>
                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#475569' }}>Income (Rev)</th>
                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#475569' }}>GST</th>
                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#475569' }}>Net Income</th>
                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#475569' }}>Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.length > 0 ? (
                            rows.map((row, idx) => (
                                <tr key={idx} style={{ borderTop: '1px solid #e2e8f0', background: row.type === 'Online Store' ? '#fff' : '#fcfcfc' }}>
                                    <td style={{ padding: '1rem', color: '#1e293b' }}>{row.date}</td>
                                    <td style={{ padding: '1rem', color: '#1e293b' }}>
                                        <span style={{
                                            padding: '0.25rem 0.5rem',
                                            borderRadius: '4px',
                                            background: row.type === 'Online Store' ? '#dcfce7' : '#f3f4f6',
                                            color: row.type === 'Online Store' ? '#166534' : '#4b5563',
                                            fontSize: '0.85rem',
                                            fontWeight: '500'
                                        }}>
                                            {row.type}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem', color: '#1e293b' }}>{row.orderCount}</td>
                                    <td style={{ padding: '1rem', color: '#64748b' }}>${row.grossSales.toFixed(2)}</td>
                                    <td style={{ padding: '1rem', color: '#1e293b', fontWeight: '600' }}>${row.income.toFixed(2)}</td>
                                    <td style={{ padding: '1rem', color: '#64748b' }}>${row.gst.toFixed(2)}</td>
                                    <td style={{ padding: '1rem', color: '#10b981', fontWeight: '600' }}>${row.net.toFixed(2)}</td>
                                    <td style={{ padding: '1rem', fontSize: '0.85rem' }}>
                                        {row.details.length > 0 ? (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                                {row.details.map((item, i) => (
                                                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
                                                        <span style={{ color: '#666' }}>{item.desc}</span>
                                                        {item.id && (
                                                            <form action={deleteFinanceRecord.bind(null, item.id)}>
                                                                <button style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.8rem' }}>×</button>
                                                            </form>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <span style={{ color: '#999' }}>-</span>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={8} style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                                    No financial data available.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
