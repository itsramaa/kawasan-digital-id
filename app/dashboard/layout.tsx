export const dynamic = 'force-dynamic'

import { auth } from '@/src/auth'
import { redirect } from 'next/navigation'
import { AppLayout } from '@/components/layouts/AppLayout'

const INTERNAL_ROLES = ['super_admin', 'sales', 'project_manager', 'developer', 'finance', 'support', 'infra']

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session?.user) redirect('/auth/login')
  if (!INTERNAL_ROLES.includes((session.user as any).role)) redirect('/auth/login')

  return <AppLayout>{children}</AppLayout>
}
