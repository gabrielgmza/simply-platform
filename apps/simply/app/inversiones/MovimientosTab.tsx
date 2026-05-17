"use client";

import { useEffect, useState } from "react";
import { Card } from "@simply/ui";
import { Loader2, ArrowDown, ArrowUp, TrendingUp, Coins } from "lucide-react";
import { getInvestmentMovements, type InvestmentMovement } from "@/lib/investments-api";

const ICONS: Record<string, any> = {
  deposit: { Icon: ArrowDown, color: "text-emerald-400", label: "Depósito", sign: "+" },
  withdraw: { Icon: ArrowUp, color: "text-rose-400", label: "Retiro", sign: "-" },
  yield: { Icon: TrendingUp, color: "text-cyan-400", label: "Rendimiento", sign: "+" },
  fee: { Icon: Coins, color: "text-amber-400", label: "Comisión Simply", sign: "-" },
};

function fmt(n: number) {
  return new Intl.NumberFormat("es-AR", { minimumFractionDigits: 2 }).format(n);
}

export default function MovimientosTab({ customerId }: { customerId: string }) {
  const [items, setItems] = useState<InvestmentMovement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getInvestmentMovements(customerId)
      .then((r) => setItems(r.items))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [customerId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 text-white/60">
        <Loader2 className="w-5 h-5 animate-spin mr-2" /> Cargando...
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <Card>
        <div className="p-8 text-center text-white/50">Aún no hay movimientos.</div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="divide-y divide-white/5">
        {items.map((m) => {
          const cfg = ICONS[m.type] || ICONS.deposit;
          const I = cfg.Icon;
          return (
            <div key={m.id} className="flex items-center gap-3 p-3">
              <div className={`w-9 h-9 rounded-full bg-white/5 flex items-center justify-center ${cfg.color}`}>
                <I className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm text-white">{cfg.label}</div>
                <div className="text-xs text-white/40">
                  {new Date(m.createdAt).toLocaleString("es-AR", {
                    day: "2-digit",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
              <div className={`text-sm font-medium ${cfg.color}`}>
                {cfg.sign}{fmt(parseFloat(m.amount))}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
