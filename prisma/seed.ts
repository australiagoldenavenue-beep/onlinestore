import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    // Create Product Types
    const electronics = await prisma.productType.upsert({
        where: { name: 'Electronics' },
        update: {},
        create: { name: 'Electronics' },
    })

    const clothing = await prisma.productType.upsert({
        where: { name: 'Clothing' },
        update: {},
        create: { name: 'Clothing' },
    })

    // Create Sample Products
    await prisma.product.create({
        data: {
            name: 'Wireless Headphones',
            description: 'High-quality noise cancelling headphones.',
            price: 199.99,
            stock: 50,
            imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D',
            typeId: electronics.id,
        },
    })

    await prisma.product.create({
        data: {
            name: 'Smart Watch',
            description: 'Track your fitness and notifications.',
            price: 299.99,
            stock: 30,
            imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHByb2R1Y3R8ZW58MHx8MHx8fDA%3D',
            typeId: electronics.id,
        },
    })

    await prisma.product.create({
        data: {
            name: 'Classic T-Shirt',
            description: 'Comfortable cotton t-shirt.',
            price: 29.99,
            stock: 100,
            imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dCUyMHNoaXJ0fGVufDB8fDB8fHww',
            typeId: clothing.id,
        },
    })

    await prisma.product.create({
        data: {
            name: 'Running Shoes',
            description: 'Lightweight shoes for running.',
            price: 89.99,
            stock: 0,
            imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2hvZXN8ZW58MHx8MHx8fDA%3D',
            typeId: clothing.id,
            isOutOfStock: true,
            outOfStockNote: 'New stock arriving next week!',
        },
    })
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
