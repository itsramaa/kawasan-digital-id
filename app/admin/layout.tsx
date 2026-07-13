export const dynamic = 'force-dynamic'

import { auth } from '@/src/auth';
import { redirect } from 'next/navigation';
import { AppLayout } from '@/components/layouts/AppLayout';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect('/auth/login');
  const role = (session.user as any).role as string;
  if (role !== 'super_admin') redirect('/dashboard');

  return <AppLayout>{children}</AppLayout>;
}
