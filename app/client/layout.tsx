export const dynamic = 'force-dynamic'

import { auth } from '@/src/auth';
import { redirect } from 'next/navigation';
import { ClientLayout } from '@/components/layouts/ClientLayout';

export default async function ClientPortalLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect('/auth/login');
  const role = (session.user as any).role as string;
  if (role !== 'client') redirect('/dashboard');

  return <ClientLayout>{children}</ClientLayout>;
}
