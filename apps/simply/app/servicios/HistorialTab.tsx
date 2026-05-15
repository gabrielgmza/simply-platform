"use client";

import { useEffect, useState } from "react";
import { Receipt, CheckCircle, XCircle, Clock, Loader2 } from "lucide-react";
import { listPayments, type ServicePayment } from "@/lib/services-api";

export default function HistorialTab({ customerId }: { customerId: string }) {
  const [items, setItems] = useState<ServicePayment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listPayments(customerId, 50)
      .then(setItems)
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [customerId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-5 h-5 animate-spin text-white/40" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12 bg-white/5 ring-1 ring-white/10 rounded-2xl">
        <Receipt className="w-10 h-10 text-white/30 mx-auto mb-3" />
        <p className="text-sm text-white">Sin pagos todavía</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {items.map((p) => {
        const Icon =
          p.status === "completed" ? CheckCircle :
          p.status === "failed" ? XCircle :
          Clock;
        const color =
          p.status === "completed" ? "text-emerald-300" :
          p.status === "failed" ? "text-red-300" :
          "text-amber-300";
        return (
          <div key={p.id} className="bg-white/5 ring-1 ring-white/10 rounded-xl p-3 flex items-center gap-3">
            <Icon className={`w-5 h-5 ${color} shrink-0`} />
            <div className="flex-1 min-w-0">
              <div className="text-sm text-white truncate font-mono">{p.reference}</div>
              <div className="text-xs text-white/50">
                {new Date(p.createdAt).toLocaleDateString("es-AR")} · {p.currency}
              </div>
            </div>
            <div className="text-sm text-white">
              ${p.amount.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
