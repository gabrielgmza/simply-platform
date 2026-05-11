export interface TierProgress {
  currentTier: string;
  currentTierLabel: string;
  nextTier: string | null;
  nextTierLabel: string | null;
  accumulated90dArs: string;
  thresholdArs: string | null;
  remaining: string;
  progress: number;
  isMax: boolean;
  nextBenefits: string[];
}

export async function getTierProgress(customerId: string): Promise<TierProgress> {
  const res = await fetch(`/api/customer/${encodeURIComponent(customerId)}/tier-progress`);
  const text = await res.text();
  if (!res.ok) throw new Error(text || `HTTP ${res.status}`);
  return JSON.parse(text);
}
