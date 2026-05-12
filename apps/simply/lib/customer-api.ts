// Cliente API para identity customers

export interface CustomerProfile {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  phoneCountryCode: string | null;
  documentType: string | null;
  documentNumber: string | null;
  profileStatus: string;
  accountLevel: string;
  photoUrl: string | null;
  emailVerified?: boolean;
}

const BASE = "/api/identity";

async function handle<T>(res: Response): Promise<T> {
  const text = await res.text();
  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try { const j = JSON.parse(text); msg = j.message || j.error || msg; } catch {}
    throw new Error(Array.isArray(msg) ? msg.join(", ") : msg);
  }
  return text ? JSON.parse(text) : (undefined as any);
}

export async function getCustomer(customerId: string): Promise<CustomerProfile> {
  const res = await fetch(`${BASE}/customers/${encodeURIComponent(customerId)}`);
  return handle<CustomerProfile>(res);
}

export async function updateCustomer(customerId: string, patch: Partial<CustomerProfile>): Promise<CustomerProfile> {
  const res = await fetch(`${BASE}/customers/${encodeURIComponent(customerId)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
  return handle<CustomerProfile>(res);
}

// ─── Upload foto perfil (signed URL flow) ───
export async function uploadAvatar(customerId: string, file: File): Promise<string> {
  // 1. Pedir signed URL
  const signedRes = await fetch(`${BASE}/customers/${encodeURIComponent(customerId)}/signed-upload-url`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ kind: "avatar", mimeType: file.type }),
  });
  const signed = await handle<{ uploadUrl: string; gcsPath: string; publicUrl?: string }>(signedRes);

  // 2. Upload directo a GCS
  const putRes = await fetch(signed.uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });
  if (!putRes.ok) throw new Error("Error subiendo la imagen");

  // 3. Devolver URL pública (o GCS path)
  return signed.publicUrl || signed.gcsPath;
}
