"use client";

import { useState, useEffect } from "react";

interface QuoteParams {
  sourceCurrency: string;
  destinationCountry: string;
  amount: number;
}

interface UseQuoteResult {
  quote: any;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useQuote(params: QuoteParams | null, debounceMs = 500): UseQuoteResult {
  const [quote, setQuote] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refetchKey, setRefetchKey] = useState(0);

  useEffect(() => {
    if (!params || !params.amount || params.amount < 1) {
      setQuote(null);
      return;
    }

    const t = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/quote", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(params),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Error obteniendo cotización");
        setQuote(data);
      } catch (e: any) {
        setError(e.message);
        setQuote(null);
      } finally {
        setLoading(false);
      }
    }, debounceMs);

    return () => clearTimeout(t);
  }, [params?.sourceCurrency, params?.destinationCountry, params?.amount, refetchKey, debounceMs]);

  return { quote, loading, error, refetch: () => setRefetchKey((k) => k + 1) };
}
