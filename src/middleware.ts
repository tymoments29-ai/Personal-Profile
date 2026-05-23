import { NextRequest, NextResponse } from 'next/server'
import NextAuth from 'next-auth'
import { authConfig } from '@/lib/auth.config'
import createMiddleware from 'next-intl/middleware'
import { routing } from './routing'

const intlMiddleware = createMiddleware(routing)
const { auth } = NextAuth(authConfig)

export default auth((req: NextRequest & { auth: unknown }) => {
  const { nextUrl } = req
  const isAdminRoute = nextUrl.pathname.startsWith('/admin')
  const isLoginPage = nextUrl.pathname === '/admin/login'
  const isLoggedIn = !!(req as { auth: unknown }).auth

  // Handle admin routes
  if (isAdminRoute) {
    if (isLoginPage) {
      if (isLoggedIn) return NextResponse.redirect(new URL('/admin/dashboard', nextUrl))
      return NextResponse.next()
    }
    if (!isLoggedIn) return NextResponse.redirect(new URL('/admin/login', nextUrl))
    return NextResponse.next()
  }

  // Public routes: apply next-intl middleware for locale handling
  return intlMiddleware(req)
})

export const config = {
  matcher: [
    // Match all paths except internals, static files, and API routes
    '/((?!api|_next/static|_next/image|favicon\\.ico|images|icons|robots\\.txt|sitemap\\.xml).*)',
  ],
}
