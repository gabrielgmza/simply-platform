"use client";

const KEY = "simply_session";

export interface Session {
  customerId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  pendingQuote?: any;
  profileStatus?: 'LEAD' | 'GUEST' | 'REGISTERED' | 'VERIFIED_BASIC' | 'VERIFIED_FULL';
  accountLevel?: string;
  country?: string;
  documentType?: string;
  documentNumber?: string;
  phone?: string;
  phoneCountryCode?: string;
}

export function getSession(): Session | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : null;
}

export function setSession(s: Session) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(s));
}

export function clearSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
}

export function patchSession(patch: Partial<Session>) {
  const cur = getSession();
  if (!cur) return;
  setSession({ ...cur, ...patch });
}
