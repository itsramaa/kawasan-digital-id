'use client'

export const dynamic = 'force-dynamic'

import { useActionState } from 'react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'
import { Globe, Mail, Lock, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { registerUser } from './actions'

export default function RegisterPage() {
  const router = useRouter()
  const [state, action, pending] = useActionState(registerUser, null)

  useEffect(() => {
    if (state?.success) {
      router.push('/auth/login?registered=1')
    }
  }, [state, router])

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto">
            <Globe className="w-6 h-6 text-primary-foreground" />
          </div>
          <h2 className="text-2xl font-bold">Buat Akun</h2>
          <p className="text-sm text-muted-foreground">Daftarkan diri Anda untuk menggunakan layanan kami</p>
        </div>

        <form action={action} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nama Lengkap</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input id="name" name="name" placeholder="Nama Anda" className="pl-9" required autoComplete="name" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input id="email" name="email" type="email" placeholder="email@contoh.com" className="pl-9" required autoComplete="email" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input id="password" name="password" type="password" placeholder="Min. 8 karakter" className="pl-9" required autoComplete="new-password" minLength={8} />
            </div>
          </div>

          {state?.error && (
            <p className="text-sm text-destructive text-center">{state.error}</p>
          )}

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-primary to-secondary border-0"
            disabled={pending}
          >
            {pending ? 'Memuat...' : 'Daftar'}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Sudah punya akun?{' '}
          <Link href="/auth/login" className="text-primary hover:underline">Masuk</Link>
        </p>
      </div>
    </div>
  )
}
