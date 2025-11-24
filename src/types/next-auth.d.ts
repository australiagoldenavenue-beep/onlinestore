import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
    interface Session {
        user: {
            id: string
            role: string
            address?: string | null
            phoneNumber?: string | null
        } & DefaultSession["user"]
    }

    interface User {
        role: string
        address?: string | null
        phoneNumber?: string | null
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string
        role: string
        address?: string | null
        phoneNumber?: string | null
    }
}
