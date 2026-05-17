"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Wallet as WalletIcon, Bitcoin, TrendingUp, CreditCard, ArrowRight,
  Receipt, Banknote, Check, Loader2,
} from "lucide-react";
import { Card } from "@simply/ui";
import { getBalances } from "@/lib/balances-api";
import { listOperations, type Operation } from "@/lib/operations-api";
import { joinWaitlist, getWaitlist, type FeatureKey } from "@/lib/waitlist-api";
import { getTierTheme } from "@/lib/tier-theme";

interface ProductCard {
  key: string;
  label: string;
  subtitle: string;
  icon: any;
  iconColor: string;
  href?: string;
}

// 4 features "próximamente"
const COMING_SOON: Array<{ feature: FeatureKey; label: string; subtitle: string; icon: any; iconColor: string }> = [
  { feature: "cards",       label: "Tarjetas",     subtitle: "Física + virtuales + uso único",   icon: CreditCard, iconColor: "text-pink-300" },
  { feature: "loans",       label: "Préstamos",    subtitle: "Crédito personal flexible",        icon: Banknote,   iconColor: "text-emerald-300" },
];

export default function ActiveProducts({ customerId, accountLevel }: { customerId: string; accountLevel?: string }) {
  const theme = getTierTheme(accountLevel);
  const [active, setActive] = useState<ProductCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [waitlist, setWaitlist] = useState<Set<FeatureKey>>(new Set());
  const [joining, setJoining] = useState<FeatureKey | null>(null);

  useEffect(() => {
    Promise.all([
      getBalances(customerId).catch(() => null),
      listOperations(customerId, { limit: 200 }).catch(() => [] as Operation[]),
      getWaitlist(customerId).catch(() => [] as FeatureKey[]),
    ]).then(([bal, ops, wl]) => {
      const cards: ProductCard[] = [];

      const arsBalance = parseFloat(bal?.balances?.ARS?.available || "0");
      if (bal?.linked && arsBalance > 0) {
        cards.push({
          key: "wallet-ars", label: "Wallet ARS",
          subtitle: `$${arsBalance.toLocaleString("es-AR", { minimumFractionDigits: 2 })} disponibles`,
          icon: WalletIcon, iconColor: "text-blue-400", href: "/wallet",
        });
      }

      const cryptoOps = ops.filter((o) => o.module === "crypto");
      if (cryptoOps.length > 0) {
        cards.push({
          key: "crypto", label: "Cripto",
          subtitle: `${cryptoOps.length} operacion${cryptoOps.length === 1 ? "" : "es"}`,
          icon: Bitcoin, iconColor: "text-amber-400", href: "/crypto",
        });
      }

      // Servicios disponibles para todos
      cards.push({
        key: "services", label: "Servicios",
        subtitle: "Pagar facturas y recargas",
        icon: Receipt, iconColor: "text-cyan-300", href: "/servicios",
      });

      setActive(cards);
      setWaitlist(new Set(wl));
      setLoading(false);
    });
  }, [customerId]);

  async function handleJoin(feature: FeatureKey) {
    setJoining(feature);
    try {
      await joinWaitlist(customerId, feature);
      setWaitlist((s) => new Set(s).add(feature));
    } catch {
      // ignore
    } finally {
      setJoining(null);
    }
  }

  if (loading) return null;

  return (
    <div className="space-y-4">
      {/* Productos activos */}
      {active.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-white mb-2">Tus productos</h3>
          <div className="grid grid-cols-2 gap-2">
            {active.map((p) => {
              const Icon = p.icon;
              const isExternal = p.href?.startsWith("http");
              const Wrapper: any = !p.href ? "div" : isExternal ? "a" : Link;
              const wrapperProps: any = !p.href ? {} : isExternal
                ? { href: p.href, target: "_blank", rel: "noopener noreferrer" }
                : { href: p.href };
              return (
                <Wrapper key={p.key} {...wrapperProps} className={`block bg-white/5 hover:bg-white/10 ring-1 ${theme.accentRing} rounded-2xl p-3 transition-colors`}>
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center ${p.iconColor}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    {p.href && <ArrowRight className="w-3.5 h-3.5 text-white/30 ml-auto" />}
                  </div>
                  <div className="text-sm text-white mt-2">{p.label}</div>
                  <div className="text-xs text-white/50 mt-0.5 truncate">{p.subtitle}</div>
                </Wrapper>
              );
            })}
          </div>
        </div>
      )}

      {/* Próximamente */}
      <div>
        <h3 className="text-sm font-semibold text-white mb-2">Próximamente</h3>
        <div className="grid grid-cols-2 gap-2">
          {COMING_SOON.map((c) => {
            const Icon = c.icon;
            const inWaitlist = waitlist.has(c.feature);
            const isJoining = joining === c.feature;
            return (
              <div key={c.feature} className="bg-white/[0.03] ring-1 ring-white/5 rounded-2xl p-3 relative overflow-hidden">
                <div className="absolute top-2 right-2 text-[9px] uppercase tracking-wide text-white/40 bg-white/5 px-1.5 py-0.5 rounded">
                  Próximamente
                </div>
                <div className={`w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center ${c.iconColor}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="text-sm text-white mt-2">{c.label}</div>
                <div className="text-xs text-white/50 mt-0.5 truncate">{c.subtitle}</div>
                <button
                  onClick={() => !inWaitlist && handleJoin(c.feature)}
                  disabled={inWaitlist || isJoining}
                  className={`mt-2.5 w-full flex items-center justify-center gap-1 text-xs py-1.5 rounded-lg transition-colors ${
                    inWaitlist
                      ? "bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-500/20"
                      : "bg-white/10 hover:bg-white/15 text-white"
                  }`}
                >
                  {isJoining ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : inWaitlist ? (
                    <>
                      <Check className="w-3 h-3" /> En la lista
                    </>
                  ) : (
                    "Avisame"
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
