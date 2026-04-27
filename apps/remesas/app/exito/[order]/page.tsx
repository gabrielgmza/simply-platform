"use client";

import { useParams } from "next/navigation";
import { CheckCircle2, Clock, Loader2, AlertCircle } from "lucide-react";
import { useOrderTracking } from "@simply/ui";
import { Card, StepIndicator, MoneyDisplay, StatusBadge, Button } from "@simply/ui";

const STATUS_CONFIG: Record<string, { color: string; icon: any; spin?: boolean }> = {
  started:   { color: "text-blue-400",  icon: Loader2, spin: true },
  processed: { color: "text-blue-400",  icon: Loader2, spin: true },
  pending:   { color: "text-amber-400", icon: Clock },
  completed: { color: "text-green-400", icon: CheckCircle2 },
  denied:    { color: "text-red-400",   icon: AlertCircle },
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

  const config = STATUS_CONFIG[tx.status] || STATUS_CONFIG.started;
  const Icon = config.icon;

  return (
    <div className="space-y-6">
      <StepIndicator current={4} total={5} />

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
          <span className="text-white/50">Monto enviado</span>
          <MoneyDisplay amount={parseFloat(tx.amount)} currency={tx.currency} size="sm" />
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-white/50">Destino</span>
          <span>{tx.country}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-white/50">Beneficiario</span>
          <span>
            {tx.beneficiary?.firstName} {tx.beneficiary?.lastName}
          </span>
        </div>
      </Card>

      {!["completed", "denied"].includes(tx.status) && (
        <Card className="bg-amber-500/5 border-amber-500/20">
          <p className="text-sm text-amber-200/90">
            ⏳ Estamos procesando tu envío. Vita Wallet acreditará en {tx.country} en{" "}
            {tx.country === "CL" ? "1 día hábil" : tx.country === "CO" ? "7 días hábiles" : "1-2 días hábiles"}.
          </p>
        </Card>
      )}

      {tx.status === "completed" && (
        <Card className="bg-green-500/5 border-green-500/20">
          <p className="text-sm text-green-200/90">✅ El dinero fue acreditado en la cuenta del beneficiario.</p>
        </Card>
      )}

      <a href="/">
        <Button variant="secondary">Hacer otro envío</Button>
      </a>
    </div>
  );
}
