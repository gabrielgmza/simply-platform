"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowDownUp, Bitcoin, CreditCard, TrendingUp, Receipt, ArrowRight, Loader2 } from "lucide-react";
import { Card } from "@simply/ui";
import { listOperations, type Operation, type OperationModule } from "@/lib/operations-api";

function moduleIcon(mod: OperationModule) {
  switch (mod) {
    case "crypto": return <Bitcoin className="w-4 h-4 text-amber-400" />;
    case "wallet": return <ArrowDownUp className="w-4 h-4 text-blue-400" />;
    case "originacion": return <CreditCard className="w-4 h-4 text-emerald-400" />;
    case "investment": return <TrendingUp className="w-4 h-4 text-violet-400" />;
    default: return <Receipt className="w-4 h-4 text-white/40" />;
  }
}

function formatType(type: string) {
  const labels: Record<string, string> = {
    crypto_buy: "Compra cripto",
    crypto_sell: "Venta cripto",
    cross_currency_transfer: "Transferencia",
    transfer: "Transferencia",
    loan: "Préstamo",
    advance: "Adelanto",
    investment: "Inversión",
    redemption: "Rescate",
    privado: "Préstamo personal",
    cuad: "Adelanto sueldo",
  };
  return labels[type] || type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

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

export default function RecentActivity({ customerId }: { customerId: string }) {
  const [ops, setOps] = useState<Operation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listOperations(customerId, { limit: 5 })
      .then(setOps)
      .catch(() => setOps([]))
      .finally(() => setLoading(false));
  }, [customerId]);

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-white">Actividad reciente</h3>
        {ops.length > 0 && (
          <Link href="/cuenta?tab=operaciones" className="text-xs text-white/50 hover:text-white inline-flex items-center gap-1">
            Ver todas <ArrowRight className="w-3 h-3" />
          </Link>
        )}
      </div>
      {loading ? (
        <div className="flex items-center justify-center py-6 text-white/40">
          <Loader2 className="w-4 h-4 animate-spin" />
        </div>
      ) : ops.length === 0 ? (
        <Card>
          <div className="p-6 text-center text-xs text-white/40">
            Cuando hagas tu primera operación, vas a verla acá.
          </div>
        </Card>
      ) : (
        <Card>
          <div className="divide-y divide-white/5">
            {ops.map((op) => (
              <div key={op.id} className="p-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                  {moduleIcon(op.module)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-white truncate">{formatType(op.type)}</div>
                  <div className="text-xs text-white/40">{timeAgo(op.createdAt)}</div>
                </div>
                <div className="text-sm text-white font-mono text-right">
                  ${parseFloat(op.amount).toLocaleString("es-AR", { minimumFractionDigits: 2 })}
                  <div className="text-[10px] text-white/40 uppercase">{op.currency}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
