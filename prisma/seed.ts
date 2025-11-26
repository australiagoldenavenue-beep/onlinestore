import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    // Create Product Types
    const drink = await prisma.productType.upsert({
        where: { name: 'Drink' },
        update: {},
        create: { name: 'Drink' },
    })

    const food = await prisma.productType.upsert({
        where: { name: 'Food' },
        update: {},
        create: { name: 'Food' },
    })

    const snack = await prisma.productType.upsert({
        where: { name: 'Snack' },
        update: {},
        create: { name: 'Snack' },
    })

    // Create Sample Products
    await prisma.product.create({
        data: {
            name: 'Coca Cola',
            description: 'Refreshing cola drink.',
            price: 1.99,
            stock: 100,
            imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&auto=format&fit=crop&q=60',
            typeId: drink.id,
        },
    })

    await prisma.product.create({
        data: {
            name: 'Mineral Water',
            description: 'Pure mineral water.',
            price: 0.99,
            stock: 200,
            imageUrl: 'https://images.unsplash.com/photo-1560023907-5f339617ea30?w=500&auto=format&fit=crop&q=60',
            typeId: drink.id,
        },
    })

    await prisma.product.create({
        data: {
            name: 'Beef Steak',
            description: 'Premium cut beef steak.',
            price: 25.99,
            stock: 20,
            imageUrl: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=500&auto=format&fit=crop&q=60',
            typeId: food.id,
        },
    })

    await prisma.product.create({
        data: {
            name: 'Pork Chops',
            description: 'Juicy pork chops.',
            price: 15.99,
            stock: 30,
            imageUrl: 'https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=500&auto=format&fit=crop&q=60',
            typeId: food.id,
        },
    })

    await prisma.product.create({
        data: {
            name: 'Potato Chips',
            description: 'Crispy potato chips.',
            price: 2.99,
            stock: 50,
            imageUrl: 'https://images.unsplash.com/photo-1566478919030-26174450f271?w=500&auto=format&fit=crop&q=60',
            typeId: snack.id,
        },
    })

    await prisma.product.create({
        data: {
            name: 'Chocolate Bar',
            description: 'Delicious milk chocolate.',
            price: 1.49,
            stock: 0,
            imageUrl: 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=500&auto=format&fit=crop&q=60',
            typeId: snack.id,
            isOutOfStock: true,
            outOfStockNote: 'Restocking soon!',
        },
    })
    // Create Users
    const passwordHash = await bcrypt.hash('admin123', 10)
    const userPasswordHash = await bcrypt.hash('test123', 10)

    await prisma.user.upsert({
        where: { email: 'admin@example.com' },
        update: { role: 'ADMIN', password: passwordHash },
        create: {
            email: 'admin@example.com',
            name: 'Admin User',
            password: passwordHash,
            role: 'ADMIN',
        },
    })

    await prisma.user.upsert({
        where: { email: 'test@example.com' },
        update: { role: 'USER', password: userPasswordHash },
        create: {
            email: 'test@example.com',
            name: 'Test User',
            password: userPasswordHash,
            role: 'USER',
        },
    })

    const ownerPasswordHash = await bcrypt.hash('owner123', 10)
    await prisma.user.upsert({
        where: { email: 'owner@example.com' },
        update: { role: 'OWNER', password: ownerPasswordHash },
        create: {
            email: 'owner@example.com',
            name: 'Owner User',
            password: ownerPasswordHash,
            role: 'OWNER',
        },
    })

    const managerPasswordHash = await bcrypt.hash('manager123', 10)
    await prisma.user.upsert({
        where: { email: 'manager@example.com' },
        update: { role: 'MANAGER', password: managerPasswordHash },
        create: {
            email: 'manager@example.com',
            name: 'Manager User',
            password: managerPasswordHash,
            role: 'MANAGER',
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
