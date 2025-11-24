import { prisma } from "@/lib/prisma"
import ProductCard from "@/components/ProductCard"
import styles from './products.module.css'
import Link from 'next/link'

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
    const { type } = await searchParams

    const where = type ? { type: { name: type } } : {}

    const products = await prisma.product.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: 50 // Limit to prevent memory crash
    })

    const types = await prisma.productType.findMany()

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Our Products</h1>
                <p className={styles.subtitle}>Discover our amazing collection of quality products</p>
            </div>

            <div className={styles.filterSection}>
                <Link
                    href="/products"
                    className={`${styles.filterButton} ${!type ? styles.filterButtonActive : ''}`}
                >
                    All
                </Link>
                {types.map(t => (
                    <Link
                        key={t.id}
                        href={`/products?type=${t.name}`}
                        className={`${styles.filterButton} ${type === t.name ? styles.filterButtonActive : ''}`}
                    >
                        {t.name}
                    </Link>
                ))}
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
