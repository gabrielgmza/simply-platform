export interface RateResult {
  pair: string;
  from: string;
  to: string;
  rate: number;
  rawRate: number;
  markup: number;
  strategy: string;
  providers: Array<{ id: string; rate: number | null }>;
  ts: string;
}

export async function getFxRates(pairs: string[]): Promise<Record<string, RateResult | { error: string }>> {
  const res = await fetch(`/api/fx/rates?pairs=${encodeURIComponent(pairs.join(","))}`);
  const text = await res.text();
  if (!res.ok) throw new Error(text);
  return JSON.parse(text);
}
