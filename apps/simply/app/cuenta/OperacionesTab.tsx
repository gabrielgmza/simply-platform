"use client";

import { useEffect, useState } from "react";
import OperationDetailModal from "@/components/operation/OperationDetailModal";
import { ArrowDownUp, Bitcoin, CreditCard, TrendingUp, Loader2, AlertCircle, Receipt, RefreshCw } from "lucide-react";
import { Card } from "@simply/ui";
import { listOperations, type Operation, type OperationModule, type OperationStatus } from "@/lib/operations-api";

const MODULE_OPTIONS: Array<{ value: "" | OperationModule; label: string }> = [
  { value: "", label: "Todos" },
  { value: "wallet", label: "Transferencias" },
  { value: "crypto", label: "Cripto" },
  { value: "originacion", label: "Créditos" },
  { value: "investment", label: "Inversiones" },
];

const STATUS_OPTIONS: Array<{ value: "" | OperationStatus; label: string }> = [
  { value: "", label: "Todos" },
  { value: "pending", label: "Pendiente" },
  { value: "processing", label: "En proceso" },
  { value: "completed", label: "Completada" },
  { value: "failed", label: "Falló" },
  { value: "cancelled", label: "Cancelada" },
];

function moduleIcon(mod: OperationModule) {
  switch (mod) {
    case "crypto": return <Bitcoin className="w-4 h-4 text-amber-400" />;
    case "wallet": return <ArrowDownUp className="w-4 h-4 text-blue-400" />;
    case "originacion": return <CreditCard className="w-4 h-4 text-emerald-400" />;
    case "investment": return <TrendingUp className="w-4 h-4 text-violet-400" />;
    default: return <Receipt className="w-4 h-4 text-white/40" />;
  }
}

function statusBadge(s: OperationStatus) {
  const map: Record<OperationStatus, { bg: string; text: string; label: string }> = {
    pending: { bg: "bg-amber-500/15", text: "text-amber-300", label: "Pendiente" },
    processing: { bg: "bg-blue-500/15", text: "text-blue-300", label: "En proceso" },
    completed: { bg: "bg-emerald-500/15", text: "text-emerald-300", label: "Completada" },
    failed: { bg: "bg-red-500/15", text: "text-red-300", label: "Falló" },
    cancelled: { bg: "bg-white/5", text: "text-white/50", label: "Cancelada" },
  };
  const { bg, text, label } = map[s] || map.pending;
  return <span className={`text-[10px] px-2 py-0.5 rounded-full ${bg} ${text} uppercase tracking-wide`}>{label}</span>;
}

function formatAmount(amount: string, currency: string) {
  const n = parseFloat(amount);
  if (isNaN(n)) return `${amount} ${currency}`;
  const cryptos = ["BTC", "ETH", "USDT", "USDC"];
  const decimals = cryptos.includes(currency.toUpperCase()) ? 8 : 2;
  return `${n.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: decimals })} ${currency}`;
}

function formatType(type: string) {
  const labels: Record<string, string> = {
    crypto_buy: "Compra cripto",
    crypto_sell: "Venta cripto",
    cross_currency_transfer: "Transferencia internacional",
    transfer: "Transferencia",
    loan: "Préstamo",
    advance: "Adelanto",
    investment: "Inversión",
    redemption: "Rescate",
  };
  return labels[type] || type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function OperacionesTab({ customerId }: { customerId: string }) {
  const [detailId, setDetailId] = useState<string | null>(null);
  const [ops, setOps] = useState<Operation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [moduleFilter, setModuleFilter] = useState<"" | OperationModule>("");
  const [statusFilter, setStatusFilter] = useState<"" | OperationStatus>("");

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await listOperations(customerId, {
        module: moduleFilter || undefined,
        status: statusFilter || undefined,
        limit: 100,
      });
      setOps(data);
    } catch (e: any) {
      setError(e.message || "Error cargando operaciones");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerId, moduleFilter, statusFilter]);

  return (
    <>
      <div className="space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        <select
          value={moduleFilter}
          onChange={(e) => setModuleFilter(e.target.value as any)}
          className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white"
        >
          {MODULE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value} className="bg-zinc-900">{o.label}</option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white"
        >
          {STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value} className="bg-zinc-900">{o.label}</option>
          ))}
        </select>
        <button
          onClick={load}
          className="ml-auto flex items-center gap-1 text-sm text-white/60 hover:text-white"
          disabled={loading}
          title="Refrescar"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {error && (
        <div className="flex items-start gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg p-3">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading && ops.length === 0 ? (
        <div className="flex items-center justify-center py-12 text-white/60">
          <Loader2 className="w-5 h-5 animate-spin mr-2" />
          Cargando...
        </div>
      ) : ops.length === 0 ? (
        <Card>
          <div className="p-8 text-center text-white/60">
            <Receipt className="w-10 h-10 mx-auto mb-3 text-white/30" />
            <p className="text-sm">No hay operaciones para mostrar.</p>
          </div>
        </Card>
      ) : (
        <Card>
          <div className="divide-y divide-white/5">
            {ops.map((op) => (
              <div key={op.id} onClick={() => setDetailId(op.id)} className="p-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                  {moduleIcon(op.module)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-white truncate">{formatType(op.type)}</span>
                    {statusBadge(op.status)}
                  </div>
                  <div className="text-xs text-white/40 mt-0.5">
                    {new Date(op.createdAt).toLocaleString("es-AR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                    {op.entityId && ` · ${op.entityId.slice(0, 8)}`}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-sm text-white font-mono">{formatAmount(op.amount, op.currency)}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>

      <OperationDetailModal
        operationId={detailId}
        open={detailId !== null}
        onClose={() => setDetailId(null)}
      />
    </>
  );
}
