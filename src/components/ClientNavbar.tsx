'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

import styles from './Navbar.module.css'

import { Session } from 'next-auth'

type NavbarProps = {
    session: Session | null
    businessName: string
    logoutAction: () => Promise<void>
}

export default function ClientNavbar({ session, businessName, logoutAction }: NavbarProps) {
    const [isVisible, setIsVisible] = useState(true)
    const [lastScrollY, setLastScrollY] = useState(0)


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
                            <Link href="/cart" className={styles.link}>Cart</Link>
                            <Link href="/chat" className={styles.link}>Community</Link>
                            <Link href="/orders" className={styles.link}>Order History</Link>
                            {(session.user?.role === 'ADMIN' || session.user?.role === 'OWNER' || session.user?.role === 'MANAGER') && (
                                <Link href="/admin" className={styles.link}>{session.user?.name || 'Admin'}</Link>
                            )}
                            <div className={styles.userMenu}>
                                {!(session.user?.role === 'ADMIN' || session.user?.role === 'OWNER' || session.user?.role === 'MANAGER') && (
                                    <Link href="/profile" className={styles.userName}>👤 {session.user?.name || 'User'}</Link>
                                )}
                                <form action={logoutAction} className={styles.logoutForm}>
                                    <button type="submit" className={styles.logoutButton}>
                                        Logout
                                    </button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <>
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
