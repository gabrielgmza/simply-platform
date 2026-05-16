export type OperationModule = "crypto" | "originacion" | "wallet" | "investment";
export type OperationStatus = "pending" | "processing" | "completed" | "failed" | "cancelled";

export interface Operation {
  id: string;
  customerId: string;
  module: OperationModule;
  type: string;
  status: OperationStatus;
  amount: string;
  currency: string;
  metadata: Record<string, any>;
  externalId: string | null;
  entityId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ListOpts {
  module?: OperationModule;
  status?: OperationStatus;
  limit?: number;
}

const BASE = "/api/operations";

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

export async function listOperations(
  customerId: string,
  opts: ListOpts = {},
): Promise<Operation[]> {
  const params = new URLSearchParams({ customerId });
  if (opts.module) params.set("module", opts.module);
  if (opts.status) params.set("status", opts.status);
  if (opts.limit) params.set("limit", String(opts.limit));
  const res = await fetch(`${BASE}?${params.toString()}`);
  return handle<Operation[]>(res);
}

export async function getOperation(id: string): Promise<Operation> {
  const res = await fetch(`/api/operations/${encodeURIComponent(id)}`);
  const text = await res.text();
  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try { const j = JSON.parse(text); msg = j.message || msg; } catch {}
    throw new Error(msg);
  }
  return JSON.parse(text);
}
