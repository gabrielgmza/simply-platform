export interface Biller {
  id: string;
  country: string;
  category: string;
  code: string;
  name: string;
  logoUrl: string | null;
  referenceLabel: string;
  referenceRegex: string | null;
  providerKind: string;
  active: boolean;
  sortOrder: number;
}

export interface Bill {
  id: string;
  billerId: string;
  reference: string;
  amount: number | null;
  dueDate: string | null;
  beneficiary: string | null;
  status: "pending" | "paid" | "expired" | "cancelled";
  expiresAt: string | null;
  createdAt: string;
}

export interface ServicePayment {
  id: string;
  customerId: string;
  billerId: string;
  billId: string | null;
  reference: string;
  amount: number;
  currency: string;
  status: "pending" | "completed" | "failed" | "refunded";
  providerExternalId: string | null;
  scheduledPaymentId: string | null;
  createdAt: string;
  completedAt: string | null;
}

export interface ScheduledPayment {
  id: string;
  customerId: string;
  billerId: string;
  reference: string;
  nickname: string | null;
  frequency: "monthly" | "weekly" | "one_time_on_due";
  amountStrategy: "fixed" | "invoice_amount" | "up_to_max";
  fixedAmount: number | null;
  maxAmount: number | null;
  nextExecutionAt: string | null;
  lastExecutionAt: string | null;
  lastStatus: string | null;
  paused: boolean;
  createdAt: string;
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

// ─── Billers ───
export async function listBillers(country?: string, category?: string): Promise<Biller[]> {
  const params = new URLSearchParams();
  if (country) params.set("country", country);
  if (category) params.set("category", category);
  const q = params.toString();
  const res = await fetch(`/api/billers${q ? "?" + q : ""}`);
  return handle<Biller[]>(res);
}

export async function lookupBill(billerId: string, reference: string, customerId?: string): Promise<Bill> {
  const res = await fetch(`/api/billers/${encodeURIComponent(billerId)}/lookup-bill`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reference, customerId }),
  });
  return handle<Bill>(res);
}

// ─── Pagos ───
export async function executePayment(input: {
  customerId: string;
  billerId: string;
  reference: string;
  amount: number;
  billId?: string;
}): Promise<ServicePayment> {
  const res = await fetch(`/api/service-payments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return handle<ServicePayment>(res);
}

export async function listPayments(customerId: string, limit?: number): Promise<ServicePayment[]> {
  const params = limit ? `?limit=${limit}` : "";
  const res = await fetch(`/api/customer/${encodeURIComponent(customerId)}/service-payments${params}`);
  return handle<ServicePayment[]>(res);
}

// ─── Programados ───
export async function listScheduled(customerId: string): Promise<ScheduledPayment[]> {
  const res = await fetch(`/api/customer/${encodeURIComponent(customerId)}/scheduled-payments`);
  return handle<ScheduledPayment[]>(res);
}

export async function createScheduled(customerId: string, input: any): Promise<ScheduledPayment> {
  const res = await fetch(`/api/customer/${encodeURIComponent(customerId)}/scheduled-payments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return handle<ScheduledPayment>(res);
}

export async function updateScheduled(customerId: string, id: string, patch: any): Promise<ScheduledPayment> {
  const res = await fetch(`/api/customer/${encodeURIComponent(customerId)}/scheduled-payments/${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
  return handle<ScheduledPayment>(res);
}

export async function deleteScheduled(customerId: string, id: string): Promise<void> {
  await fetch(`/api/customer/${encodeURIComponent(customerId)}/scheduled-payments/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}

export interface ServicePaymentDetail extends ServicePayment {
  biller: {
    id: string;
    name: string;
    code: string;
    category: string;
    country: string;
    referenceLabel: string;
  } | null;
}

export async function getServicePayment(id: string): Promise<ServicePaymentDetail> {
  const res = await fetch(`/api/service-payments/${encodeURIComponent(id)}`);
  return handle<ServicePaymentDetail>(res);
}
