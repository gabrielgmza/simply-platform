"use client";

import { useParams } from "next/navigation";
import { CheckCircle2, Clock, Loader2, AlertCircle } from "lucide-react";
import { Card, MoneyDisplay, StatusBadge, Button, useOrderTracking } from "@simply/ui";

const STATUS_ICON: Record<string, { icon: any; spin?: boolean; color: string }> = {
  awaiting_funding: { icon: Clock, color: "text-amber-400" },
  funding_received: { icon: Loader2, spin: true, color: "text-blue-400" },
  started:          { icon: Loader2, spin: true, color: "text-blue-400" },
  swapping:         { icon: Loader2, spin: true, color: "text-blue-400" },
  executing_payout: { icon: Loader2, spin: true, color: "text-blue-400" },
  pending:          { icon: Clock, color: "text-amber-400" },
  completed:        { icon: CheckCircle2, color: "text-green-400" },
  denied:           { icon: AlertCircle, color: "text-red-400" },
  failed:           { icon: AlertCircle, color: "text-red-400" },
};

export default function ExitoPage() {
  const params = useParams();
  const order = params.order as string;
  const { tx, error } = useOrderTracking(order);

  if (error) {
    return (
      <div className="space-y-4 text-center py-8">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto" />
        <h1 className="text-xl font-semibold">Error</h1>
        <p className="text-sm text-white/60">{error}</p>
        <a href="/">
          <Button variant="secondary">Volver al inicio</Button>
        </a>
      </div>
    );
  }

  if (!tx) return <div className="text-center py-12 text-white/60">Cargando...</div>;

  const config = STATUS_ICON[tx.status] || STATUS_ICON.started;
  const Icon = config.icon;

  const sourceAsset = tx.sourceAsset;
  const destAsset = tx.destinationAsset;
  const sourceCode = sourceAsset.kind === "fiat" ? sourceAsset.currency : sourceAsset.symbol;
  const destCode = destAsset.kind === "fiat" ? destAsset.currency : destAsset.symbol;

  return (
    <div className="space-y-6">
      <div className="text-center space-y-3">
        <div className="w-16 h-16 rounded-2xl bg-accent-500/15 mx-auto flex items-center justify-center">
          <Icon className={`w-8 h-8 ${config.color} ${config.spin ? "animate-spin" : ""}`} />
        </div>
        <div className="flex justify-center">
          <StatusBadge status={tx.status} />
        </div>
        <p className="text-sm text-white/60">Orden #{tx.order}</p>
      </div>

      <Card className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-white/50">Enviado</span>
          <MoneyDisplay amount={parseFloat(tx.sourceAmount)} currency={sourceCode} size="sm" />
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-white/50">Destino recibe</span>
          <MoneyDisplay amount={parseFloat(tx.beneficiaryReceives)} currency={destCode} size="sm" highlight />
        </div>
      </Card>

      {tx.status === "awaiting_funding" && (
        <Card className="bg-amber-500/5 border-amber-500/20 space-y-2">
          <div className="text-sm font-medium text-amber-200">Falta pagar a Simply</div>
          <p className="text-xs text-amber-100/80">
            Una vez que recibamos tu transferencia, ejecutamos el envío automáticamente.
          </p>
        </Card>
      )}

      {!["completed", "denied", "failed"].includes(tx.status) && tx.status !== "awaiting_funding" && (
        <Card className="bg-blue-500/5 border-blue-500/20">
          <p className="text-sm text-blue-200/90">⏳ Procesando tu envío...</p>
        </Card>
      )}

      {tx.status === "completed" && (
        <Card className="bg-green-500/5 border-green-500/20">
          <p className="text-sm text-green-200/90">✅ Operación completada con éxito.</p>
        </Card>
      )}

      <a href="/">
        <Button variant="secondary">Hacer otro envío</Button>
      </a>
    </div>
  );
}
