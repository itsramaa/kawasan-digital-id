'use client'

import { useTransition, useState } from 'react'
import { toast } from 'sonner'
import { createInquiry } from '@/app/actions/storefront'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const INITIAL_STATE = {
  name: '',
  email: '',
  phone: '',
  company: '',
  serviceType: '',
  message: '',
  budget: '',
}

export default function ContactForm() {
  const [isPending, startTransition] = useTransition()
  const [form, setForm] = useState(INITIAL_STATE)

  function set(field: keyof typeof INITIAL_STATE) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error('Mohon lengkapi nama, email, dan pesan Anda.')
      return
    }

    startTransition(async () => {
      const result = await createInquiry({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || undefined,
        company: form.company.trim() || undefined,
        serviceType: form.serviceType || undefined,
        message: form.message.trim(),
        budget: form.budget.trim() || undefined,
      })

      if (result) {
        toast.success('Pesan Anda telah terkirim. Kami akan segera menghubungi Anda.')
        setForm(INITIAL_STATE)
      } else {
        toast.error('Gagal mengirim pesan. Silakan coba lagi.')
      }
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hubungi Kami</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contact-name">
                Nama <span className="text-destructive">*</span>
              </Label>
              <Input
                id="contact-name"
                placeholder="Nama lengkap Anda"
                value={form.name}
                onChange={set('name')}
                disabled={isPending}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact-email">
                Email <span className="text-destructive">*</span>
              </Label>
              <Input
                id="contact-email"
                type="email"
                placeholder="email@domain.com"
                value={form.email}
                onChange={set('email')}
                disabled={isPending}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contact-phone">Nomor Telepon</Label>
              <Input
                id="contact-phone"
                type="tel"
                placeholder="+62 8xx xxxx xxxx"
                value={form.phone}
                onChange={set('phone')}
                disabled={isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact-company">Perusahaan</Label>
              <Input
                id="contact-company"
                placeholder="Nama perusahaan (opsional)"
                value={form.company}
                onChange={set('company')}
                disabled={isPending}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact-service">Jenis Layanan</Label>
            <Select
              value={form.serviceType}
              onValueChange={(v) => setForm((prev) => ({ ...prev, serviceType: v }))}
              disabled={isPending}
            >
              <SelectTrigger id="contact-service">
                <SelectValue placeholder="Pilih layanan yang diinginkan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Website">Website</SelectItem>
                <SelectItem value="E-commerce">E-commerce</SelectItem>
                <SelectItem value="Custom">Custom Development</SelectItem>
                <SelectItem value="Maintenance">Maintenance</SelectItem>
                <SelectItem value="Other">Lainnya</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact-message">
              Pesan <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="contact-message"
              placeholder="Ceritakan kebutuhan atau pertanyaan Anda"
              rows={5}
              value={form.message}
              onChange={set('message')}
              disabled={isPending}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact-budget">Estimasi Budget</Label>
            <Input
              id="contact-budget"
              placeholder="cth. Rp 5.000.000 - Rp 10.000.000"
              value={form.budget}
              onChange={set('budget')}
              disabled={isPending}
            />
          </div>

          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? 'Mengirim...' : 'Kirim Pesan'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
