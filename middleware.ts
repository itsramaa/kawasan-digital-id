import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const INTERNAL_ROLES = ['super_admin', 'sales', 'project_manager', 'developer', 'finance', 'support', 'infra']
const CLIENT_ROLES = ['client_admin', 'client_contact']

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const token = await getToken({ req, secret: process.env.AUTH_SECRET })

  // Admin routes — super_admin only
  if (pathname.startsWith('/admin')) {
    if (!token) return NextResponse.redirect(new URL('/auth/login', req.url))
    if (token.role !== 'super_admin') return NextResponse.redirect(new URL('/auth/login', req.url))
  }

  // Internal dashboard — all staff roles
  if (pathname.startsWith('/dashboard')) {
    if (!token) return NextResponse.redirect(new URL('/auth/login', req.url))
    if (!INTERNAL_ROLES.includes(token.role as string)) return NextResponse.redirect(new URL('/auth/login', req.url))
  }

  // Client portal — client roles only
  if (pathname.startsWith('/client')) {
    if (!token) return NextResponse.redirect(new URL('/auth/login', req.url))
    if (!CLIENT_ROLES.includes(token.role as string)) return NextResponse.redirect(new URL('/auth/login', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*', '/client/:path*'],
}
