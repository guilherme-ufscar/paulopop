import { withAuth } from 'next-auth/middleware'

export default withAuth({
  pages: {
    signIn: '/admin/login',
  },
  callbacks: {
    authorized({ req, token }) {
      if (req.nextUrl.pathname === '/admin/login') {
        return true
      }

      return !!token
    },
  },
})

export const config = {
  matcher: ['/admin/:path*'],
}
