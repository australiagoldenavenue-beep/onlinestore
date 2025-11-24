import { prisma } from "@/lib/prisma"
import ProductTypeForm from "./ProductTypeForm"
import { deleteProductType } from "@/app/actions/productTypes"

export const dynamic = 'force-dynamic'

export default async function AdminTypesPage() {
    const types = await prisma.productType.findMany({
        orderBy: { createdAt: 'desc' },
        include: { _count: { select: { products: true } } }
    })

    async function deleteType(formData: FormData) {
        'use server'
        const id = formData.get('id') as string
        await deleteProductType(id)
    }

    return (
        <div>
            <h1>Manage Product Types</h1>
            <ProductTypeForm />
            <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}>
                <thead>
                    <tr style={{ borderBottom: '1px solid #ddd', textAlign: 'left' }}>
                        <th style={{ padding: '1rem' }}>Image</th>
                        <th style={{ padding: '1rem' }}>Name</th>
                        <th style={{ padding: '1rem' }}>Products Count</th>
                        <th style={{ padding: '1rem' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {types.map(type => (
                        <tr key={type.id} style={{ borderBottom: '1px solid #eee' }}>
                            <td style={{ padding: '1rem' }}>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                {type.imageUrl && <img src={type.imageUrl} alt={type.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />}
                            </td>
                            <td style={{ padding: '1rem' }}>{type.name}</td>
                            <td style={{ padding: '1rem' }}>{type._count.products}</td>
                            <td style={{ padding: '1rem' }}>
                                <form action={deleteType}>
                                    <input type="hidden" name="id" value={type.id} />
                                    <button
                                        style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer' }}
                                        disabled={type._count.products > 0}
                                        title={type._count.products > 0 ? "Cannot delete type with products" : "Delete type"}
                                    >
                                        Delete
                                    </button>
                                </form>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
