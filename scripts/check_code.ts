/* eslint-disable @typescript-eslint/no-require-imports */

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const codes = await prisma.verificationCode.findMany({
        orderBy: { createdAt: 'desc' },
        take: 1
    })
    console.log('Latest Code:', codes)
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
export {}
