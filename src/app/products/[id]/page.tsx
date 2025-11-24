import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { auth } from "@/auth"
import AddToCartButton from "./AddToCartButton"
import styles from './product.module.css'
import CommentForm from "./CommentForm"
import { deleteComment } from "@/app/actions/comments"

export const dynamic = 'force-dynamic'

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const session = await auth()
    const isOwner = session?.user?.role === 'OWNER' || session?.user?.role === 'MANAGER'

    const product = await prisma.product.findUnique({
        where: { id },
        include: { comments: { include: { user: true }, orderBy: { createdAt: 'desc' } } }
    })

    if (!product) notFound()

    return (
        <div className={styles.container}>
            <div className={styles.productSection}>
                <div className={styles.imageSection}>
                    <div className={styles.imageContainer}>
                        {product.imageUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={product.imageUrl} alt={product.name} className={styles.image} />
                        ) : (
                            <div className={styles.noImage}>
                                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                    <circle cx="8.5" cy="8.5" r="1.5" />
                                    <polyline points="21 15 16 10 5 21" />
                                </svg>
                                <span>No Image Available</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className={styles.details}>
                    <h1 className={styles.productName}>{product.name}</h1>
                    <p className={styles.price}>${product.price.toFixed(2)}</p>

                    <div className={styles.divider}></div>

                    <div className={styles.infoSection}>
                        <h3 className={styles.sectionTitle}>Description</h3>
                        <p className={styles.description}>{product.description}</p>
                    </div>

                    <div className={styles.divider}></div>

                    <AddToCartButton product={product} />

                    {product.isOutOfStock && (
                        <div className={styles.outOfStockNote}>
                            <p>{product.outOfStockNote || 'This product is currently out of stock.'}</p>
                        </div>
                    )}
                </div>
            </div>

            <div className={styles.reviewsSection}>
                <h2 className={styles.reviewsTitle}>Customer Reviews</h2>

                {session ? (
                    <CommentForm productId={product.id} />
                ) : (
                    <div className={styles.loginPrompt}>
                        <p>Please <a href="/login">log in</a> to leave a review.</p>
                    </div>
                )}

                <div className={styles.commentsList}>
                    {product.comments.length > 0 ? (
                        product.comments.map((comment) => (
                            <div key={comment.id} className={styles.commentCard}>
                                <div className={styles.commentHeader}>
                                    <div className={styles.userInfo}>
                                        <div className={styles.avatar}>
                                            {comment.user.name?.charAt(0).toUpperCase() || 'U'}
                                        </div>
                                        <div>
                                            <span className={styles.userName}>{comment.user.name || 'Anonymous'}</span>
                                            <span className={styles.commentDate}>
                                                {comment.createdAt.toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                    {isOwner && (
                                        <form action={deleteComment.bind(null, comment.id, product.id)}>
                                            <button
                                                type="submit"
                                                style={{
                                                    background: 'none',
                                                    border: 'none',
                                                    color: '#ef4444',
                                                    cursor: 'pointer',
                                                    fontSize: '0.9rem',
                                                    padding: '0.25rem 0.5rem',
                                                    borderRadius: '4px',
                                                    fontWeight: '500'
                                                }}
                                                title="Delete Review"
                                            >
                                                Delete
                                            </button>
                                        </form>
                                    )}
                                </div>
                                <p className={styles.commentContent}>{comment.content}</p>
                            </div>
                        ))
                    ) : (
                        <div className={styles.noComments}>
                            <p>No reviews yet. Be the first to share your thoughts!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
