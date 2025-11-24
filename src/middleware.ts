import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
    const isLoggedIn = !!req.auth
    const { nextUrl } = req
    const isAdminRoute = nextUrl.pathname.startsWith('/admin')

    if (isAdminRoute) {
        if (!isLoggedIn) {
            return NextResponse.redirect(new URL('/login', nextUrl))
        }
        if (req.auth?.user.role !== 'ADMIN') {
            return NextResponse.redirect(new URL('/', nextUrl))
        }
    }

    return NextResponse.next()
})

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
