'use client';

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "kd_wishlist";

function getStored(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

export function useWishlist() {
  const [ids, setIds] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  // Load from localStorage after mount to avoid SSR crash
  useEffect(() => {
    setIds(getStored());
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  }, [ids, mounted]);

  // Sync across tabs
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setIds(getStored());
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const toggle = useCallback((id: string) => {
    setIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }, []);

  const has = useCallback((id: string) => ids.includes(id), [ids]);

  return { wishlistIds: ids, toggle, has, count: ids.length };
}
