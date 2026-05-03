"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { loadStripe, Stripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button, Card, MoneyDisplay, useSession } from "@simply/ui";

// Cargar Stripe una vez fuera del componente (mejor práctica de Stripe)
const stripePromise: Promise<Stripe | null> | null =
  typeof window !== "undefined" && process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
    : null;

interface PreparedIntent {
  clientSecret: string;
  order: string;
  paymentIntentId: string;
  transferId: string;
  amountCents: number;
}

export default function ConfirmarPage() {
  const router = useRouter();
  const { session, loaded } = useSession();
  const [pending, setPending] = useState<any>(null);
  const [endpoint, setEndpoint] = useState<any>(null);
  const [prepared, setPrepared] = useState<PreparedIntent | null>(null);
  const [preparing, setPreparing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 1) Cargar datos del sessionStorage
  useEffect(() => {
    if (!loaded) return;
    if (!session) {
      router.push("/");
      return;
    }
    if (typeof window !== "undefined") {
      const p = sessionStorage.getItem("simply_pending_quote");
      const e = sessionStorage.getItem("simply_destination_endpoint");
      if (!p || !e) {
        router.push("/");
        return;
      }
      setPending(JSON.parse(p));
      setEndpoint(JSON.parse(e));
    }
  }, [loaded, session, router]);

  // 2) Cuando ya tengo todo, llamar a create-intent
  useEffect(() => {
    if (!pending || !endpoint || !session) return;
    if (prepared || preparing) return;
    void prepareIntent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pending, endpoint, session]);

  async function prepareIntent() {
    if (!pending || !endpoint || !session) return;
    setPreparing(true);
    setError(null);
    try {
      const isBank = pending.destination.category.startsWith("bank");
      const destinationEndpoint = isBank
        ? {
            type: "bank_account",
            asset: pending.destination.asset,
            beneficiary: {
              firstName: endpoint.firstName,
              lastName: endpoint.lastName,
              documentType: endpoint.documentType,
              documentNumber: endpoint.documentNumber,
              email: endpoint.email,
              phone: endpoint.phone,
            },
            bank: {
              code: endpoint.bankCode,
              accountType: endpoint.accountType,
              accountNumber: endpoint.accountNumber,
              routingNumber: endpoint.routingNumber,
            },
            purpose: endpoint.purpose,
            purposeComment: endpoint.purposeComment,
          }
        : {
            type: "crypto_wallet_receive",
            asset: pending.destination.asset,
            address: endpoint.address,
          };

      const transferReq = {
        customerId: session.customerId,
        source: {
          asset: pending.source.asset,
          amount: pending.source.amount,
          endpoint: { type: "bank_transfer_in", asset: pending.source.asset },
        },
        destination: {
          asset: pending.destination.asset,
          endpoint: destinationEndpoint,
        },
        quote: pending.quote,
      };

      const res = await fetch("/api/payment-methods/stripe/create-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transfer: transferReq }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "No se pudo preparar el pago");
      setPrepared(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setPreparing(false);
    }
  }

  if (!loaded || !pending || !endpoint || !session)
    return <div className="text-center py-12 text-white/60">Cargando...</div>;

  if (!stripePromise)
    return (
      <div className="text-center py-12 text-red-400">
        Stripe no está configurado. Falta NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.
      </div>
    );

  const isBank = pending.destination.category.startsWith("bank");
  const sourceCode =
    pending.source.asset.kind === "fiat"
      ? pending.source.asset.currency
      : pending.source.asset.symbol;
  const destCode =
    pending.destination.asset.kind === "fiat"
      ? pending.destination.asset.currency
      : pending.destination.asset.symbol;

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-accent-500/15 mx-auto flex items-center justify-center">
          <CheckCircle2 className="w-6 h-6 text-accent-400" />
        </div>
        <h1 className="text-2xl font-semibold">Confirmá tu envío</h1>
        <p className="text-sm text-white/60">Revisá los datos antes de pagar</p>
      </div>

      <Card className="space-y-3">
        <div className="text-sm font-medium text-white/80 mb-2">Resumen</div>
        <div className="flex justify-between text-sm">
          <span className="text-white/50">Envías</span>
          <MoneyDisplay amount={pending.source.amount} currency={sourceCode} size="sm" />
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-white/50">Tipo de cambio</span>
          <span>{pending.quote.breakdown.finalRate?.toFixed(4)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-white/50">Provider</span>
          <span>{pending.quote.providerId}</span>
        </div>
        <div className="border-t border-white/10 pt-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-white/80">Total a pagar</span>
            <MoneyDisplay
              amount={pending.quote.totalCharged}
              currency={sourceCode}
              size="lg"
            />
          </div>
          <div className="flex justify-between items-center mt-1">
            <span className="text-sm text-white/80">Recibe en {pending.destination.label}</span>
            <MoneyDisplay
              amount={pending.quote.beneficiaryReceives}
              currency={destCode}
              size="lg"
              highlight
            />
          </div>
        </div>
      </Card>

      <Card className="space-y-2">
        <div className="text-sm font-medium text-white/80 mb-1">Destino</div>
        {isBank ? (
          <>
            <div className="text-sm">
              {endpoint.firstName} {endpoint.lastName}
            </div>
            <div className="text-xs text-white/50">
              {endpoint.documentType} {endpoint.documentNumber}
            </div>
            <div className="text-xs text-white/50">
              Banco {endpoint.bankCode} · Cta. {endpoint.accountNumber}
            </div>
          </>
        ) : (
          <div className="text-sm font-mono break-all">{endpoint.address}</div>
        )}
      </Card>

      {error && (
        <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl p-3">
          {error}
        </div>
      )}

      {preparing && (
        <div className="text-center py-4 text-white/60 text-sm">
          Preparando el pago…
        </div>
      )}

      {prepared && (
        <Elements
          stripe={stripePromise}
          options={{
            clientSecret: prepared.clientSecret,
            appearance: { theme: "night" },
          }}
        >
          <CheckoutForm order={prepared.order} />
        </Elements>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Form interno: DEBE renderizarse dentro de <Elements>
// ─────────────────────────────────────────────────────────────────

function CheckoutForm({ order }: { order: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handlePay() {
    if (!stripe || !elements) return;
    setSubmitting(true);
    setError(null);
    try {
      const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/exito/${order}`,
        },
        redirect: "if_required",
      });
      if (stripeError) {
        throw new Error(stripeError.message || "Error confirmando pago");
      }
      if (paymentIntent?.status === "succeeded") {
        router.push(`/exito/${order}`);
        return;
      }
      // requires_action u otro estado: Stripe ya redirigió o el flujo continúa
      setError(`Estado del pago: ${paymentIntent?.status || "desconocido"}`);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <PaymentElement />
      </Card>

      {error && (
        <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl p-3">
          {error}
        </div>
      )}

      <Button onClick={handlePay} loading={submitting} disabled={!stripe || !elements}>
        Pagar
      </Button>

      <p className="text-center text-xs text-white/40">
        Pago procesado de forma segura por Stripe
      </p>
    </div>
  );
}
