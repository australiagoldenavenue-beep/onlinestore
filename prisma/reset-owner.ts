
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    const email = 'australia.golden.avenue@gmail.com'
    const password = 'password123'
    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.upsert({
        where: { email },
        update: {
            password: hashedPassword,
            role: 'OWNER',
            name: 'Owner',
        },
        create: {
            email,
            password: hashedPassword,
            role: 'OWNER',
            name: 'Owner',
            address: 'Admin Address',
            phoneNumber: '0000000000',
        },
    })

    console.log(`Owner account reset: ${user.email}`)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
