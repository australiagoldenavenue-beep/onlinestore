import Link from 'next/link'
import { Product } from '@prisma/client'
import styles from './ProductCard.module.css'

export default function ProductCard({ product }: { product: Product }) {
    return (
        <div className={styles.card}>
            <div className={styles.imageContainer}>
                {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name} className={styles.image} />
                ) : (
                    <div className={styles.noImage}>
                        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                            <circle cx="8.5" cy="8.5" r="1.5" />
                            <polyline points="21 15 16 10 5 21" />
                        </svg>
                        <span>No Image</span>
                    </div>
                )}
                {product.isOutOfStock && (
                    <div className={styles.badge}>Out of Stock</div>
                )}
            </div>
            <div className={styles.content}>
                <h3 className={styles.title}>{product.name}</h3>
                <p className={styles.description}>{product.description}</p>
                <div className={styles.footer}>
                    <div className={styles.priceContainer}>
                        <span className={styles.price}>${product.price.toFixed(2)}</span>

                    </div>
                    <Link href={`/products/${product.id}`} className={styles.button}>
                        View Details
                    </Link>
                </div>
            </div>
        </div>
    )
}
