import { auth } from '@/src/auth'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const INTERNAL_ROLES = ['super_admin', 'sales', 'project_manager', 'developer', 'finance', 'support', 'infra']
const CLIENT_ROLES = ['client_admin', 'client_contact']

export default auth((req: NextRequest & { auth: any }) => {
  const { pathname } = req.nextUrl
  const session = req.auth

  // Admin routes — super_admin only
  if (pathname.startsWith('/admin')) {
    if (!session?.user) return NextResponse.redirect(new URL('/auth/login', req.url))
    if (session.user.role !== 'super_admin') return NextResponse.redirect(new URL('/auth/login', req.url))
  }

  // Internal dashboard — all staff roles
  if (pathname.startsWith('/dashboard')) {
    if (!session?.user) return NextResponse.redirect(new URL('/auth/login', req.url))
    if (!INTERNAL_ROLES.includes(session.user.role)) return NextResponse.redirect(new URL('/auth/login', req.url))
  }

  // Client portal — client roles only
  if (pathname.startsWith('/client')) {
    if (!session?.user) return NextResponse.redirect(new URL('/auth/login', req.url))
    if (!CLIENT_ROLES.includes(session.user.role)) return NextResponse.redirect(new URL('/auth/login', req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*', '/client/:path*'],
}
