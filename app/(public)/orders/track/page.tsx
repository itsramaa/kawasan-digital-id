'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { Search, Package, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface OrderResult {
  orderNumber: string
  status: string
  createdAt: string
  templateName: string
}

const STATUS_LABELS: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  pending:     { label: 'Menunggu Konfirmasi', variant: 'secondary' },
  confirmed:   { label: 'Dikonfirmasi', variant: 'default' },
  in_progress: { label: 'Sedang Dikerjakan', variant: 'default' },
  review:      { label: 'Review Klien', variant: 'outline' },
  completed:   { label: 'Selesai', variant: 'default' },
  cancelled:   { label: 'Dibatalkan', variant: 'destructive' },
}

export default function OrderTrackingPage() {
  const [orderId, setOrderId] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<OrderResult | null>(null)
  const [notFound, setNotFound] = useState(false)

  async function handleSearch() {
    const id = orderId.trim()
    if (!id) return
    setLoading(true)
    setResult(null)
    setNotFound(false)
    try {
      const res = await fetch(`/api/orders/track?orderId=${encodeURIComponent(id)}`)
      if (!res.ok) {
        setNotFound(true)
      } else {
        const data = await res.json()
        if (!data || !data.orderNumber) {
          setNotFound(true)
        } else {
          setResult(data)
        }
      }
    } catch {
      setNotFound(true)
    } finally {
      setLoading(false)
    }
  }

  const statusInfo = result ? (STATUS_LABELS[result.status] ?? { label: result.status, variant: 'outline' as const }) : null

  return (
    <div className="max-w-2xl mx-auto px-4 lg:px-8 py-16 space-y-8">
      <div className="text-center space-y-2">
        <Package className="w-12 h-12 mx-auto text-primary" />
        <h1 className="text-3xl font-bold">Lacak Pesanan</h1>
        <p className="text-muted-foreground text-sm">Masukkan Order ID untuk melihat status pesanan Anda.</p>
      </div>

      <div className="flex gap-3">
        <Input
          placeholder="Contoh: ORD-20240101-XXXX"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Button
          onClick={handleSearch}
          disabled={loading || !orderId.trim()}
          className="bg-gradient-to-r from-primary to-secondary border-0 shrink-0"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Search className="w-4 h-4 mr-2" />Cari</>}
        </Button>
      </div>

      {/* Result card */}
      {result && statusInfo && (
        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Nomor Pesanan</p>
              <p className="font-mono font-semibold text-lg">{result.orderNumber}</p>
            </div>
            <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
          </div>
          <div className="border-t border-border pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Layanan</p>
              <p className="font-medium">{result.templateName}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Tanggal Pesan</p>
              <p className="font-medium">
                {new Date(result.createdAt).toLocaleDateString('id-ID', {
                  day: 'numeric', month: 'long', year: 'numeric',
                })}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Not found */}
      {notFound && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center space-y-1">
          <p className="font-medium text-sm">Pesanan tidak ditemukan</p>
          <p className="text-xs text-muted-foreground">
            Pastikan Order ID yang Anda masukkan benar, atau{' '}
            <a href="mailto:hello@kawasandigital.com" className="text-primary hover:underline">
              hubungi kami
            </a>
            .
          </p>
        </div>
      )}
    </div>
  )
}
