import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
    try {
        const session = await auth()

        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { productId, content } = await request.json()

        if (!productId || !content) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        const review = await prisma.comment.create({
            data: {
                content,
                userId: session.user.id,
                productId
            }
        })

        return NextResponse.json(review, { status: 201 })
    } catch (error) {
        console.error('Error creating review:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function GET() {
    try {
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

        return NextResponse.json(reviews)
    } catch (error) {
        console.error('Error fetching reviews:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
