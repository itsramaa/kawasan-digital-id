'use client'

import { useTransition, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { createTicket } from '@/app/actions/client-portal'
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

interface CreateTicketFormProps {
  clientId: string
}

export default function CreateTicketForm({ clientId }: CreateTicketFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const [subject, setSubject] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!subject.trim() || !description.trim() || !priority) {
      toast.error('Mohon lengkapi semua field yang diperlukan.')
      return
    }

    startTransition(async () => {
      const result = await createTicket({
        clientId,
        subject: subject.trim(),
        description: description.trim(),
        priority,
      })

      if (result) {
        toast.success('Tiket berhasil dibuat.')
        setSubject('')
        setDescription('')
        setPriority('')
        router.refresh()
      } else {
        toast.error('Gagal membuat tiket. Silakan coba lagi.')
      }
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Buat Tiket Baru</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ticket-subject">Subjek</Label>
            <Input
              id="ticket-subject"
              placeholder="Deskripsikan masalah Anda secara singkat"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              disabled={isPending}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ticket-description">Deskripsi</Label>
            <Textarea
              id="ticket-description"
              placeholder="Jelaskan masalah Anda secara detail"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isPending}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ticket-priority">Prioritas</Label>
            <Select value={priority} onValueChange={setPriority} disabled={isPending}>
              <SelectTrigger id="ticket-priority">
                <SelectValue placeholder="Pilih prioritas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? 'Mengirim...' : 'Kirim Tiket'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
