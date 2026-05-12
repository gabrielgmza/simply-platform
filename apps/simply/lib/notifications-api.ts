export type NotificationCategory = "operation" | "security" | "commercial";

export interface Notification {
  id: string;
  customerId: string;
  eventType: string;
  category: NotificationCategory;
  title: string;
  body: string | null;
  metadata: Record<string, any> | null;
  ctaLabel: string | null;
  ctaHref: string | null;
  readAt: string | null;
  dismissedAt: string | null;
  createdAt: string;
}

export interface NotificationPreference {
  eventType: string;
  category: NotificationCategory;
  description: string;
  isCritical: boolean;
  inApp: boolean;
  email: boolean;
  push: boolean;
}

const BASE = "/api/customer";

async function handle<T>(res: Response): Promise<T> {
  const text = await res.text();
  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try { const j = JSON.parse(text); msg = j.message || j.error || msg; } catch {}
    throw new Error(msg);
  }
  return text ? JSON.parse(text) : (undefined as any);
}

export async function listNotifications(customerId: string, opts: { limit?: number; unreadOnly?: boolean } = {}): Promise<Notification[]> {
  const params = new URLSearchParams();
  if (opts.limit) params.set("limit", String(opts.limit));
  if (opts.unreadOnly) params.set("unreadOnly", "1");
  const q = params.toString();
  const res = await fetch(`${BASE}/${encodeURIComponent(customerId)}/notifications${q ? "?" + q : ""}`);
  return handle<Notification[]>(res);
}

export async function getUnreadCount(customerId: string): Promise<number> {
  const res = await fetch(`${BASE}/${encodeURIComponent(customerId)}/notifications/unread-count`);
  const data = await handle<{ count: number }>(res);
  return data.count;
}

export async function markRead(customerId: string, ids: string[]): Promise<void> {
  await fetch(`${BASE}/${encodeURIComponent(customerId)}/notifications/mark-read`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ids }),
  });
}

export async function markAllRead(customerId: string): Promise<void> {
  await fetch(`${BASE}/${encodeURIComponent(customerId)}/notifications/mark-all-read`, {
    method: "POST",
  });
}

export async function dismissNotification(customerId: string, id: string): Promise<void> {
  await fetch(`${BASE}/${encodeURIComponent(customerId)}/notifications/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}

export async function getNotificationPreferences(customerId: string): Promise<NotificationPreference[]> {
  const res = await fetch(`${BASE}/${encodeURIComponent(customerId)}/notifications/preferences`);
  return handle<NotificationPreference[]>(res);
}

export async function setNotificationPreference(
  customerId: string,
  eventType: string,
  patch: { inApp?: boolean; email?: boolean; push?: boolean },
): Promise<void> {
  await fetch(`${BASE}/${encodeURIComponent(customerId)}/notifications/preferences/${encodeURIComponent(eventType)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
}
