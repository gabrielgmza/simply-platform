const BASE = "/api/customer-token";

export interface ShortLivedTokenResponse {
  token: string;
  expiresInSeconds: number;
  payload: {
    email: string;
    firstName: string | null;
    lastName: string | null;
    profileStatus: string;
    accountLevel: string;
  };
}

export async function getShortLivedToken(customerId: string): Promise<ShortLivedTokenResponse> {
  const res = await fetch(`${BASE}/short-lived`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ customerId }),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(text || `HTTP ${res.status}`);
  return JSON.parse(text);
}
