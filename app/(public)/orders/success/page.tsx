'use client'

import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const confettiDots = [
  { id: 1,  size: '10px', left: '10%',  top: '5%',  color: '#3b82f6', delay: '0s',    duration: '3.2s' },
  { id: 2,  size: '8px',  left: '20%',  top: '2%',  color: '#10b981', delay: '0.2s',  duration: '2.8s' },
  { id: 3,  size: '12px', left: '30%',  top: '8%',  color: '#f59e0b', delay: '0.1s',  duration: '3.5s' },
  { id: 4,  size: '7px',  left: '40%',  top: '1%',  color: '#ef4444', delay: '0.4s',  duration: '2.6s' },
  { id: 5,  size: '9px',  left: '50%',  top: '4%',  color: '#8b5cf6', delay: '0.3s',  duration: '3.1s' },
  { id: 6,  size: '11px', left: '60%',  top: '7%',  color: '#06b6d4', delay: '0.15s', duration: '3.4s' },
  { id: 7,  size: '8px',  left: '70%',  top: '3%',  color: '#f97316', delay: '0.5s',  duration: '2.9s' },
  { id: 8,  size: '10px', left: '80%',  top: '6%',  color: '#ec4899', delay: '0.25s', duration: '3.3s' },
  { id: 9,  size: '7px',  left: '90%',  top: '2%',  color: '#84cc16', delay: '0.35s', duration: '2.7s' },
  { id: 10, size: '9px',  left: '15%',  top: '10%', color: '#3b82f6', delay: '0.45s', duration: '3.0s' },
  { id: 11, size: '12px', left: '25%',  top: '3%',  color: '#10b981', delay: '0.6s',  duration: '3.6s' },
  { id: 12, size: '8px',  left: '35%',  top: '9%',  color: '#f59e0b', delay: '0.05s', duration: '2.5s' },
  { id: 13, size: '10px', left: '45%',  top: '1%',  color: '#ef4444', delay: '0.55s', duration: '3.2s' },
  { id: 14, size: '7px',  left: '55%',  top: '5%',  color: '#8b5cf6', delay: '0.4s',  duration: '2.8s' },
  { id: 15, size: '11px', left: '65%',  top: '8%',  color: '#06b6d4', delay: '0.2s',  duration: '3.5s' },
  { id: 16, size: '9px',  left: '75%',  top: '2%',  color: '#f97316', delay: '0.3s',  duration: '3.0s' },
  { id: 17, size: '8px',  left: '85%',  top: '6%',  color: '#ec4899', delay: '0.1s',  duration: '2.9s' },
  { id: 18, size: '10px', left: '95%',  top: '4%',  color: '#84cc16', delay: '0.5s',  duration: '3.3s' },
  { id: 19, size: '12px', left: '5%',   top: '7%',  color: '#3b82f6', delay: '0.35s', duration: '3.7s' },
  { id: 20, size: '7px',  left: '48%',  top: '3%',  color: '#10b981', delay: '0.65s', duration: '2.6s' },
];

export default function OrderSuccessPage() {
  return (
    <div className="relative min-h-[80vh] flex items-center justify-center overflow-hidden px-4">
      {/* Confetti dots */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {confettiDots.map((dot) => (
          <span
            key={dot.id}
            className="absolute rounded-full animate-confetti"
            style={{
              width: dot.size,
              height: dot.size,
              left: dot.left,
              top: dot.top,
              background: dot.color,
              animationDelay: dot.delay,
              animationDuration: dot.duration,
            }}
          />
        ))}
      </div>

      {/* Card */}
      <div className="relative z-10 max-w-md w-full text-center space-y-6 rounded-2xl border border-border bg-card p-10 shadow-lg">
        <div className="flex justify-center">
          <CheckCircle2 className="w-16 h-16 text-emerald-500" />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Pesanan Berhasil!</h1>
          <p className="text-muted-foreground">
            Tim kami akan menghubungi Anda dalam 1x24 jam untuk konfirmasi.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Button asChild variant="outline" className="flex-1">
            <Link href="/orders/track">Lacak Pesanan</Link>
          </Button>
          <Button asChild className="flex-1 bg-gradient-to-r from-primary to-secondary border-0">
            <Link href="/">Kembali ke Home</Link>
          </Button>
        </div>
      </div>

      <style>{`
        @keyframes confetti-fall {
          0%   { transform: translateY(-20px) rotate(0deg); opacity: 1; }
          80%  { opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        .animate-confetti {
          animation-name: confetti-fall;
          animation-timing-function: linear;
          animation-iteration-count: 1;
          animation-fill-mode: forwards;
        }
      `}</style>
    </div>
  );
}

