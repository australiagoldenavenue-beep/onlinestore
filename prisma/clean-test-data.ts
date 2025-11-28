
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const ownerEmail = 'australia.golden.avenue@gmail.com'

    console.log('Cleaning up test data...')

    // Delete all data except the owner account, settings, products, and product types

    // 1. Delete transactional data
    await prisma.orderItem.deleteMany({})
    await prisma.order.deleteMany({})
    await prisma.comment.deleteMany({})
    await prisma.message.deleteMany({})
    await prisma.chat.deleteMany({})
    await prisma.verificationCode.deleteMany({})
    await prisma.financeRecord.deleteMany({})

    // 2. Delete all users except the owner
    const deletedUsers = await prisma.user.deleteMany({
        where: {
            email: {
                not: ownerEmail
            }
        }
    })

    // Note: StaffProfile and StaffSchedule will be deleted via cascade if their user is deleted, 
    // or we should delete them explicitly if not.
    // Schema says: user User @relation(fields: [userId], references: [id], onDelete: Cascade)
    // So deleting users should clean up StaffProfiles.

    console.log(`Deleted ${deletedUsers.count} test users.`)
    console.log('Test data cleanup complete.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
