import { auth } from '@/src/auth'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const INTERNAL_ROLES = ['super_admin', 'sales', 'project_manager', 'developer', 'finance', 'support', 'infra']
const CLIENT_ROLES = ['client_admin', 'client_contact']

export default auth((req: NextRequest & { auth: any }) => {
  const { pathname } = req.nextUrl
  const session = req.auth

  // Admin routes — require internal role
  if (pathname.startsWith('/admin')) {
    if (!session?.user) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
    if (!INTERNAL_ROLES.includes(session.user.role)) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
  }

  // Client dashboard routes — require client role
  if (pathname.startsWith('/dashboard')) {
    if (!session?.user) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
    if (!CLIENT_ROLES.includes(session.user.role) && !INTERNAL_ROLES.includes(session.user.role)) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*'],
}
