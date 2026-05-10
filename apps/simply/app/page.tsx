"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  ArrowDownUp,
  Loader2,
  AlertTriangle,
  Info,
  ChevronDown,
} from "lucide-react";
import {
  Button,
  CardElevated,
  Input,
  MoneyDisplay,
  useSession,
} from "@simply/ui";
import {
  AssetMeta,
  FIAT_ASSETS,
  CRYPTO_ASSETS,
  assetId,
  toBackendAsset,
  isCombinationSupported,
} from "@/lib/assets";
import AssetSelector from "@/components/AssetSelector";
import Tooltip from "@/components/Tooltip";

const VERIFIED_STATUSES = ["VERIFIED_BASIC", "VERIFIED_FULL"];

const DEFAULT_SOURCE: AssetMeta = FIAT_ASSETS.find((a) => a.currency === "USD")!;
const DEFAULT_DEST: AssetMeta = CRYPTO_ASSETS.find(
  (a) => a.symbol === "USDT" && a.network === "TRC20",
)!;

export default function Home() {
  const router = useRouter();
  const { session, loaded } = useSession();

  const [amount, setAmount] = useState<string>("100");
  const [source, setSource] = useState<AssetMeta>(DEFAULT_SOURCE);
  const [destination, setDestination] = useState<AssetMeta>(DEFAULT_DEST);

  const [quote, setQuote] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const num = parseFloat(amount);
  const support = useMemo(() => isCombinationSupported(source, destination), [source, destination]);
  const valid = num >= 1 && support.ok;

  // Quote en vivo con debounce
  useEffect(() => {
    if (!valid) {
      setQuote(null);
      return;
    }
    const t = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/transfer-engine/quote", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            source: { asset: toBackendAsset(source), amount: num },
            destination: { asset: toBackendAsset(destination) },
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Error obteniendo cotización");
        setQuote(data);
      } catch (e: any) {
        setError(e.message);
        setQuote(null);
      } finally {
        setLoading(false);
      }
    }, 800);
    return () => clearTimeout(t);
  }, [amount, source, destination, valid]);

  function handleSwap() {
    setSource(destination);
    setDestination(source);
    setQuote(null);
  }

  function handleContinue() {
    if (!quote) return;
    if (typeof window !== "undefined") {
      sessionStorage.setItem(
        "simply_pending_quote",
        JSON.stringify({
          quote,
          source: { asset: toBackendAsset(source), amount: num, meta: source },
          destination: { asset: toBackendAsset(destination), meta: destination },
        }),
      );
    }
    if (!loaded) return;
    if (!session) {
      router.push("/registro");
      return;
    }
    const status = (session as any).profileStatus;
    if (status && VERIFIED_STATUSES.includes(status)) {
      router.push("/destinatario");
    } else {
      router.push("/registro");
    }
  }

  // Símbolos para mostrar
  const sourceCode = source.kind === "fiat" ? source.currency : source.symbol;
  const destCode = destination.kind === "fiat" ? destination.currency : destination.symbol;
  const involvesCrypto = source.kind === "crypto" || destination.kind === "crypto";

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Mové tu dinero</h1>
        <p className="text-sm text-white/60">
          Fiat, cripto o ambos. Como quieras moverlo.
        </p>
      </div>

      <CardElevated className="space-y-3">
        {/* ─── ENVÍAS ─── */}
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-wider text-zinc-500 font-medium">
            Envías
          </label>
          <div className="grid grid-cols-[1fr_minmax(0,1.4fr)] gap-2">
            <Input
              type="number"
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              className="text-2xl font-semibold !py-3"
            />
            <AssetSelector value={source} onChange={setSource} excludeId={assetId(destination)} />
          </div>
        </div>

        {/* ─── Botón Swap ─── */}
        <div className="flex justify-center -my-1 relative z-10">
          <button
            type="button"
            onClick={handleSwap}
            className="w-9 h-9 rounded-full bg-zinc-900 border border-zinc-700 hover:border-blue-500 hover:text-blue-400 text-zinc-400 flex items-center justify-center transition group"
            aria-label="Invertir origen y destino"
          >
            <ArrowDownUp className="w-4 h-4 transition group-hover:rotate-180 duration-300" />
          </button>
        </div>

        {/* ─── RECIBE ─── */}
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-wider text-zinc-500 font-medium">
            Recibe
          </label>
          <div className="grid grid-cols-[1fr_minmax(0,1.4fr)] gap-2">
            <div className="px-3 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-2xl font-semibold text-white tabular-nums truncate">
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin text-zinc-500" />
              ) : quote && support.ok ? (
                formatAmount(quote.beneficiaryReceives, destination)
              ) : (
                <span className="text-zinc-600">—</span>
              )}
            </div>
            <AssetSelector value={destination} onChange={setDestination} excludeId={assetId(source)} />
          </div>
        </div>

        {/* ─── Combinación no soportada ─── */}
        {!support.ok && (
          <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-3 flex gap-2 text-xs text-amber-200/90">
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{support.reason}</span>
          </div>
        )}

        {/* ─── Error ─── */}
        {error && support.ok && (
          <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-3 text-xs text-red-300">
            {error}
          </div>
        )}

        {/* ─── Detalles del quote (collapsable) ─── */}
        {quote && !loading && support.ok && (
          <div className="pt-1">
            <button
              onClick={() => setShowDetails((s) => !s)}
              className="w-full flex items-center justify-between text-xs text-zinc-400 hover:text-white transition py-1"
            >
              <span>Detalles de la operación</span>
              <ChevronDown className={`w-3.5 h-3.5 transition ${showDetails ? "rotate-180" : ""}`} />
            </button>

            {showDetails && (
              <div className="mt-2 rounded-xl bg-black/40 border border-white/5 p-3 space-y-1.5 text-xs animate-fade-in">
                <Row label={
                  <span className="inline-flex items-center gap-1">
                    Tipo de cambio
                    <Tooltip content="Es el rate al que se convierte tu moneda. Ya incluye el markup de Simply. Sin sorpresas escondidas." />
                  </span>
                }>
                  1 {sourceCode} = {quote.breakdown.finalRate?.toFixed(6)} {destCode}
                </Row>
                {quote.breakdown.providerFixedCost > 0 && (
                  <Row label={
                    <span className="inline-flex items-center gap-1">
                      Fee de red / envío
                      <Tooltip content="Costo cobrado por la red blockchain o el sistema bancario para procesar tu transferencia. No lo cobra Simply." />
                    </span>
                  }>
                    {quote.breakdown.providerFixedCost} {sourceCode}
                  </Row>
                )}
                {quote.breakdown.fixedFee > 0 && (
                  <Row label={
                    <span className="inline-flex items-center gap-1">
                      Cargo Simply
                      <Tooltip content="Comisión fija de Simply por procesar tu operación. Se descuenta del monto a enviar." />
                    </span>
                  }>
                    <MoneyDisplay amount={quote.breakdown.fixedFee} currency={sourceCode} size="sm" />
                  </Row>
                )}
                <Row label="Tiempo estimado">{quote.estimatedDeliveryTime}</Row>
                <Row label={
                  <span className="inline-flex items-center gap-1">
                    Cotización válida hasta
                    <Tooltip content="Después de esta hora, los rates pueden cambiar. Si demorás, vas a ver una nueva cotización." />
                  </span>
                }>
                  {new Date(quote.validUntil).toLocaleTimeString("es-AR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Row>
              </div>
            )}
          </div>
        )}

        {/* ─── Advertencias críticas si involucra cripto ─── */}
        {involvesCrypto && support.ok && (
          <div className="rounded-xl bg-yellow-500/10 border border-yellow-500/25 p-3 flex gap-2 text-xs text-yellow-200/90">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-medium">Verificá la red antes de continuar</p>
              <p className="text-yellow-200/70">
                Enviar cripto a la red equivocada significa pérdida total de fondos. La dirección de wallet la cargás en el siguiente paso.
              </p>
            </div>
          </div>
        )}
      </CardElevated>

      <Button
        onClick={handleContinue}
        disabled={!quote || loading || !support.ok}
        rightIcon={<ArrowRight className="w-5 h-5" />}
      >
        Continuar
      </Button>

      <p className="text-center text-xs text-white/40">
        Cotizá sin compromiso. Sin sorpresas.
      </p>
    </div>
  );
}

function Row({ label, children }: { label: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex justify-between items-center text-zinc-400 gap-3">
      <span className="text-zinc-500 flex-shrink-0">{label}</span>
      <span className="text-white text-right truncate">{children}</span>
    </div>
  );
}

function formatAmount(value: number, asset: AssetMeta): string {
  if (asset.kind === "crypto" && asset.symbol === "BTC") {
    return value.toFixed(8);
  }
  if (asset.kind === "crypto") {
    return value.toFixed(2);
  }
  // Fiat: 0-2 decimales según moneda
  const noDec = ["VES", "CLP", "COP"];
  if (noDec.includes(asset.currency)) {
    return Math.round(value).toLocaleString("es-AR");
  }
  return value.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
