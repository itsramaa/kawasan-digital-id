import Link from "next/link";
import { Check } from "lucide-react";

const steps = [
  { label: "Keranjang", path: "/cart" },
  { label: "Checkout", path: "/checkout" },
  { label: "Konfirmasi", path: null },
];

export function CheckoutStepper({ activeStep = 1 }: { activeStep?: number }) {
  return (
    <nav aria-label="Progress checkout" className="flex items-center justify-center gap-0 py-2">
      {steps.map((step, i) => {
        const isDone = i < activeStep;
        const isActive = i === activeStep;
        const Wrapper = step.path && isDone ? Link : "span";
        const wrapperProps = step.path && isDone ? { to: step.path } : {};

        return (
          <div key={step.label} className="flex items-center">
            {i > 0 && (
              <div className={`w-10 sm:w-16 h-0.5 ${isDone ? "bg-primary" : "bg-border"}`} />
            )}
            <Wrapper
              {...(wrapperProps as any)}
              className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium transition-colors ${
                isDone
                  ? "text-primary hover:text-primary/80 cursor-pointer"
                  : isActive
                  ? "text-primary-foreground bg-primary px-3 py-1.5"
                  : "text-muted-foreground"
              }`}
            >
              {isDone ? (
                <Check className="w-3.5 h-3.5" />
              ) : (
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  isActive ? "bg-primary-foreground/20" : "bg-muted"
                }`}>{i + 1}</span>
              )}
              {step.label}
            </Wrapper>
          </div>
        );
      })}
    </nav>
  );
}
