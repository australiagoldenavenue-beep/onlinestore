import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { auth } from "@/auth"
import { redirect } from "next/navigation"

export const dynamic = 'force-dynamic'

export default async function StaffListPage() {
    const session = await auth()
    if (session?.user?.role !== 'ADMIN' && session?.user?.role !== 'OWNER' && session?.user?.role !== 'MANAGER') {
        redirect('/admin')
    }

    const staff = await prisma.user.findMany({
        where: { role: 'STAFF' },
        include: { staffProfile: true }
    })

    return (
        <div>
            <h1>Staff Management</h1>
            <div style={{ background: 'white', padding: '1rem', borderRadius: '8px', marginTop: '1rem' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>
                            <th style={{ padding: '0.5rem' }}>Staff Member</th>
                            <th style={{ padding: '0.5rem' }}>Email</th>
                            <th style={{ padding: '0.5rem' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {staff.map(user => (
                            <tr key={user.id} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '0.5rem' }}>
                                    <div>
                                        <strong>{user.name}</strong>
                                        <span style={{
                                            marginLeft: '0.5rem',
                                            padding: '0.25rem 0.5rem',
                                            background: '#e3f2fd',
                                            borderRadius: '4px',
                                            fontSize: '0.85rem',
                                            fontWeight: '600',
                                            color: '#1565c0'
                                        }}>
                                            ${user.staffProfile?.hourlyRate?.toFixed(2) || '0.00'}/hr
                                        </span>
                                    </div>
                                </td>
                                <td style={{ padding: '0.5rem' }}>{user.email}</td>
                                <td style={{ padding: '0.5rem' }}>
                                    <Link href={`/admin/staff/${user.id}`} style={{ color: 'blue', textDecoration: 'underline' }}>
                                        Manage
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {staff.length === 0 && <p style={{ padding: '1rem', textAlign: 'center' }}>No staff members found.</p>}
            </div>
        </div>
    )
}
