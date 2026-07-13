export const dynamic = 'force-dynamic'

import { Suspense } from 'react'
import CheckoutClient from './checkout-client'

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="max-w-5xl mx-auto px-4 py-10 text-muted-foreground">Memuat...</div>}>
      <CheckoutClient />
    </Suspense>
  )
}
