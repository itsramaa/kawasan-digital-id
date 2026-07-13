import { auth } from '@/src/auth'
import { prisma } from '@/src/lib/prisma'
// ponytail: @/ resolves to project root, src/ is not src-dir layout
import { redirect } from 'next/navigation'

const INTERNAL_ROLES = ['super_admin', 'sales', 'project_manager', 'developer', 'finance', 'support', 'infra']

export async function getCurrentUser() {
  const session = await auth()
  if (!session?.user?.id) return null
  return session.user
}

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')
  return user
}

export async function requireAdmin() {
  const user = await requireAuth()
  if (!INTERNAL_ROLES.includes((user as any).role)) redirect('/login')
  return user
}

export async function requireClient() {
  const user = await requireAuth()
  const role = (user as any).role
  if (!['client_admin', 'client_contact'].includes(role) && !INTERNAL_ROLES.includes(role)) {
    redirect('/login')
  }
  return user
}

export async function getClientId(): Promise<string | null> {
  const user = await getCurrentUser()
  return (user as any)?.clientId ?? null
}
