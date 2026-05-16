"use client";

import { useEffect, useState } from "react";
import { getTierTheme } from "@/lib/tier-theme";
import { Award, Crown, Loader2 } from "lucide-react";
import { getTierProgress, type TierProgress as TP } from "@/lib/tier-api";


function fmt(n: string | number): string {
  const num = typeof n === "string" ? parseFloat(n) : n;
  if (isNaN(num)) return "$0";
  return "$" + num.toLocaleString("es-AR", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

export default function TierProgressCard({ customerId, accountLevel }: { customerId: string; accountLevel?: string }) {
  const theme = getTierTheme(accountLevel);
  const [data, setData] = useState<TP | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTierProgress(customerId)
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [customerId]);

  if (loading) {
    return (
      <div className="bg-white/5 ring-1 ring-white/10 rounded-2xl p-4 flex items-center justify-center">
        <Loader2 className="w-4 h-4 animate-spin text-white/40" />
      </div>
    );
  }
  if (!data) return null;

    const Icon = data.isMax ? Crown : Award;

  return (
    <div className={`rounded-2xl p-4 ring-1 ${theme.heroRing} ${theme.accentBg}`}>
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[10px] uppercase tracking-wide text-white/40">Tu nivel</div>
          <div className={`text-lg font-semibold ${theme.accentText} flex items-center gap-2 mt-0.5`}>
            <Icon className="w-5 h-5" />
            {data.currentTierLabel}
          </div>
        </div>
        {!data.isMax && (
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-wide text-white/40">Próximo</div>
            <div className="text-sm text-white mt-0.5">{data.nextTierLabel}</div>
          </div>
        )}
      </div>

      {data.isMax ? (
        <p className="text-sm text-white/70 mt-3">
          ¡Estás en el nivel máximo! Disfrutá de todos los beneficios premium.
        </p>
      ) : (
        <>
          <div className="mt-3">
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className={`h-full ${theme.progressBar} transition-all duration-500`}
                style={{ width: `${Math.round(data.progress * 100)}%` }}
              />
            </div>
            <div className="flex justify-between mt-1.5 text-[11px] text-white/50">
              <span>{fmt(data.accumulated90dArs)} acumulado</span>
              <span>{fmt(data.thresholdArs || 0)}</span>
            </div>
          </div>

          <div className="mt-3 text-xs text-white/60">
            Te faltan <span className="text-white font-medium">{fmt(data.remaining)}</span> para subir a{" "}
            <span className={theme.accentText + " font-medium"}>{data.nextTierLabel}</span>
          </div>

          {data.nextBenefits.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {data.nextBenefits.map((b, i) => (
                <span
                  key={i}
                  className="text-[10px] bg-white/5 ring-1 ring-white/10 rounded-full px-2 py-0.5 text-white/70"
                >
                  {b}
                </span>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
