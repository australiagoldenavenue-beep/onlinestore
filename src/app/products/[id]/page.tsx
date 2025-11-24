import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { auth } from "@/auth"
import AddToCartButton from "./AddToCartButton"
import styles from './product.module.css'

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const session = await auth()
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
        </div>
    )
}
