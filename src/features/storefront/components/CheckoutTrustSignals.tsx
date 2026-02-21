import { ShieldCheck, RefreshCw, Headphones, MessageCircle } from "lucide-react";

const signals = [
  { icon: ShieldCheck, text: "Pembayaran Aman & Terverifikasi" },
  { icon: RefreshCw, text: "Garansi Revisi" },
  { icon: Headphones, text: "Support 24/7" },
  { icon: MessageCircle, text: "Gratis Konsultasi" },
];

export function CheckoutTrustSignals() {
  return (
    <div className="border-t border-border pt-3 space-y-2">
      {signals.map((s) => (
        <div key={s.text} className="flex items-center gap-2 text-xs text-muted-foreground">
          <s.icon className="w-3.5 h-3.5 text-primary/70" />
          <span>{s.text}</span>
        </div>
      ))}
    </div>
  );
}
