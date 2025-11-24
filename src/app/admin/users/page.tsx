import { prisma } from "@/lib/prisma"
import CreateUserForm from "./CreateUserForm"
import ChangePasswordForm from "./ChangePasswordForm"
import { deleteUser } from "@/app/actions/users"

import { auth } from "@/auth"

import { redirect } from "next/navigation"

export const dynamic = 'force-dynamic'

export default async function AdminUsersPage() {
    const session = await auth()
    const role = session?.user?.role
    const isOwner = role === 'OWNER'
    const isAdmin = role === 'ADMIN' || isOwner
    const isManager = role === 'MANAGER'

    if (!isAdmin && !isManager) {
        redirect('/admin')
    }

    const users = await prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        include: { _count: { select: { orders: true } } },
        take: 50 // Limit to prevent memory crash
    })

    return (
        <div>
            <h1>User Management</h1>
            {isAdmin && <CreateUserForm />}

            <div style={{ background: 'white', padding: '1rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <h3>All Users</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid #ddd', textAlign: 'left' }}>
                            <th style={{ padding: '0.5rem' }}>Name</th>
                            <th style={{ padding: '0.5rem' }}>Email</th>
                            <th style={{ padding: '0.5rem' }}>Role</th>
                            <th style={{ padding: '0.5rem' }}>Orders</th>
                            <th style={{ padding: '0.5rem' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '0.5rem' }}>{user.name}</td>
                                <td style={{ padding: '0.5rem' }}>{user.email}</td>
                                <td style={{ padding: '0.5rem' }}>
                                    <span style={{
                                        padding: '0.25rem 0.5rem',
                                        borderRadius: '4px',
                                        fontSize: '0.8rem',
                                        background: user.role === 'ADMIN' ? '#e3f2fd' : user.role === 'STAFF' ? '#fff3e0' : user.role === 'MANAGER' ? '#e8f5e9' : '#f5f5f5',
                                        color: user.role === 'ADMIN' ? '#1565c0' : user.role === 'STAFF' ? '#ef6c00' : user.role === 'MANAGER' ? '#2e7d32' : '#616161'
                                    }}>
                                        {user.role}
                                    </span>
                                </td>
                                <td style={{ padding: '0.5rem' }}>{user._count.orders}</td>
                                <td style={{ padding: '0.5rem' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <ChangePasswordForm userId={user.id} />

                                        {/* Delete Button Logic */}
                                        {/* Owner can delete anyone (except maybe themselves, handled by UI or backend if needed) */}
                                        {/* Admin can delete USER, STAFF, MANAGER but NOT ADMIN or OWNER */}
                                        {(isOwner || isManager || (isAdmin && user.role !== 'ADMIN' && user.role !== 'OWNER' && user.role !== 'MANAGER')) && (
                                            <form action={deleteUser}>
                                                <input type="hidden" name="id" value={user.id} />
                                                <button style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.8rem', textAlign: 'left', padding: 0 }}>
                                                    Delete User
                                                </button>
                                            </form>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
