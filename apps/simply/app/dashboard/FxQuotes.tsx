"use client";

import { useEffect, useState } from "react";
import { DollarSign, Euro, Bitcoin, Loader2, RefreshCw } from "lucide-react";
import { getFxRates, type RateResult } from "@/lib/fx-api"
import { useUserLocation } from "@/lib/use-user-location"
import { currencyInfo } from "@/lib/country-currency";

// Orden y metadata visual de los pares
const PAIRS_META: Array<{ pair: string; label: string; icon: any; color: string }> = [
  { pair: "USD-ARS",  label: "Dólar",     icon: DollarSign, color: "text-emerald-300" },
  { pair: "USDT-ARS", label: "USDT",      icon: Bitcoin,    color: "text-amber-300" },
  { pair: "USDC-ARS", label: "USDC",      icon: Bitcoin,    color: "text-blue-300" },
  { pair: "EUR-ARS",  label: "Euro",      icon: Euro,       color: "text-violet-300" },
  { pair: "BTC-ARS",  label: "Bitcoin",   icon: Bitcoin,    color: "text-orange-300" },
  { pair: "ETH-ARS",  label: "Ethereum",  icon: Bitcoin,    color: "text-indigo-300" },
  { pair: "BRL-ARS",  label: "Real",      icon: DollarSign, color: "text-green-300" },
  { pair: "CLP-ARS",  label: "Peso CLP",  icon: DollarSign, color: "text-red-300" },
  { pair: "EUR-USD",  label: "EUR/USD",   icon: Euro,       color: "text-cyan-300" },
  { pair: "EUR-USDT", label: "EUR/USDT",  icon: Euro,       color: "text-pink-300" },
];

function formatRate(r: number): string {
  if (r < 1) return r.toFixed(4);
  if (r < 100) return r.toFixed(2);
  if (r < 100_000) {
    return r.toLocaleString("es-AR", { maximumFractionDigits: 2 });
  }
  // Cripto muy alto: formato compacto sin decimales
  return r.toLocaleString("es-AR", { maximumFractionDigits: 0 });
}

function formatPair(pair: string, rate: number): { from: string; toAmount: string } {
  const [from, to] = pair.split("-");
  const prefix = to === "ARS" ? "$" : to === "USD" ? "US$" : to + " ";
  return {
    from: `1 ${from}`,
    toAmount: `${prefix}${formatRate(rate)}`,
  };
}

export default function FxQuotes() {
  const { location } = useUserLocation({ askGps: true });
  const localCurrency = location?.currency || 'ARS';
  const [data, setData] = useState<Record<string, RateResult | { error: string }> | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function load() {
    try {
      const pairs = PAIRS_META.map((p) => p.pair);
      const r = await getFxRates(pairs);
      setData(r);
    } catch (e) {
      setData(null);
    }
  }

  async function refresh() {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-4 text-white/40">
        <Loader2 className="w-4 h-4 animate-spin" />
      </div>
    );
  }
  if (!data) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-2 px-1">
        <h3 className="text-sm font-semibold text-white">Cotizaciones</h3>
        <button
          onClick={refresh}
          disabled={refreshing}
          className="text-white/40 hover:text-white p-1"
          title="Refrescar"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 snap-x snap-mandatory">
        {PAIRS_META.map((meta) => {
          const result = data[meta.pair];
          const hasError = !result || "error" in result;
          const Icon = meta.icon;
          const formatted = !hasError ? formatPair(meta.pair, (result as RateResult).rate) : null;
          return (
            <div
              key={meta.pair}
              className="shrink-0 snap-start w-32 bg-white/5 ring-1 ring-white/10 rounded-2xl p-3"
            >
              <div className="flex items-center gap-1.5">
                <Icon className={`w-3.5 h-3.5 ${meta.color}`} />
                <span className="text-[10px] uppercase tracking-wide text-white/50">{meta.label}</span>
              </div>
              {hasError ? (
                <div className="text-xs text-white/40 mt-2">no disponible</div>
              ) : (
                <>
                  <div className="text-[10px] text-white/40 mt-1.5">{formatted!.from} =</div>
                  <div className="text-sm font-mono text-white mt-0.5 truncate" title={formatted!.toAmount}>
                    {formatted!.toAmount}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
