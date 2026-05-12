"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bell, X, ArrowRight, CheckCheck, Loader2 } from "lucide-react";
import {
  listNotifications,
  getUnreadCount,
  markRead,
  markAllRead,
  dismissNotification,
  type Notification,
} from "@/lib/notifications-api";

function timeAgo(d: string): string {
  const ms = Date.now() - new Date(d).getTime();
  const m = Math.floor(ms / 60000);
  if (m < 1) return "ahora";
  if (m < 60) return `hace ${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `hace ${h}h`;
  const days = Math.floor(h / 24);
  if (days < 7) return `hace ${days}d`;
  return new Date(d).toLocaleDateString("es-AR", { day: "2-digit", month: "short" });
}

const CATEGORY_COLOR: Record<string, string> = {
  operation: "text-blue-300",
  security: "text-red-300",
  commercial: "text-violet-300",
};

export default function NotificationBell({ customerId }: { customerId: string }) {
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const [items, setItems] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  async function refreshCount() {
    try {
      const c = await getUnreadCount(customerId);
      setUnread(c);
    } catch {}
  }

  async function loadList() {
    setLoading(true);
    try {
      const data = await listNotifications(customerId, { limit: 20 });
      setItems(data);
      // Marcar las que no estaban leídas
      const unreadIds = data.filter((n) => !n.readAt).map((n) => n.id);
      if (unreadIds.length > 0) {
        markRead(customerId, unreadIds).then(refreshCount).catch(() => null);
      }
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  // Poll cada 60s
  useEffect(() => {
    refreshCount();
    const t = setInterval(refreshCount, 60_000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerId]);

  // Cargar al abrir
  useEffect(() => {
    if (open) loadList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Cerrar al click fuera
  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  async function handleDismiss(id: string) {
    setItems((prev) => prev.filter((n) => n.id !== id));
    try { await dismissNotification(customerId, id); } catch {}
  }

  async function handleMarkAll() {
    try {
      await markAllRead(customerId);
      setUnread(0);
      setItems((prev) => prev.map((n) => ({ ...n, readAt: n.readAt || new Date().toISOString() })));
    } catch {}
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 ring-1 ring-white/10 flex items-center justify-center text-white/70"
        title="Notificaciones"
      >
        <Bell className="w-4 h-4" />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-medium flex items-center justify-center">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 max-h-[70vh] overflow-hidden bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl z-50">
          <div className="flex items-center justify-between p-3 border-b border-white/5">
            <h4 className="text-sm font-semibold text-white">Notificaciones</h4>
            <div className="flex items-center gap-1">
              {items.some((n) => !n.readAt) && (
                <button onClick={handleMarkAll} className="text-xs text-white/50 hover:text-white p-1" title="Marcar todas como leídas">
                  <CheckCheck className="w-4 h-4" />
                </button>
              )}
              <Link
                href="/cuenta?tab=settings#notif-prefs"
                onClick={() => setOpen(false)}
                className="text-[10px] text-white/40 hover:text-white"
              >
                Preferencias
              </Link>
            </div>
          </div>

          <div className="overflow-y-auto max-h-[60vh]">
            {loading ? (
              <div className="flex items-center justify-center py-8 text-white/40">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
            ) : items.length === 0 ? (
              <div className="p-8 text-center text-xs text-white/40">
                Sin notificaciones por ahora
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {items.map((n) => {
                  const isUnread = !n.readAt;
                  return (
                    <div key={n.id} className={`p-3 flex items-start gap-2 ${isUnread ? "bg-blue-500/5" : ""}`}>
                      <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${isUnread ? "bg-blue-400" : "bg-transparent"}`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] uppercase tracking-wide ${CATEGORY_COLOR[n.category] || "text-white/40"}`}>
                            {n.category}
                          </span>
                          <span className="text-[10px] text-white/40">{timeAgo(n.createdAt)}</span>
                        </div>
                        <div className="text-sm text-white truncate mt-0.5">{n.title}</div>
                        {n.body && <div className="text-xs text-white/60 mt-0.5 line-clamp-2">{n.body}</div>}
                        {n.ctaHref && n.ctaLabel && (
                          <a
                            href={n.ctaHref}
                            target={n.ctaHref.startsWith("http") ? "_blank" : undefined}
                            rel={n.ctaHref.startsWith("http") ? "noopener noreferrer" : undefined}
                            className="inline-flex items-center gap-1 text-xs text-blue-300 hover:text-blue-200 font-medium mt-1.5"
                          >
                            {n.ctaLabel}
                            <ArrowRight className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                      <button
                        onClick={() => handleDismiss(n.id)}
                        className="text-white/30 hover:text-white/70 p-1"
                        title="Descartar"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
