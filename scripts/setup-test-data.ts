import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    // Create Admin User
    const hashedPassword = await bcrypt.hash('password123', 10)
    const admin = await prisma.user.upsert({
        where: { email: 'admin@example.com' },
        update: {
            password: hashedPassword,
            role: 'ADMIN',
        },
        create: {
            email: 'admin@example.com',
            password: hashedPassword,
            name: 'Admin User',
            role: 'ADMIN',
            address: 'Admin HQ',
            phoneNumber: '0000000000',
        },
    })
    console.log('Admin user created/updated:', admin.email)

    // Reset Products Stock
    const products = await prisma.product.findMany()
    for (const product of products) {
        if (product.name !== 'Running Shoes') { // Keep Running Shoes out of stock for testing
            await prisma.product.update({
                where: { id: product.id },
                data: {
                    stock: 50,
                    isOutOfStock: false,
                },
            })
            console.log(`Restocked: ${product.name}`)
        } else {
            await prisma.product.update({
                where: { id: product.id },
                data: {
                    stock: 0,
                    isOutOfStock: true,
                },
            })
            console.log(`Ensured out of stock: ${product.name}`)
        }
    }
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
