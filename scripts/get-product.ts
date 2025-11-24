import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const product = await prisma.product.findFirst({
        where: { stock: { gt: 0 } }
    })
    if (product) {
        console.log(`PRODUCT_ID:${product.id}`)
    } else {
        console.log('NO_PRODUCT_FOUND')
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect())
