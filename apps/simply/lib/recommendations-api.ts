export type RecommendationCategory = "security" | "kyc" | "product" | "engagement" | "tier-upgrade";

export interface Recommendation {
  id: string;
  category: RecommendationCategory;
  priority: number;
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  icon: string;
  meta?: Record<string, any>;
}

const BASE = "/api/recommendations";

async function handle<T>(res: Response): Promise<T> {
  const text = await res.text();
  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try { const j = JSON.parse(text); msg = j.message || j.error || msg; } catch {}
    throw new Error(msg);
  }
  return text ? JSON.parse(text) : (undefined as any);
}

export async function listRecommendations(customerId: string): Promise<Recommendation[]> {
  const res = await fetch(`${BASE}?customerId=${encodeURIComponent(customerId)}`);
  return handle<Recommendation[]>(res);
}

export async function dismissRecommendation(customerId: string, ruleId: string): Promise<{ ok: true }> {
  const res = await fetch(`${BASE}/dismiss`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ customerId, ruleId }),
  });
  return handle<{ ok: true }>(res);
}
