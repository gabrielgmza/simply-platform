"use client";

import { useEffect, useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { getBalances, type BalancesResponse } from "@/lib/balances-api";

export default function BalanceHero({ customerId, firstName }: { customerId: string; firstName?: string }) {
  const [data, setData] = useState<BalancesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("simply_hide_balance") : null;
    if (stored === "1") setHidden(true);

    getBalances(customerId)
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [customerId]);

  function toggleHide() {
    const next = !hidden;
    setHidden(next);
    if (typeof window !== "undefined") {
      localStorage.setItem("simply_hide_balance", next ? "1" : "0");
    }
  }

  const totalArs = parseFloat(data?.totalArsEquivalent || "0");

  return (
    <div className="bg-gradient-to-br from-blue-600/30 via-violet-600/20 to-emerald-600/20 ring-1 ring-white/10 rounded-3xl p-6">
      <div className="text-sm text-white/70">
        Hola{firstName ? `, ${firstName}` : ""} 👋
      </div>
      <div className="text-xs text-white/50 mt-3 uppercase tracking-wide">Saldo total</div>
      <div className="flex items-baseline gap-2 mt-1">
        {loading ? (
          <Loader2 className="w-6 h-6 animate-spin text-white/60" />
        ) : hidden ? (
          <span className="text-3xl font-bold text-white tracking-tight">$•••••••</span>
        ) : (
          <span className="text-3xl font-bold text-white tracking-tight">
            ${totalArs.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
          </span>
        )}
        <span className="text-sm text-white/50">ARS</span>
        <button onClick={toggleHide} className="ml-auto text-white/50 hover:text-white" title={hidden ? "Mostrar" : "Ocultar"}>
          {hidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
      {!data?.linked && !loading && (
        <div className="mt-3 text-xs text-white/50">
          Cargá saldo para empezar a operar.
        </div>
      )}
    </div>
  );
}
