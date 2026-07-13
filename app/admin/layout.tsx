export const dynamic = 'force-dynamic'

import { auth } from '@/src/auth'
import { redirect } from 'next/navigation'
import { AppLayout } from '@/components/layouts/AppLayout'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session?.user) redirect('/auth/login')
  if ((session.user as any).role !== 'super_admin') redirect('/auth/login')

  return <AppLayout>{children}</AppLayout>
}
