import styles from './admin.module.css'
import Link from 'next/link'
import { logout } from '@/app/actions/auth'

import { auth } from "@/auth"

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await auth()
    const role = session?.user?.role
    const isOwner = role === 'OWNER'
    const isAdmin = role === 'ADMIN' || isOwner
    const isManager = role === 'MANAGER'

    return (
        <div className={styles.container}>
            <aside className={styles.sidebar}>
                <div className={styles.sidebarTitle}>Admin Panel</div>
                <nav className={styles.nav}>
                    {(isAdmin || isManager) && <Link href="/admin" className={styles.navLink}>Dashboard</Link>}

                    {(isAdmin || isManager || role === 'STAFF') && (
                        <>
                            <Link href="/admin/products" className={styles.navLink}>Products</Link>
                            <Link href="/admin/types" className={styles.navLink}>Types</Link>
                        </>
                    )}

                    {(isAdmin || isManager) && (
                        <>
                            <Link href="/admin/orders" className={styles.navLink}>Orders</Link>
                            <Link href="/admin/users" className={styles.navLink}>Users</Link>
                            <Link href="/admin/staff" className={styles.navLink}>Staff</Link>
                            <Link href="/admin/settings" className={styles.navLink}>Settings</Link>
                        </>
                    )}

                    {(isAdmin || isManager) && (
                        <Link href="/admin/finance" className={styles.navLink}>Finance</Link>
                    )}

                    <form action={logout} style={{ marginTop: '1rem', borderTop: '1px solid #444', paddingTop: '1rem' }}>
                        <button className={styles.navLogoutButton}>Logout</button>
                    </form>
                </nav>
            </aside>
            <main className={styles.main}>
                <header className={styles.header}>
                    <h2>Welcome, {session?.user?.name || 'Admin'}</h2>
                </header>
                {children}
            </main>
        </div>
    )
}
