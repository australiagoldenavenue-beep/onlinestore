import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
        const products = await prisma.product.findMany({
            select: {
                id: true,
                name: true
            },
            orderBy: {
                name: 'asc'
            },
            take: 50 // Limit to prevent memory crash
        })

        return NextResponse.json(products)
    } catch (error) {
        console.error('Error fetching products:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
