"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  Wallet,
  Copy,
  Check,
  AlertTriangle,
  Loader2,
  Clock,
  ArrowRight,
} from "lucide-react";
import { loadStripe, Stripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button, Card, MoneyDisplay, useSession } from "@simply/ui";
import { useKycGate } from "@/lib/hooks/useKycGate";

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

  // Stripe (solo para fiat→fiat y fiat→crypto)
  const [prepared, setPrepared] = useState<PreparedIntent | null>(null);
  const [preparing, setPreparing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Crypto deposit flow (cripto→fiat)
  const [waitingDeposit, setWaitingDeposit] = useState(false);

  useKycGate();

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

  // ─── Detectar cuadrante ───
  const sourceKind = pending?.source?.asset?.kind;
  const destKind = pending?.destination?.asset?.kind;
  const isFiatToFiat   = sourceKind === "fiat"   && destKind === "fiat";
  const isFiatToCrypto = sourceKind === "fiat"   && destKind === "crypto";
  const isCryptoToFiat = sourceKind === "crypto" && destKind === "fiat";

  // ─── Prepare Stripe Intent (solo cuando origen es fiat) ───
  useEffect(() => {
    if (!pending || !endpoint || !session) return;
    if (sourceKind !== "fiat") return; // cripto→fiat no usa Stripe
    if (prepared || preparing) return;
    void prepareIntent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pending, endpoint, session, sourceKind]);

  async function prepareIntent() {
    if (!pending || !endpoint || !session) return;
    setPreparing(true);
    setError(null);
    try {
      const isCryptoDest = pending.destination.asset.kind === "crypto";
      const destinationEndpoint = isCryptoDest
        ? {
            type: "crypto_wallet_receive",
            asset: pending.destination.asset,
            address: endpoint.address,
            label: endpoint.label,
          }
        : {
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

  // ─── Cripto→Fiat: cliente confirma "ya envié" ───
  function handleCryptoDepositConfirm() {
    setWaitingDeposit(true);
    // Mock: en producción consultaríamos al backend si Vita detectó la entrada.
    // Por ahora, simulamos que pasa a éxito en 4 segundos.
    setTimeout(() => {
      const fakeOrder = `mock-${Date.now()}`;
      router.push(`/exito/${fakeOrder}`);
    }, 4000);
  }

  if (!loaded || !pending || !endpoint || !session) {
    return <div className="text-center py-12 text-white/60">Cargando...</div>;
  }

  if (sourceKind === "fiat" && !stripePromise) {
    return (
      <div className="text-center py-12 text-red-400">
        El sistema de pagos no está configurado correctamente.
      </div>
    );
  }

  const sourceAsset = pending.source.asset;
  const destAsset = pending.destination.asset;
  const sourceMeta = pending.source.meta;
  const destMeta = pending.destination.meta;

  const sourceCode = sourceAsset.kind === "fiat" ? sourceAsset.currency : sourceAsset.symbol;
  const destCode = destAsset.kind === "fiat" ? destAsset.currency : destAsset.symbol;

  return (
    <div className="space-y-6 animate-page-in">
      <div className="text-center space-y-2">
        <div className="wizard-icon-bubble">
          {isCryptoToFiat ? (
            <Wallet className="w-6 h-6 text-blue-300" />
          ) : (
            <CheckCircle2 className="w-6 h-6 text-blue-300" />
          )}
        </div>
        <h1 className="wizard-title">
          {isCryptoToFiat ? "Enviá tu cripto" : "Confirmá tu envío"}
        </h1>
        <p className="wizard-subtitle">
          {isCryptoToFiat
            ? `Cuando recibamos tu ${sourceCode}, vas a recibir ${destCode}`
            : "Revisá los datos antes de pagar"}
        </p>
      </div>

      {/* ─── Resumen (compartido) ─── */}
      <Card className="space-y-2.5">
        <div className="text-xs uppercase tracking-wider text-zinc-500 font-medium">Resumen</div>

        <div className="flex justify-between text-sm">
          <span className="text-white/55">Envías</span>
          <MoneyDisplay amount={pending.source.amount} currency={sourceCode} size="sm" />
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-white/55">Tipo de cambio</span>
          <span className="font-mono text-xs">
            1 {sourceCode} = {pending.quote.breakdown.finalRate?.toFixed(6)} {destCode}
          </span>
        </div>
        {pending.quote.breakdown.providerFixedCost > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-white/55">Fee de red / envío</span>
            <span>{pending.quote.breakdown.providerFixedCost} {sourceCode}</span>
          </div>
        )}
        <div className="border-t border-white/10 pt-3 mt-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-white/80">Total a pagar</span>
            <MoneyDisplay amount={pending.quote.totalCharged} currency={sourceCode} size="lg" />
          </div>
          <div className="flex justify-between items-center mt-1">
            <span className="text-sm text-white/80">
              Recibís {destAsset.kind === "crypto" ? "en wallet" : "en cuenta"}
            </span>
            <MoneyDisplay amount={pending.quote.beneficiaryReceives} currency={destCode} size="lg" highlight />
          </div>
        </div>
      </Card>

      {/* ─── Destino (compartido) ─── */}
      <Card className="space-y-2">
        <div className="text-xs uppercase tracking-wider text-zinc-500 font-medium">
          {endpoint.kind === "crypto_wallet" ? "Tu wallet de destino" : "Cuenta de destino"}
        </div>
        {endpoint.kind === "crypto_wallet" ? (
          <>
            <div className="text-xs font-mono break-all text-white/85">{endpoint.address}</div>
            <div className="text-xs text-zinc-500">
              {destAsset.symbol} · {destMeta?.networkLabel || destAsset.network}
              {endpoint.label && <> · {endpoint.label}</>}
            </div>
          </>
        ) : (
          <>
            <div className="text-sm text-white">
              {endpoint.firstName} {endpoint.lastName}
            </div>
            <div className="text-xs text-white/50">
              {endpoint.documentType} {endpoint.documentNumber}
            </div>
            <div className="text-xs text-white/50">
              Banco {endpoint.bankCode} · Cta. {endpoint.accountNumber}
            </div>
          </>
        )}
      </Card>

      {error && (
        <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl p-3">
          {error}
        </div>
      )}

      {/* ─── FLOW 1 y 2: pago Stripe (origen fiat) ─── */}
      {sourceKind === "fiat" && (
        <>
          {preparing && (
            <div className="text-center py-4 text-white/60 text-sm flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" /> Preparando el pago…
            </div>
          )}
          {prepared && (
            <Elements
              stripe={stripePromise!}
              options={{
                clientSecret: prepared.clientSecret,
                appearance: { theme: "night" },
              }}
            >
              <StripeCheckoutForm order={prepared.order} />
            </Elements>
          )}
        </>
      )}

      {/* ─── FLOW 3: cripto→fiat (instrucciones de depósito) ─── */}
      {isCryptoToFiat && (
        <CryptoDepositInstructions
          sourceAsset={sourceAsset}
          sourceMeta={sourceMeta}
          amount={pending.source.amount}
          waiting={waitingDeposit}
          onConfirm={handleCryptoDepositConfirm}
        />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Stripe checkout form (igual que antes, sin cambios funcionales)
// ─────────────────────────────────────────────────────────────

function StripeCheckoutForm({ order }: { order: string }) {
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
        confirmParams: { return_url: `${window.location.origin}/exito/${order}` },
        redirect: "if_required",
      });
      if (stripeError) throw new Error(stripeError.message || "Error confirmando pago");
      if (paymentIntent?.status === "succeeded") {
        router.push(`/exito/${order}`);
        return;
      }
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
      <p className="text-center text-xs text-white/40">Pago procesado de forma segura</p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Crypto deposit instructions (cuando origen es cripto)
// ─────────────────────────────────────────────────────────────

function CryptoDepositInstructions({
  sourceAsset,
  sourceMeta,
  amount,
  waiting,
  onConfirm,
}: {
  sourceAsset: any;
  sourceMeta: any;
  amount: number;
  waiting: boolean;
  onConfirm: () => void;
}) {
  const [copied, setCopied] = useState<"address" | "amount" | null>(null);
  const depositAddress = mockDepositAddress(sourceAsset);
  const amountStr = amount.toString();

  function copy(value: string, key: "address" | "amount") {
    navigator.clipboard.writeText(value);
    setCopied(key);
    setTimeout(() => setCopied(null), 1800);
  }

  if (waiting) {
    return (
      <Card className="text-center py-8 space-y-3">
        <Loader2 className="w-10 h-10 animate-spin text-blue-400 mx-auto" />
        <p className="text-sm font-medium text-white">Esperando confirmación de tu depósito…</p>
        <p className="text-xs text-white/50">Esto puede tardar unos minutos.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="space-y-3">
        <div className="text-xs uppercase tracking-wider text-zinc-500 font-medium">
          Address de depósito Simply
        </div>

        <div className="rounded-xl bg-black/40 border border-white/10 p-3 space-y-2">
          <div className="text-[10px] uppercase tracking-wider text-zinc-500">
            Red {sourceAsset.network}
          </div>
          <div className="flex items-center gap-2">
            <code className="flex-1 text-xs font-mono text-white break-all">{depositAddress}</code>
            <button
              type="button"
              onClick={() => copy(depositAddress, "address")}
              className="shrink-0 px-2.5 py-2 rounded-lg border border-zinc-700 hover:border-zinc-500 text-zinc-300 transition flex items-center gap-1.5 text-xs"
            >
              {copied === "address" ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied === "address" ? "Copiada" : "Copiar"}
            </button>
          </div>
        </div>

        <div className="rounded-xl bg-black/40 border border-white/10 p-3 space-y-1">
          <div className="text-[10px] uppercase tracking-wider text-zinc-500">Monto exacto a enviar</div>
          <div className="flex items-center gap-2">
            <span className="flex-1 text-base font-mono font-semibold text-white">
              {amountStr} {sourceAsset.symbol}
            </span>
            <button
              type="button"
              onClick={() => copy(amountStr, "amount")}
              className="shrink-0 px-2.5 py-2 rounded-lg border border-zinc-700 hover:border-zinc-500 text-zinc-300 transition flex items-center gap-1.5 text-xs"
            >
              {copied === "amount" ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied === "amount" ? "Copiado" : "Copiar"}
            </button>
          </div>
        </div>
      </Card>

      <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-3 flex gap-2 text-xs text-amber-200/90">
        <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-medium">Reglas importantes</p>
          <ul className="list-disc pl-4 text-amber-200/70 space-y-0.5">
            <li>Enviá EXACTAMENTE en la red <strong>{sourceAsset.network}</strong></li>
            <li>El monto debe ser idéntico, incluso los decimales</li>
            <li>Otra red o monto distinto = pérdida o demora</li>
          </ul>
        </div>
      </div>

      <div className="rounded-xl bg-blue-500/10 border border-blue-500/20 p-3 flex gap-2 text-xs text-blue-200/90">
        <Clock className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <span>
          Una vez que envíes, demora entre 5 y 30 minutos según la red. Te avisamos cuando lleguen los fondos.
        </span>
      </div>

      <Button onClick={onConfirm} rightIcon={<ArrowRight className="w-5 h-5" />}>
        Ya envié los fondos
      </Button>

      <p className="text-[11px] text-zinc-500 text-center italic">
        🔧 Modo prueba: Vita aún no expone la API real para esta operación. La address de depósito es mock.
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Mock helpers
// ─────────────────────────────────────────────────────────────

function mockDepositAddress(sourceAsset: any): string {
  if (!sourceAsset) return "";
  const MOCK: Record<string, string> = {
    TRC20:   "TXYZSimplyDepositMockAddressTron000000",
    ERC20:   "0x000000Simply00Deposit00ERC20Address0000",
    BEP20:   "0x000000Simply00Deposit00BEP20Address0000",
    POLYGON: "0x000000Simply00Deposit00Polygon000000000",
    BTC:     "bc1qsimplymockdepositaddressbtc000000",
  };
  return MOCK[sourceAsset.network] || "address-no-disponible";
}
