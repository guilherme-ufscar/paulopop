import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from './prisma'

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET || 'local-dev-nextauth-secret',
  session: {
    strategy: 'jwt',
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Senha', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user || !user.active) return null

        const isValid = await bcrypt.compare(credentials.password, user.password)
        if (!isValid) return null

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as unknown as { role: string }).role
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { role: string; id: string }).role = token.role as string
        ;(session.user as { role: string; id: string }).id = token.id as string
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      const adminUrl = `${baseUrl}/admin`

      try {
        const target = new URL(url, baseUrl)

        if (target.origin !== baseUrl) return adminUrl
        if (target.pathname === '/admin/login') return adminUrl
        if (target.pathname.startsWith('/admin')) return target.toString()

        return adminUrl
      } catch {
        return adminUrl
      }
    },
  },
  pages: {
    signIn: '/admin/login',
  },
}
