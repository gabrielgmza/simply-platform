"use client";

import { useState, useEffect } from "react";

const TERMINAL_STATES = ["completed", "denied", "failed"];

export function useOrderTracking(order: string | null, intervalMs = 5000) {
  const [tx, setTx] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!order) return;
    let cancelled = false;
    let timeoutId: any;

    async function poll() {
      try {
        const res = await fetch(`/api/order/${order}`);
        const data = await res.json();
        if (cancelled) return;
        if (!res.ok) {
          setError(data.message || "Operación no encontrada");
          return;
        }
        setTx(data);
        if (!TERMINAL_STATES.includes(data.status)) {
          timeoutId = setTimeout(poll, intervalMs);
        }
      } catch (e: any) {
        if (!cancelled) setError(e.message);
      }
    }

    poll();
    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [order, intervalMs]);

  return { tx, error };
}
