import type { NextAuthConfig } from "next-auth"

export const authConfig = {
    pages: {
        signIn: '/signin',
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role;
                token.id = user.id;
                token.address = user.address;
                token.phoneNumber = user.phoneNumber;
            }
            return token;
        },
        async session({ session, token }) {
            if (token && session.user) {
                session.user.role = token.role as string;
                session.user.id = token.id as string;
                session.user.address = token.address as string | null;
                session.user.phoneNumber = token.phoneNumber as string | null;
            }
            return session;
        },
    },
    session: {
        strategy: "jwt",
        maxAge: 24 * 60 * 60, // 1 day (JWT expiry)
    },
    cookies: {
        sessionToken: {
            name: `next-auth.session-token`,
            options: {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
                secure: process.env.NODE_ENV === 'production',
                maxAge: undefined, // Session cookie
            }
        }
    },
    providers: [], // Configured in auth.ts
} satisfies NextAuthConfig
