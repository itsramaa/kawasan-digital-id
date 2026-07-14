import { redirect } from 'next/navigation'
import { auth } from '@/src/auth'

const INTERNAL_ROLES = ['sales', 'project_manager', 'developer', 'finance', 'support', 'infra']
const CLIENT_ROLES = ['client_admin', 'client_contact']

export default async function AuthRedirectPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/auth/login')
  }

  const role = (session.user as any).role as string | undefined

  if (role === 'super_admin') {
    redirect('/admin')
  } else if (role && INTERNAL_ROLES.includes(role)) {
    redirect('/dashboard')
  } else if (role && CLIENT_ROLES.includes(role)) {
    redirect('/client')
  } else {
    redirect('/')
  }
}
