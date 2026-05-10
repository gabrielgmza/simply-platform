/**
 * Cliente del módulo customer-book del backend.
 * Wraps fetch a /api/v1/customer-book/*
 */

export interface SavedWallet {
  id: string;
  customerId: string;
  label: string;
  symbol: string;
  network: string;
  address: string;
  createdAt: string;
  updatedAt: string;
}

export interface SavedBankAccount {
  id: string;
  customerId: string;
  label: string;
  country: string;
  currency: string;
  beneficiaryFirstName: string;
  beneficiaryLastName: string;
  documentType: string;
  documentNumber: string;
  beneficiaryEmail: string | null;
  beneficiaryPhone: string | null;
  bankCode: string | null;
  accountType: string;
  accountNumber: string;
  routingNumber: string | null;
  createdAt: string;
  updatedAt: string;
}

const BASE = "/api/customer-book"; // ruta del proxy Next

// ─── Wallets ───

export async function listWallets(customerId: string): Promise<SavedWallet[]> {
  const res = await fetch(`${BASE}/wallets?customerId=${customerId}`);
  if (!res.ok) throw new Error("No se pudieron cargar las wallets");
  return res.json();
}

export async function createWallet(
  customerId: string,
  dto: Omit<SavedWallet, "id" | "customerId" | "createdAt" | "updatedAt">,
): Promise<SavedWallet> {
  const res = await fetch(`${BASE}/wallets?customerId=${customerId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "No se pudo guardar la wallet");
  }
  return res.json();
}

export async function deleteWallet(customerId: string, walletId: string): Promise<void> {
  const res = await fetch(`${BASE}/wallets/${walletId}?customerId=${customerId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("No se pudo eliminar la wallet");
}

// ─── Bank accounts ───

export async function listBanks(customerId: string): Promise<SavedBankAccount[]> {
  const res = await fetch(`${BASE}/banks?customerId=${customerId}`);
  if (!res.ok) throw new Error("No se pudieron cargar las cuentas");
  return res.json();
}

export async function createBank(
  customerId: string,
  dto: Omit<SavedBankAccount, "id" | "customerId" | "createdAt" | "updatedAt">,
): Promise<SavedBankAccount> {
  const res = await fetch(`${BASE}/banks?customerId=${customerId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "No se pudo guardar la cuenta");
  }
  return res.json();
}

export async function deleteBank(customerId: string, bankId: string): Promise<void> {
  const res = await fetch(`${BASE}/banks/${bankId}?customerId=${customerId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("No se pudo eliminar la cuenta");
}
