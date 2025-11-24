import { prisma } from "@/lib/prisma"
import ProductCard from "@/components/ProductCard"
import styles from './products.module.css'

export default async function ProductsPage() {
    const products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } })

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Our Products</h1>
                <p className={styles.subtitle}>Discover our amazing collection of quality products</p>
            </div>

            <div className={styles.productGrid}>
                {products.length > 0 ? (
                    products.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))
                ) : (
                    <div className={styles.noProducts}>
                        <p>No products available at the moment.</p>
                        <p style={{ fontSize: '0.95rem', marginTop: '0.5rem', color: '#bbb' }}>Check back soon!</p>
                    </div>
                )}
            </div>
        </div>
    )
}
