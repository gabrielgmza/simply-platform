const BASE = "/api/identity/customers";

export interface RequestEmailChangeResponse {
  requiresTotp: boolean;
}

export interface ConfirmEmailChangeResponse {
  ok: true;
  newEmail: string;
}

async function handle<T>(res: Response): Promise<T> {
  const text = await res.text();
  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try { const j = JSON.parse(text); msg = j.message || j.error || msg; } catch {}
    throw new Error(msg);
  }
  return text ? JSON.parse(text) : (undefined as any);
}

export async function requestEmailChange(customerId: string, newEmail: string): Promise<RequestEmailChangeResponse> {
  const res = await fetch(`${BASE}/${encodeURIComponent(customerId)}/email/request-change`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ newEmail }),
  });
  return handle<RequestEmailChangeResponse>(res);
}

export async function confirmEmailChange(
  customerId: string,
  emailOtp: string,
  totpCode?: string,
): Promise<ConfirmEmailChangeResponse> {
  const res = await fetch(`${BASE}/${encodeURIComponent(customerId)}/email/confirm-change`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ emailOtp, totpCode }),
  });
  return handle<ConfirmEmailChangeResponse>(res);
}
