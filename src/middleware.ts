import NextAuth from "next-auth"
import { authConfig } from "./auth.config"
import { NextResponse } from "next/server"

const { auth } = NextAuth(authConfig)

export default auth((req) => {
    const isLoggedIn = !!req.auth
    const { nextUrl } = req
    const isAuthRoute = ['/login', '/register', '/forgot-password'].some(route => nextUrl.pathname.startsWith(route))
    const isAdminRoute = nextUrl.pathname.startsWith('/admin')

    if (isAuthRoute && isLoggedIn) {
        return NextResponse.redirect(new URL('/', nextUrl))
    }

    if (isAdminRoute) {
        if (!isLoggedIn) {
            return NextResponse.redirect(new URL('/login', nextUrl))
        }

        const role = req.auth?.user.role
        const isStaff = role === 'STAFF'
        const isManager = role === 'MANAGER'
        const isAdmin = role === 'ADMIN'
        const isOwner = role === 'OWNER'

        if (!isAdmin && !isStaff && !isManager && !isOwner) {
            return NextResponse.redirect(new URL('/', nextUrl))
        }

        // Staff restrictions
        if (isStaff) {
            const allowedStaffRoutes = ['/admin/products', '/admin/types']
            const isAllowed = allowedStaffRoutes.some(route => nextUrl.pathname.startsWith(route)) || nextUrl.pathname === '/admin'

            if (!isAllowed) {
                return NextResponse.redirect(new URL('/admin/products', nextUrl))
            }
        }

        // Manager restrictions
        if (isManager) {
            const allowedManagerRoutes = ['/admin/orders', '/admin/users']
            const isAllowed = allowedManagerRoutes.some(route => nextUrl.pathname.startsWith(route)) || nextUrl.pathname === '/admin'

            if (!isAllowed) {
                return NextResponse.redirect(new URL('/admin/orders', nextUrl))
            }
        }
    }

    return NextResponse.next()
})

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
