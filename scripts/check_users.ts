import { prisma } from "../src/lib/prisma"

async function main() {
    const users = await prisma.user.findMany()
    console.log("Users found:", users.length)
    users.forEach(u => {
        console.log(`- ${u.email}: ${u.role} (ID: ${u.id})`)
    })
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect())
