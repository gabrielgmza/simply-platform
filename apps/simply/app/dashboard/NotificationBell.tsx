"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Bell, X, ExternalLink, CheckCheck, Inbox } from "lucide-react";
import { useToast } from "@/components/toast/Toast";
import OperationDetailModal from "@/components/operation/OperationDetailModal";
import {
  listNotifications, markRead, markAllRead, getUnreadCount,
  type Notification,
} from "@/lib/notifications-api";

const POLL_INTERVAL_MS = 30000;

export default function NotificationBell({ customerId }: { customerId: string }) {
  const [open, setOpen] = useState(false);
  const [notifs, setNotifs] = useState<Notification[]>([]);
  const [count, setCount] = useState(0);
  const [shake, setShake] = useState(false);
  const [detailOpId, setDetailOpId] = useState<string | null>(null);
  const lastUnreadIdsRef = useRef<Set<string>>(new Set());
  const toast = useToast();

  const fetchAll = useCallback(async () => {
    try {
      const [list, c] = await Promise.all([
        listNotifications(customerId, { limit: 20 }),
        getUnreadCount(customerId),
      ]);

      // Detectar nuevas (id no estaba antes)
      const previousIds = lastUnreadIdsRef.current;
      const newNotifs = list.filter((n) => !n.readAt && !previousIds.has(n.id));
      const currentUnreadIds = new Set(list.filter((n) => !n.readAt).map((n) => n.id));

      // Si hay nuevas y no es la primera carga, mostrar toast + shake
      if (newNotifs.length > 0 && previousIds.size > 0) {
        const latest = newNotifs[0];
        if (latest.isCritical) {
          toast.error(latest.title);
        } else {
          toast.success(latest.title);
        }
        setShake(true);
        setTimeout(() => setShake(false), 1500);
      }

      lastUnreadIdsRef.current = currentUnreadIds;
      setNotifs(list);
      setCount(c);
    } catch {}
  }, [customerId, toast]);

  // Initial load + polling
  useEffect(() => {
    fetchAll();
    const id = setInterval(fetchAll, POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [fetchAll]);

  // Cerrar dropdown al click fuera
  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      const t = e.target as HTMLElement;
      if (!t.closest("[data-notif-dropdown]")) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  // ¿Hay alguna crítica sin leer? → badge rojo
  const hasCritical = notifs.some((n) => !n.readAt && n.isCritical);

  async function handleItemClick(n: Notification) {
    // Auto-mark as read
    if (!n.readAt) {
      try {
        await markRead(customerId, [n.id]);
        setNotifs((prev) => prev.map((x) => x.id === n.id ? { ...x, readAt: new Date().toISOString() } : x));
        setCount((c) => Math.max(0, c - 1));
      } catch {}
    }

    // Si tiene operationId en metadata → abrir modal
    const opId = (n.metadata as any)?.operationId;
    if (opId && typeof opId === "string") {
      setDetailOpId(opId);
      setOpen(false);
      return;
    }

    // Si tiene ctaHref normal, navegar
    if (n.ctaHref) {
      setOpen(false);
      if (n.ctaHref.startsWith("http")) {
        window.open(n.ctaHref, "_blank", "noopener,noreferrer");
      } else {
        window.location.href = n.ctaHref;
      }
    }
  }

  async function handleMarkAllRead() {
    try {
      await markAllRead(customerId);
      setNotifs((prev) => prev.map((n) => ({ ...n, readAt: n.readAt || new Date().toISOString() })));
      setCount(0);
      toast.success("Todas marcadas como leídas");
    } catch (e: any) {
      toast.error(e.message);
    }
  }

  return (
    <>
      <div className="relative" data-notif-dropdown>
        <button
          onClick={() => setOpen((o) => !o)}
          className={`relative p-2 rounded-full bg-white/5 hover:bg-white/10 ring-1 ring-white/10 transition-colors ${shake ? "animate-shake" : ""}`}
          aria-label="Notificaciones"
        >
          <Bell className="w-4 h-4 text-white" />
          {count > 0 && (
            <span className={`absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold flex items-center justify-center ring-2 ring-black ${hasCritical ? "bg-red-500 text-white" : "bg-blue-500 text-white"}`}>
              {count > 9 ? "9+" : count}
            </span>
          )}
        </button>

        {open && (
          <div className="fixed sm:absolute top-16 sm:top-auto sm:mt-2 inset-x-3 sm:inset-x-auto sm:right-0 sm:w-96 bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-[60]">
            {/* Header del dropdown */}
            <div className="flex items-center justify-between p-3 border-b border-white/5">
              <h3 className="text-sm font-semibold text-white">Notificaciones</h3>
              <div className="flex items-center gap-1">
                {count > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="flex items-center gap-1 text-xs text-white/50 hover:text-white px-2 py-1 rounded"
                    title="Marcar todas como leídas"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Marcar todas</span>
                  </button>
                )}
                <button onClick={() => setOpen(false)} className="text-white/50 hover:text-white p-1">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="max-h-[60vh] sm:max-h-96 overflow-y-auto">
              {notifs.length === 0 ? (
                <div className="text-center py-12 px-4">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3">
                    <Inbox className="w-5 h-5 text-white/30" />
                  </div>
                  <p className="text-sm text-white">No tenés notificaciones</p>
                  <p className="text-xs text-white/40 mt-1">Te avisaremos cuando haya novedades.</p>
                </div>
              ) : (
                notifs.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => handleItemClick(n)}
                    className={`w-full text-left p-3 border-b border-white/5 last:border-0 hover:bg-white/[0.03] transition-colors ${!n.readAt ? "bg-blue-500/[0.05]" : ""}`}
                  >
                    <div className="flex items-start gap-2">
                      {!n.readAt && (
                        <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${n.isCritical ? "bg-red-400" : "bg-blue-400"}`} />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="text-sm text-white truncate font-medium">{n.title}</div>
                          {n.isCritical && (
                            <span className="text-[9px] uppercase tracking-wide text-red-300 bg-red-500/15 px-1.5 py-0.5 rounded shrink-0">
                              Importante
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-white/60 mt-0.5 line-clamp-2">{n.body}</div>
                        {n.ctaLabel && (
                          <div className="inline-flex items-center gap-1 text-xs text-blue-300 mt-1.5">
                            {n.ctaLabel}
                            <ExternalLink className="w-3 h-3" />
                          </div>
                        )}
                        <div className="text-[10px] text-white/30 mt-1">
                          {formatRelative(n.createdAt)}
                        </div>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      <OperationDetailModal
        operationId={detailOpId}
        open={detailOpId !== null}
        onClose={() => setDetailOpId(null)}
      />
    </>
  );
}

function formatRelative(iso: string): string {
  const d = new Date(iso);
  const diffMs = Date.now() - d.getTime();
  const min = Math.floor(diffMs / 60000);
  if (min < 1) return "Ahora";
  if (min < 60) return `Hace ${min}m`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `Hace ${hr}h`;
  const days = Math.floor(hr / 24);
  if (days < 7) return `Hace ${days}d`;
  return d.toLocaleDateString("es-AR");
}
