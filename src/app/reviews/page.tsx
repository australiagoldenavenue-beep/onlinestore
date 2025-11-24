import { prisma } from '@/lib/prisma'


import styles from './reviews.module.css'

export const dynamic = 'force-dynamic'

export default async function ReviewsPage() {


    // Get all reviews with user and product information
    const reviews = await prisma.comment.findMany({
        include: {
            user: {
                select: {
                    name: true,
                    email: true
                }
            },
            product: {
                select: {
                    name: true,
                    imageUrl: true
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        },
        take: 50 // Limit to prevent memory crash
    })

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Customer Reviews</h1>
                <p className={styles.subtitle}>See what our customers are saying about our products</p>
            </div>



            <div className={styles.reviewsGrid}>
                {reviews.length === 0 ? (
                    <div className={styles.emptyState}>
                        <p>No reviews yet. Be the first to share your thoughts!</p>
                    </div>
                ) : (
                    reviews.map((review) => (
                        <div key={review.id} className={styles.reviewCard}>
                            <div className={styles.reviewHeader}>
                                <div className={styles.productInfo}>
                                    {review.product.imageUrl && (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={review.product.imageUrl}
                                            alt={review.product.name}
                                            className={styles.productImage}
                                        />
                                    )}
                                    <div>
                                        <h3 className={styles.productName}>{review.product.name}</h3>
                                        <p className={styles.reviewerName}>by {review.user.name || 'Anonymous'}</p>
                                    </div>
                                </div>
                                <span className={styles.reviewDate}>
                                    {new Date(review.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <p className={styles.reviewContent}>{review.content}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
