
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    const product = await prisma.product.findFirst()
    console.log(product?.id)
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect()
    })
