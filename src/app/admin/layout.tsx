import styles from './admin.module.css'
import Link from 'next/link'
import { logout } from '@/app/actions/auth'

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className={styles.container}>
            <aside className={styles.sidebar}>
                <div className={styles.sidebarTitle}>Admin Panel</div>
                <nav className={styles.nav}>
                    <Link href="/admin" className={styles.navLink}>Dashboard</Link>
                    <Link href="/admin/products" className={styles.navLink}>Products</Link>
                    <Link href="/admin/orders" className={styles.navLink}>Orders</Link>
                    <Link href="/admin/users" className={styles.navLink}>Users</Link>
                    <Link href="/admin/settings" className={styles.navLink}>Settings</Link>
                </nav>
            </aside>
            <main className={styles.main}>
                <header className={styles.header}>
                    <h2>Welcome, Admin</h2>
                    <form action={logout}>
                        <button className={styles.logoutButton}>Logout</button>
                    </form>
                </header>
                {children}
            </main>
        </div>
    )
}
