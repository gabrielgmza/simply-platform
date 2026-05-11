export interface BalancesResponse {
  linked: boolean;
  userId: string | null;
  matchedBy: "email" | "cuil" | null;
  balances: Record<string, { available: string; pending: string }>;
  totalArsEquivalent: string;
  cryptoEnabled: boolean;
  wallets: Array<{
    id: string;
    currency: string;
    cvu: string | null;
    alias: string | null;
    available: string;
    pending: string;
  }>;
}

export async function getBalances(customerId: string): Promise<BalancesResponse> {
  const res = await fetch(`/api/customer/${encodeURIComponent(customerId)}/balances`);
  const text = await res.text();
  if (!res.ok) {
    throw new Error(text || `HTTP ${res.status}`);
  }
  return JSON.parse(text);
}
