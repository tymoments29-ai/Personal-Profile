import NextAuth from 'next-auth'
import { authConfig } from '@/lib/auth.config'
import createMiddleware from 'next-intl/middleware'
import { routing } from './routing'

const intlMiddleware = createMiddleware(routing)

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const { nextUrl } = req
  const isAdminRoute = nextUrl.pathname.startsWith('/admin')
  const isLoginPage = nextUrl.pathname === '/admin/login'
  const isLoggedIn = !!req.auth

  if (isAdminRoute) {
    if (isLoginPage) {
      if (isLoggedIn) return Response.redirect(new URL('/admin/dashboard', nextUrl))
      return
    }
    if (!isLoggedIn) return Response.redirect(new URL('/admin/login', nextUrl))
    return
  }

  // Public routes: apply next-intl middleware
  return intlMiddleware(req)
})

export const config = {
  // Skip all internal paths
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images).*)']
}
