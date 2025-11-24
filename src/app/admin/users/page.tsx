import { prisma } from "@/lib/prisma"

export default async function UsersPage() {
    const users = await prisma.user.findMany({ orderBy: { createdAt: 'desc' } })

    return (
        <div>
            <h1>Users</h1>
            <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', marginTop: '1rem' }}>
                <thead>
                    <tr style={{ borderBottom: '1px solid #ddd', textAlign: 'left' }}>
                        <th style={{ padding: '1rem' }}>Name</th>
                        <th style={{ padding: '1rem' }}>Email</th>
                        <th style={{ padding: '1rem' }}>Address</th>
                        <th style={{ padding: '1rem' }}>Phone</th>
                        <th style={{ padding: '1rem' }}>Role</th>
                        <th style={{ padding: '1rem' }}>Joined</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id} style={{ borderBottom: '1px solid #eee' }}>
                            <td style={{ padding: '1rem' }}>{user.name}</td>
                            <td style={{ padding: '1rem' }}>{user.email}</td>
                            <td style={{ padding: '1rem' }}>{user.address || '-'}</td>
                            <td style={{ padding: '1rem' }}>{user.phoneNumber || '-'}</td>
                            <td style={{ padding: '1rem' }}>{user.role}</td>
                            <td style={{ padding: '1rem' }}>{user.createdAt.toLocaleDateString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
