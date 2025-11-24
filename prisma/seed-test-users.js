/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Seeding database...')

    // Create test users for each role
    const users = [
        {
            name: 'Owner Account',
            email: 'owner@store.com',
            password: await bcrypt.hash('password123', 10),
            role: 'OWNER',
        },
        {
            name: 'Admin Account',
            email: 'admin@store.com',
            password: await bcrypt.hash('password123', 10),
            role: 'ADMIN',
        },
        {
            name: 'Manager Account',
            email: 'manager@store.com',
            password: await bcrypt.hash('password123', 10),
            role: 'MANAGER',
        },
        {
            name: 'Staff Test',
            email: 'staff@test.com',
            password: await bcrypt.hash('password123', 10),
            role: 'STAFF',
        },
        {
            name: 'Regular User',
            email: 'user@test.com',
            password: await bcrypt.hash('password123', 10),
            role: 'USER',
        },
    ]

    for (const userData of users) {
        const existing = await prisma.user.findUnique({
            where: { email: userData.email }
        })

        if (!existing) {
            const user = await prisma.user.create({
                data: userData
            })
            console.log(`✅ Created ${userData.role}: ${userData.email}`)

            // Create staff profile for STAFF users
            if (userData.role === 'STAFF') {
                await prisma.staffProfile.create({
                    data: {
                        userId: user.id,
                        hourlyRate: 25.00,
                        phoneNumber: '+61 400 000 000',
                        address: '123 Test Street, Sydney NSW 2000',
                        tfn: '123 456 789',
                        bankAccount: '123-456 12345678',
                        passportNumber: 'P1234567',
                        visaType: 'Australian Citizen',
                    }
                })
                console.log(`   📋 Created staff profile for ${user.name}`)
            }
        } else {
            console.log(`⏭️  Skipped ${userData.role}: ${userData.email} (already exists)`)
        }
    }

    // Create sample product type
    const existingType = await prisma.productType.findUnique({
        where: { name: 'Electronics' }
    })

    if (!existingType) {
        await prisma.productType.create({
            data: {
                name: 'Electronics',
                imageUrl: null,
            }
        })
        console.log('✅ Created product type: Electronics')
    }

    // Create sample products
    const sampleProducts = [
        {
            name: 'Laptop Computer',
            description: 'High-performance laptop for work and gaming',
            price: 1299.99,
            stock: 10,
            isOutOfStock: false,
        },
        {
            name: 'Wireless Mouse',
            description: 'Ergonomic wireless mouse with long battery life',
            price: 29.99,
            stock: 50,
            isOutOfStock: false,
        },
        {
            name: 'USB-C Cable',
            description: 'Fast charging USB-C cable, 2 meters',
            price: 15.99,
            stock: 0,
            isOutOfStock: true,
            outOfStockNote: 'Back in stock next week',
        },
    ]

    for (const productData of sampleProducts) {
        const existing = await prisma.product.findFirst({
            where: { name: productData.name }
        })

        if (!existing) {
            await prisma.product.create({
                data: productData
            })
            console.log(`✅ Created product: ${productData.name}`)
        }
    }

    console.log('\n✨ Seeding complete!')
    console.log('\n📝 Test Credentials:')
    console.log('━'.repeat(50))
    console.log('OWNER:   owner@store.com   / password123')
    console.log('ADMIN:   admin@store.com   / password123')
    console.log('MANAGER: manager@store.com / password123')
    console.log('STAFF:   staff@test.com    / password123')
    console.log('USER:    user@test.com     / password123')
    console.log('━'.repeat(50))
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
