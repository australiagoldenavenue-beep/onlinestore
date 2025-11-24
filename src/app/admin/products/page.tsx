import { prisma } from "@/lib/prisma"
import ProductForm from "./ProductForm"

export const dynamic = 'force-dynamic'

export default async function AdminProductsPage() {
    const products = await prisma.product.findMany({
        orderBy: { createdAt: 'desc' },
        include: { type: true },
        take: 50 // Limit to prevent memory crash
    })
    const types = await prisma.productType.findMany()

    async function deleteProduct(formData: FormData) {
        'use server'
        const id = formData.get('id') as string
        await prisma.product.delete({ where: { id } })
    }

    return (
        <div>
            <h1>Manage Products</h1>
            <ProductForm types={types} />
            <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}>
                <thead>
                    <tr style={{ borderBottom: '1px solid #ddd', textAlign: 'left' }}>
                        <th style={{ padding: '1rem' }}>Name</th>
                        <th style={{ padding: '1rem' }}>Type</th>
                        <th style={{ padding: '1rem' }}>Price</th>
                        <th style={{ padding: '1rem' }}>Stock</th>
                        <th style={{ padding: '1rem' }}>Status</th>
                        <th style={{ padding: '1rem' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(product => (
                        <tr key={product.id} style={{ borderBottom: '1px solid #eee' }}>
                            <td style={{ padding: '1rem' }}>{product.name}</td>
                            <td style={{ padding: '1rem' }}>{product.type?.name || '-'}</td>
                            <td style={{ padding: '1rem' }}>${product.price}</td>
                            <td style={{ padding: '1rem' }}>{product.stock}</td>
                            <td style={{ padding: '1rem' }}>
                                {product.isOutOfStock ? (
                                    <span style={{ color: 'red' }}>Out of Stock</span>
                                ) : (
                                    <span style={{ color: 'green' }}>In Stock</span>
                                )}
                                {product.outOfStockNote && <div style={{ fontSize: '0.8rem', color: '#666' }}>{product.outOfStockNote}</div>}
                            </td>
                            <td style={{ padding: '1rem' }}>
                                <form action={deleteProduct}>
                                    <input type="hidden" name="id" value={product.id} />
                                    <button style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer' }}>Delete</button>
                                </form>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
