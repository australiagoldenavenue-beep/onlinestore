import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import styles from './profile.module.css'

export const dynamic = 'force-dynamic'

export default async function ProfilePage() {
    const session = await auth()
    if (!session?.user) redirect('/login')

    const reviews = await prisma.comment.findMany({
        where: { userId: session.user.id },
        include: { product: true },
        orderBy: { createdAt: 'desc' }
    })

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.avatar}>
                    {session.user.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className={styles.userInfo}>
                    <h1 className={styles.userName}>{session.user.name}</h1>
                    <div className={styles.userEmail}>{session.user.email}</div>
                    <div className={styles.userDetails}>
                        <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>Address</span>
                            <span className={styles.detailValue}>{session.user.address || 'Not set'}</span>
                        </div>
                        <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>Phone</span>
                            <span className={styles.detailValue}>{session.user.phoneNumber || 'Not set'}</span>
                        </div>
                    </div>
                </div>
            </div>

            <h2 className={styles.reviewsTitle}>
                <span>⭐</span> My Reviews
            </h2>

            <div className={styles.reviewsList}>
                {reviews.length > 0 ? (
                    reviews.map(review => (
                        <div key={review.id} className={styles.reviewCard}>
                            <div className={styles.reviewHeader}>
                                <span className={styles.reviewProduct}>{review.product.name}</span>
                                <span className={styles.reviewDate}>
                                    {review.createdAt.toLocaleDateString()}
                                </span>
                            </div>
                            <p className={styles.reviewContent}>{review.content}</p>
                        </div>
                    ))
                ) : (
                    <div className={styles.noReviews}>
                        <p>You haven&apos;t posted any reviews yet.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
