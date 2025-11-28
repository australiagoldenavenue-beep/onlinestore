import NextAuth from "next-auth"
import { authConfig } from "./auth.config"
import { NextResponse } from "next/server"

const { auth } = NextAuth(authConfig)

export const proxy = auth((req) => {
    const isLoggedIn = !!req.auth
    const { nextUrl } = req
    const isAuthRoute = ['/signin', '/register', '/forgot-password'].some(route => nextUrl.pathname.startsWith(route))
    const isAdminRoute = nextUrl.pathname.startsWith('/admin')

    // console.log(`Middleware: ${nextUrl.pathname}, isLoggedIn: ${isLoggedIn}, isAuthRoute: ${isAuthRoute}`)

    if (isAuthRoute && isLoggedIn) {
        // console.log('Redirecting to / because logged in and on auth route')
        return NextResponse.redirect(new URL('/', nextUrl))
    }

    if (isAdminRoute) {
        if (!isLoggedIn) {
            return NextResponse.redirect(new URL('/signin', nextUrl))
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
            // Manager has access to orders, users, and products (implied by "Manager Nav Bar Parity" request, but let's check what was requested)
            // Previous conversation said: "Manager Nav Bar Parity... granting Managers access to all navigation links... visible to Owners"
            // So Manager should have access to everything Owner has, except maybe critical settings?
            // For now, let's allow Manager to access everything in admin to match Owner, or at least what Owner sees.
            // If Manager is restricted, I should define it.
            // But the user said "Manager Nav Bar Parity... identical to that of an Owner account".
            // So I will NOT restrict Manager here, unless specifically asked.
            // The commented out code had restrictions: ['/admin/orders', '/admin/users'].
            // I will comment out the restriction for Manager to allow full access as per "Parity" request.

            // const allowedManagerRoutes = ['/admin/orders', '/admin/users']
            // const isAllowed = allowedManagerRoutes.some(route => nextUrl.pathname.startsWith(route)) || nextUrl.pathname === '/admin'
            // if (!isAllowed) {
            //    return NextResponse.redirect(new URL('/admin/orders', nextUrl))
            // }
        }
    }

    return NextResponse.next()
})

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
