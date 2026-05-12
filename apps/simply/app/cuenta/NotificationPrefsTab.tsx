"use client";

import { useEffect, useState } from "react";
import { Bell, Lock, Loader2, AlertCircle } from "lucide-react";
import { Card } from "@simply/ui";
import { getNotificationPreferences, setNotificationPreference, type NotificationPreference } from "@/lib/notifications-api";

const CATEGORY_LABELS: Record<string, string> = {
  operation: "Operaciones",
  security: "Seguridad",
  commercial: "Promociones y novedades",
};

const CATEGORY_DESC: Record<string, string> = {
  operation: "Avisos sobre tus transferencias, compras y operaciones",
  security: "Alertas críticas de seguridad y actividad de la cuenta",
  commercial: "Beneficios, promociones y recomendaciones (opcional)",
};

export default function NotificationPrefsTab({ customerId }: { customerId: string }) {
  const [prefs, setPrefs] = useState<NotificationPreference[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await getNotificationPreferences(customerId);
      setPrefs(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [customerId]);

  async function toggle(p: NotificationPreference, channel: "inApp" | "email" | "push") {
    if (p.isCritical) return;
    const key = `${p.eventType}-${channel}`;
    setSaving(key);
    const newValue = !p[channel];
    setPrefs((prev) => prev.map((x) => (x.eventType === p.eventType ? { ...x, [channel]: newValue } : x)));
    try {
      await setNotificationPreference(customerId, p.eventType, { [channel]: newValue });
    } catch (e: any) {
      // Rollback
      setPrefs((prev) => prev.map((x) => (x.eventType === p.eventType ? { ...x, [channel]: !newValue } : x)));
      setError(e.message);
    } finally {
      setSaving(null);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8 text-white/60">
        <Loader2 className="w-5 h-5 animate-spin mr-2" />
        Cargando...
      </div>
    );
  }

  // Agrupar por categoría
  const grouped: Record<string, NotificationPreference[]> = {};
  for (const p of prefs) {
    if (!grouped[p.category]) grouped[p.category] = [];
    grouped[p.category].push(p);
  }

  return (
    <div id="notif-prefs" className="space-y-4">
      <div className="flex items-center gap-2 text-white">
        <Bell className="w-5 h-5 text-blue-400" />
        <h3 className="font-semibold">Preferencias de notificaciones</h3>
      </div>

      {error && (
        <div className="flex items-start gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg p-3">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {Object.entries(grouped).map(([cat, items]) => (
        <Card key={cat}>
          <div className="p-4 space-y-2">
            <div>
              <h4 className="text-sm font-semibold text-white">{CATEGORY_LABELS[cat] || cat}</h4>
              <p className="text-xs text-white/50 mt-0.5">{CATEGORY_DESC[cat] || ""}</p>
            </div>

            <div className="grid grid-cols-[1fr_auto_auto_auto] gap-x-3 gap-y-2 text-[10px] text-white/40 uppercase tracking-wide pt-2 border-t border-white/5">
              <div></div>
              <div className="text-center w-12">In-app</div>
              <div className="text-center w-12">Email</div>
              <div className="text-center w-12">Push</div>
            </div>

            {items.map((p) => {
              const locked = p.isCritical;
              return (
                <div key={p.eventType} className="grid grid-cols-[1fr_auto_auto_auto] gap-x-3 items-center py-1.5">
                  <div className="flex items-center gap-1.5 min-w-0">
                    {locked && <Lock className="w-3 h-3 text-white/30 shrink-0" />}
                    <span className="text-xs text-white truncate">{p.description}</span>
                  </div>
                  <ChannelToggle checked={p.inApp} locked={locked} loading={saving === `${p.eventType}-inApp`} onClick={() => toggle(p, "inApp")} />
                  <ChannelToggle checked={p.email} locked={locked} loading={saving === `${p.eventType}-email`} onClick={() => toggle(p, "email")} />
                  <ChannelToggle checked={p.push} locked={locked} loading={saving === `${p.eventType}-push`} onClick={() => toggle(p, "push")} />
                </div>
              );
            })}

            {items.some((p) => p.isCritical) && (
              <div className="text-[10px] text-white/40 pt-2 border-t border-white/5">
                <Lock className="w-3 h-3 inline mr-1" />
                Las notificaciones marcadas son críticas y no se pueden desactivar.
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}

function ChannelToggle({
  checked, locked, loading, onClick,
}: { checked: boolean; locked: boolean; loading: boolean; onClick: () => void }) {
  return (
    <div className="w-12 flex justify-center">
      <button
        onClick={onClick}
        disabled={locked || loading}
        className={`w-8 h-5 rounded-full relative transition-colors ${
          checked ? "bg-emerald-500" : "bg-white/10"
        } ${locked ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      >
        <span
          className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
            checked ? "translate-x-3.5" : "translate-x-0.5"
          }`}
        />
        {loading && <Loader2 className="w-3 h-3 animate-spin text-white absolute top-1 left-2.5" />}
      </button>
    </div>
  );
}
