import { useEffect, useRef, useState } from "react";
import { useScrollReveal } from "@/features/storefront/hooks/useScrollReveal";

export function useCounter(target: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const { ref, isVisible } = useScrollReveal(0.3);
  const started = useRef(false);

  useEffect(() => {
    if (!isVisible || started.current) return;
    started.current = true;
    const start = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [isVisible, target, duration]);

  return { ref, count };
}
