'use client'

import { useRef, useTransition } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { updateSystemSetting } from '@/app/actions/admin'

interface Setting {
  key: string
  value: string
  description?: string | null
}

interface SettingsFormProps {
  settings: Setting[]
}

export function SettingsForm({ settings }: SettingsFormProps) {
  const [isPending, startTransition] = useTransition()
  const formRef = useRef<HTMLFormElement>(null)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      const updates = settings.map((s) => {
        const newValue = (formData.get(s.key) as string) ?? s.value
        if (newValue === s.value) return Promise.resolve(null)
        return updateSystemSetting(s.key, newValue)
      })

      const results = await Promise.all(updates)
      const failed = results.filter((r, i) => {
        const newValue = (formData.get(settings[i].key) as string) ?? settings[i].value
        return newValue !== settings[i].value && r === null
      })

      if (failed.length > 0) {
        toast.error('Gagal menyimpan beberapa pengaturan.')
      } else {
        toast.success('Pengaturan berhasil disimpan.')
      }
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Konfigurasi Sistem</CardTitle>
      </CardHeader>
      <CardContent>
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          {settings.map((s) => (
            <div key={s.key} className="space-y-1">
              <Label htmlFor={s.key}>{s.key}</Label>
              <Input
                id={s.key}
                name={s.key}
                defaultValue={s.value}
                disabled={isPending}
              />
              {s.description && (
                <p className="text-xs text-muted-foreground">{s.description}</p>
              )}
            </div>
          ))}
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Menyimpan...' : 'Simpan'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
