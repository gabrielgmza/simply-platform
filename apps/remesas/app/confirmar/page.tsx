"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { useSession } from "@simply/ui";
import { COUNTRIES } from "@simply/ui";
import { Button, Card, StepIndicator, MoneyDisplay } from "@simply/ui";

export default function ConfirmarPage() {
  const router = useRouter();
  const { session, loaded } = useSession();
  const [quote, setQuote] = useState<any>(null);
  const [beneficiary, setBeneficiary] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loaded) return;
    if (!session) {
      router.push("/");
      return;
    }
    if (typeof window !== "undefined") {
      const q = sessionStorage.getItem("simply_pending_quote");
      const b = sessionStorage.getItem("simply_beneficiary");
      if (!q || !b) {
        router.push("/");
        return;
      }
      setQuote(JSON.parse(q));
      setBeneficiary(JSON.parse(b));
    }
  }, [loaded, session, router]);

  async function handleConfirm() {
    if (!quote || !beneficiary || !session) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: session.customerId,
          sourceCurrency: quote.sourceCurrency,
          destinationCountry: quote.destinationCountry,
          amount: quote.amount,
          beneficiary,
          purpose: beneficiary.purpose || "EPTOUR",
          purposeComentary: beneficiary.purposeComentary,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error procesando transferencia");
      router.push(`/exito/${data.order}`);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (!loaded || !quote || !beneficiary || !session)
    return <div className="text-center py-12 text-white/60">Cargando...</div>;

  const country = COUNTRIES.find((c) => c.code === quote.destinationCountry)!;

  return (
    <div className="space-y-6">
      <StepIndicator current={3} total={5} />

      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-accent-500/15 mx-auto flex items-center justify-center">
          <CheckCircle2 className="w-6 h-6 text-accent-400" />
        </div>
        <h1 className="text-2xl font-semibold">Confirmá tu envío</h1>
        <p className="text-sm text-white/60">Revisá los datos antes de continuar</p>
      </div>

      <Card className="space-y-3">
        <div className="text-sm font-medium text-white/80 mb-2">Resumen</div>
        <div className="flex justify-between text-sm">
          <span className="text-white/50">Enviás</span>
          <MoneyDisplay amount={quote.amount} currency={quote.sourceCurrency} size="sm" />
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-white/50">Cargo Simply</span>
          <MoneyDisplay amount={quote.fixedFee || 0} currency={quote.sourceCurrency} size="sm" />
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-white/50">Tipo de cambio</span>
          <span>{quote.finalRate?.toFixed(4)}</span>
        </div>
        <div className="border-t border-white/10 pt-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-white/80">Total a pagar</span>
            <MoneyDisplay amount={quote.totalCharged || quote.amount} currency={quote.sourceCurrency} size="lg" />
          </div>
          <div className="flex justify-between items-center mt-1">
            <span className="text-sm text-white/80">Recibe en {country.name}</span>
            <MoneyDisplay amount={quote.beneficiaryReceives || 0} currency={country.currency} size="lg" highlight />
          </div>
        </div>
      </Card>

      <Card className="space-y-2">
        <div className="text-sm font-medium text-white/80 mb-1">Beneficiario</div>
        <div className="text-sm">
          {beneficiary.firstName} {beneficiary.lastName}
        </div>
        <div className="text-xs text-white/50">
          {beneficiary.documentType} {beneficiary.documentNumber}
        </div>
        <div className="text-xs text-white/50">
          Banco {beneficiary.bankCode} · Cta. {beneficiary.accountBank}
        </div>
      </Card>

      {error && (
        <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl p-3">{error}</div>
      )}

      <Button onClick={handleConfirm} loading={submitting}>
        Confirmar y pagar
      </Button>

      <p className="text-center text-xs text-white/40">
        En el próximo paso te diremos cómo depositar el dinero a Simply
      </p>
    </div>
  );
}
