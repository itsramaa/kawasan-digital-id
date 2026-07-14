import { auth } from '@/src/auth'
import { prisma } from '@/src/lib/prisma'
// ponytail: @/ resolves to project root, src/ is not src-dir layout
import { redirect } from 'next/navigation'
import type { UserRole } from '@prisma/client'

const INTERNAL_ROLES: UserRole[] = ['super_admin', 'sales', 'project_manager', 'developer', 'finance', 'support', 'infra']

export async function getCurrentUser() {
  const session = await auth()
  if (!session?.user?.id) return null
  return session.user
}

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) redirect('/auth/login')
  return user
}

export async function requireAdmin() {
  const user = await requireAuth()
  if (!INTERNAL_ROLES.includes(user.role as UserRole)) redirect('/auth/login')
  return user
}

export async function requireClient() {
  const user = await requireAuth()
  const role = user.role as UserRole
  if (!(['client_admin', 'client_contact'] as UserRole[]).includes(role) && !INTERNAL_ROLES.includes(role)) {
    redirect('/auth/login')
  }
  return user
}

export async function getClientId(): Promise<string | null> {
  const user = await getCurrentUser()
  return user?.clientId ?? null
}
