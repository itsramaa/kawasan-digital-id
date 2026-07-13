'use client'

// TODO: Wire up checkout flow with Server Actions / Prisma
import { useState } from 'react';
import { CheckoutStepper } from '@/src/features/storefront/components/CheckoutStepper';
import { CheckoutTrustSignals } from '@/src/features/storefront/components/CheckoutTrustSignals';
import { CheckoutOrderSummary } from '@/src/features/storefront/components/CheckoutOrderSummary';
import type { CartItem } from '@/src/features/storefront/hooks/useCart';

export default function CheckoutPage() {
  const [activeStep, setActiveStep] = useState(1);

  // TODO: fetch cart from context / Server Action
  const items: CartItem[] = [];
  const total = items.reduce((s, i) => s + i.base_price + i.selected_features.reduce((fs, f) => fs + f.price, 0), 0);

  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-8 py-10">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      <CheckoutStepper activeStep={activeStep} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-border p-6 text-muted-foreground text-sm">
            {/* TODO: Render checkout form steps */}
            Formulir checkout akan ditampilkan di sini.
          </div>
          <CheckoutTrustSignals />
        </div>
        <div className="lg:col-span-1">
          <CheckoutOrderSummary items={items} total={total} showEditLink />
        </div>
      </div>
    </div>
  );
}
