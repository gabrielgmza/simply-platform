// Cliente API para customer-auth (settings + trusted devices)
// Usa el proxy /api/customer-auth/[[...path]]/route.ts

export interface SecuritySettings {
  customerId: string;
  alwaysRequireOtp: boolean;
  sensitiveAmountUsd: string; // numeric viene como string
  otpOnSensitiveOps: boolean;
  trustedDeviceTtlDays: number;
}

export interface TrustedDevice {
  id: string;
  label: string | null;
  userAgent: string | null;
  ipAddress: string | null;
  lastUsedAt: string;
  expiresAt: string;
  isCurrent: boolean;
}

export interface UpdateSettingsPatch {
  alwaysRequireOtp?: boolean;
  sensitiveAmountUsd?: number;
  otpOnSensitiveOps?: boolean;
  trustedDeviceTtlDays?: number;
}

const BASE = "/api/customer-auth";

async function handle<T>(res: Response): Promise<T> {
  const text = await res.text();
  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      const j = JSON.parse(text);
      msg = j.message || j.error || msg;
    } catch {}
    throw new Error(msg);
  }
  return text ? JSON.parse(text) : (undefined as any);
}

export async function getSecuritySettings(customerId: string): Promise<SecuritySettings> {
  const res = await fetch(`${BASE}/settings?customerId=${encodeURIComponent(customerId)}`);
  return handle<SecuritySettings>(res);
}

export async function updateSecuritySettings(
  customerId: string,
  patch: UpdateSettingsPatch,
): Promise<SecuritySettings> {
  const res = await fetch(`${BASE}/settings?customerId=${encodeURIComponent(customerId)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
  return handle<SecuritySettings>(res);
}

export async function listTrustedDevices(customerId: string): Promise<TrustedDevice[]> {
  const res = await fetch(`${BASE}/devices?customerId=${encodeURIComponent(customerId)}`);
  return handle<TrustedDevice[]>(res);
}

export async function revokeTrustedDevice(
  customerId: string,
  deviceId: string,
): Promise<{ ok: true }> {
  const res = await fetch(
    `${BASE}/devices/${encodeURIComponent(deviceId)}?customerId=${encodeURIComponent(customerId)}`,
    { method: "DELETE" },
  );
  return handle<{ ok: true }>(res);
}


// ─── TOTP (Google Authenticator) ───

export interface TotpStatus {
  enabled: boolean;
  backupCodesRemaining: number;
}

export interface TotpSetupResult {
  otpauthUri: string;
  qrDataUrl: string;
  secretBase32: string;
}

export interface TotpEnableResult {
  ok: true;
  backupCodes: string[];
}

export async function getTotpStatus(customerId: string): Promise<TotpStatus> {
  const res = await fetch(`${BASE}/totp/status?customerId=${encodeURIComponent(customerId)}`);
  return handle<TotpStatus>(res);
}

export async function setupTotp(customerId: string): Promise<TotpSetupResult> {
  const res = await fetch(`${BASE}/totp/setup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ customerId }),
  });
  return handle<TotpSetupResult>(res);
}

export async function enableTotp(customerId: string, code: string): Promise<TotpEnableResult> {
  const res = await fetch(`${BASE}/totp/enable`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ customerId, code }),
  });
  return handle<TotpEnableResult>(res);
}

export async function disableTotp(
  customerId: string,
  currentPassword: string,
): Promise<{ ok: true }> {
  const res = await fetch(`${BASE}/totp/disable`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ customerId, currentPassword }),
  });
  return handle<{ ok: true }>(res);
}
