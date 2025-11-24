'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './Navbar.module.css'

type NavbarProps = {
    session: any
    businessName: string
    logoutAction: any
}

export default function ClientNavbar({ session, businessName, logoutAction }: NavbarProps) {
    const [isVisible, setIsVisible] = useState(true)
    const [lastScrollY, setLastScrollY] = useState(0)
    const pathname = usePathname()

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY

            // Show navbar when at top or scrolling up, hide when scrolling down
            if (currentScrollY < lastScrollY || currentScrollY < 10) {
                setIsVisible(true)
            } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
                setIsVisible(false)
            }

            setLastScrollY(currentScrollY)
        }

        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [lastScrollY])

    return (
        <nav className={`${styles.navbar} ${!isVisible ? styles.navbarHidden : ''}`}>
            <div className={styles.container}>
                <Link href="/" className={styles.logo}>
                    🛍️ {businessName}
                </Link>

                <div className={styles.links}>
                    <Link href="/" className={styles.link}>Home</Link>
                    <Link href="/products" className={styles.link}>Products</Link>
                    <Link href="/reviews" className={styles.link}>Review</Link>

                    {session ? (
                        <>
                            <Link href="/chat" className={styles.link}>Chat</Link>
                            <Link href="/profile" className={styles.link}>Review</Link>
                            {session.user?.role === 'ADMIN' && (
                                <Link href="/admin" className={styles.link}>Admin</Link>
                            )}
                            <div className={styles.userMenu}>
                                <Link href="/profile" className={styles.userName}>👤 {session.user?.name || 'User'}</Link>
                                <form action={logoutAction} className={styles.logoutForm}>
                                    <button type="submit" className={styles.logoutButton}>
                                        Logout
                                    </button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <>
                            <Link href="/review" className={styles.link}>Review</Link>
                            <Link href="/contact" className={styles.link}>Contact Us</Link>
                            <Link href="/policy" className={styles.link}>Policy</Link>
                            <Link href="/login" className={styles.loginButton}>Login</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    )
}
