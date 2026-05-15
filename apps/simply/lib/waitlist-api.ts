export type FeatureKey = "cards" | "services" | "investments" | "loans";

const BASE = "/api/customer";

export async function joinWaitlist(customerId: string, feature: FeatureKey): Promise<{ joined: boolean; alreadyIn: boolean }> {
  const res = await fetch(`${BASE}/${encodeURIComponent(customerId)}/feature-waitlist`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ feature }),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(text);
  return JSON.parse(text);
}

export async function getWaitlist(customerId: string): Promise<FeatureKey[]> {
  const res = await fetch(`${BASE}/${encodeURIComponent(customerId)}/feature-waitlist`);
  const text = await res.text();
  if (!res.ok) throw new Error(text);
  const data = JSON.parse(text);
  return data.features || [];
}
