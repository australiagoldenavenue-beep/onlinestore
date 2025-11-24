import { prisma } from "../src/lib/prisma"
import bcrypt from "bcryptjs"

async function main() {
    console.log("Starting user fix script...")

    const password = await bcrypt.hash("test123", 10)

    // 1. Ensure Owner/Admin
    const owner = await prisma.user.upsert({
        where: { email: 'test@example.com' },
        update: { role: 'OWNER' },
        create: {
            email: 'test@example.com',
            password,
            name: 'Owner User',
            role: 'OWNER',
            address: '123 Owner St',
            phoneNumber: '0400000000'
        }
    })
    console.log("Owner user:", owner.email, owner.role)

    // 2. Ensure Staff
    const staff = await prisma.user.upsert({
        where: { email: 'staff1@example.com' },
        update: { role: 'STAFF' },
        create: {
            email: 'staff1@example.com',
            password,
            name: 'Staff User',
            role: 'STAFF',
            address: '123 Staff St',
            phoneNumber: '0400000001'
        }
    })
    console.log("Staff user:", staff.email, staff.role)

    // 3. Ensure Manager
    const manager = await prisma.user.upsert({
        where: { email: 'manager@example.com' },
        update: { role: 'MANAGER' },
        create: {
            email: 'manager@example.com',
            password,
            name: 'Manager User',
            role: 'MANAGER',
            address: '123 Manager St',
            phoneNumber: '0400000002'
        }
    })
    console.log("Manager user:", manager.email, manager.role)

    // 4. Ensure Community Chat
    let chat = await prisma.chat.findFirst({
        where: { isCommunity: true }
    })

    if (!chat) {
        console.log("Creating Community Chat...")
        chat = await prisma.chat.create({
            data: {
                userId: owner.id, // Assign to owner
                title: "Community Chat",
                isCommunity: true
            }
        })
    }
    console.log("Community Chat ID:", chat.id)
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
