import { prisma } from "@/lib/prisma"

export async function getSettings() {
    const settings = await prisma.settings.findMany()
    const settingsMap: Record<string, string> = {}
    settings.forEach(s => {
        settingsMap[s.key] = s.value
    })
    return settingsMap
}
