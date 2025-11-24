
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    const admin = await prisma.user.findUnique({
        where: { email: 'admin@example.com' }
    })

    if (!admin) {
        console.log('Admin user not found')
        return
    }

    const isValid = await bcrypt.compare('admin123', admin.password)
    console.log(`Admin password valid: ${isValid}`)

    const user = await prisma.user.findUnique({
        where: { email: 'test@example.com' }
    })

    if (user) {
        const isUserValid = await bcrypt.compare('test123', user.password)
        console.log(`User password valid: ${isUserValid}`)
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())
