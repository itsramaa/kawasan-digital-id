export const dynamic = 'force-dynamic'

import { auth } from '@/src/auth'
import { redirect } from 'next/navigation'
import { ClientLayout } from '@/components/layouts/ClientLayout'

const CLIENT_ROLES = ['client_admin', 'client_contact']

export default async function ClientPortalLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session?.user) redirect('/auth/login')
  if (!CLIENT_ROLES.includes((session.user as any).role)) redirect('/auth/login')

  return <ClientLayout>{children}</ClientLayout>
}
