import type { NextAuthConfig } from 'next-auth'

export const authConfig = {
  pages: {
    signIn: '/admin/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.email = token.email as string
        session.user.name = token.name as string
      }
      return session
    },
  },
  session: {
    maxAge: 20 * 60, // 20 minutes
  },
  providers: [], // Added in auth.ts
} satisfies NextAuthConfig
