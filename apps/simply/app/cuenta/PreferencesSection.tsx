"use client";

import { Clock, Eye, Sparkles, Type, Check, Loader2 } from "lucide-react";
import { Card } from "@simply/ui";
import { usePreferences } from "@/lib/use-preferences";
import type { TextSize } from "@/lib/preferences-api";

const TIMEOUT_OPTIONS = [5, 15, 30, 60, 120];
const TEXT_SIZES: Array<{ value: TextSize; label: string }> = [
  { value: "small", label: "Pequeño" },
  { value: "normal", label: "Normal" },
  { value: "large", label: "Grande" },
  { value: "xlarge", label: "Muy grande" },
];

export default function PreferencesSection({ customerId }: { customerId: string }) {
  const { prefs, loading, saving, savedAt, update } = usePreferences(customerId);

  if (loading || !prefs) {
    return (
      <Card>
        <div className="p-5 flex items-center justify-center text-white/60">
          <Loader2 className="w-4 h-4 animate-spin mr-2" />
          Cargando preferencias...
        </div>
      </Card>
    );
  }

  const showSaved = savedAt && Date.now() - savedAt < 2500;

  return (
    <Card>
      <div className="p-5 space-y-6">
        <div className="flex items-center gap-2 text-white">
          <Sparkles className="w-5 h-5 text-violet-400" />
          <h3 className="font-semibold">Preferencias</h3>
          <div className="ml-auto flex items-center gap-1.5 text-xs">
            {saving && (
              <>
                <Loader2 className="w-3 h-3 animate-spin text-white/40" />
                <span className="text-white/40">Guardando...</span>
              </>
            )}
            {!saving && showSaved && (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400">Guardado</span>
              </>
            )}
          </div>
        </div>

        {/* ─── Timeout ─── */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-white/60" />
            <label className="text-sm text-white">Cerrar sesión por inactividad</label>
          </div>
          <div className="grid grid-cols-5 gap-1.5">
            {TIMEOUT_OPTIONS.map((m) => (
              <button
                key={m}
                onClick={() => update({ sessionTimeoutMinutes: m })}
                className={`text-xs py-2 rounded-lg transition-colors ${
                  prefs.sessionTimeoutMinutes === m
                    ? "bg-blue-500/20 ring-1 ring-blue-400/40 text-blue-200"
                    : "bg-white/5 hover:bg-white/10 text-white/70"
                }`}
              >
                {m < 60 ? `${m} min` : `${m / 60} h`}
              </button>
            ))}
          </div>
        </div>

        {/* ─── Tamaño texto ─── */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Type className="w-4 h-4 text-white/60" />
            <label className="text-sm text-white">Tamaño de texto</label>
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {TEXT_SIZES.map((t) => (
              <button
                key={t.value}
                onClick={() => update({ textSize: t.value })}
                className={`text-xs py-2 rounded-lg transition-colors ${
                  prefs.textSize === t.value
                    ? "bg-blue-500/20 ring-1 ring-blue-400/40 text-blue-200"
                    : "bg-white/5 hover:bg-white/10 text-white/70"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* ─── Alto contraste ─── */}
        <label className="flex items-start justify-between gap-4 cursor-pointer">
          <div className="flex-1">
            <div className="flex items-center gap-2 text-sm text-white">
              <Eye className="w-4 h-4 text-white/60" />
              Alto contraste
            </div>
            <div className="text-xs text-white/50 mt-0.5">
              Mejora la legibilidad para baja visión.
            </div>
          </div>
          <input
            type="checkbox"
            checked={prefs.highContrast}
            onChange={(e) => update({ highContrast: e.target.checked })}
            className="w-5 h-5 mt-0.5 accent-blue-500"
          />
        </label>

        {/* ─── Reducir movimiento ─── */}
        <label className="flex items-start justify-between gap-4 cursor-pointer">
          <div className="flex-1">
            <div className="flex items-center gap-2 text-sm text-white">
              <Sparkles className="w-4 h-4 text-white/60" />
              Reducir movimiento
            </div>
            <div className="text-xs text-white/50 mt-0.5">
              Minimiza animaciones y transiciones.
            </div>
          </div>
          <input
            type="checkbox"
            checked={prefs.reducedMotion}
            onChange={(e) => update({ reducedMotion: e.target.checked })}
            className="w-5 h-5 mt-0.5 accent-blue-500"
          />
        </label>
      </div>
    </Card>
  );
}
