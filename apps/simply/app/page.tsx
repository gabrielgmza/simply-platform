"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ArrowDown, Loader2 } from "lucide-react";
import {
  Button,
  CardElevated,
  FormField,
  Input,
  Select,
  MoneyDisplay,
  useSession,
} from "@simply/ui";
import { DESTINATIONS, SOURCE_CURRENCIES } from "@/lib/destinations";

const VERIFIED_STATUSES = ["VERIFIED_BASIC", "VERIFIED_FULL"];

export default function Home() {
  const router = useRouter();
  const { session, loaded } = useSession();
  const [amount, setAmount] = useState<string>("100");
  const [sourceCurrency, setSourceCurrency] = useState("USD");
  const [destinationId, setDestinationId] = useState("bank_co");
  const [quote, setQuote] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const destination = DESTINATIONS.find((d) => d.id === destinationId)!;
  const num = parseFloat(amount);
  const valid = num >= 1 && destination.enabled;

  useEffect(() => {
    if (!valid) {
      setQuote(null);
      return;
    }
    const t = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const sourceAsset = sourceCurrencyToAsset(sourceCurrency);
        const res = await fetch("/api/transfer-engine/quote", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            source: { asset: sourceAsset, amount: num },
            destination: { asset: destination.asset },
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
    }, 500);
    return () => clearTimeout(t);
  }, [amount, sourceCurrency, destinationId, valid]);

  function handleContinue() {
    if (!quote) return;
    const sourceAsset = sourceCurrencyToAsset(sourceCurrency);
    if (typeof window !== "undefined") {
      sessionStorage.setItem(
        "simply_pending_quote",
        JSON.stringify({
          quote,
          source: { asset: sourceAsset, amount: num },
          destination: {
            asset: destination.asset,
            category: destination.category,
            label: destination.label,
          },
        }),
      );
    }
    // Routing inteligente:
    // - Sin sesión → registro (email + OTP)
    // - Sesión pero KYC incompleto → registro (continúa el wizard donde quedó)
    // - Sesión y KYC OK → destinatario directo
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

  const grouped = {
    bank_latam: DESTINATIONS.filter((d) => d.category === "bank_latam"),
    bank_us: DESTINATIONS.filter((d) => d.category === "bank_us"),
    crypto: DESTINATIONS.filter((d) => d.category === "crypto"),
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-semibold">Mové tu dinero</h1>
        <p className="text-sm text-white/60">
          Cripto, fiat, internacional. Una sola plataforma.
        </p>
      </div>

      <CardElevated className="space-y-4">
        <FormField label="Envías">
          <div className="flex gap-2">
            <Input
              type="number"
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="flex-1"
              placeholder="100"
            />
            <Select
              value={sourceCurrency}
              onChange={(e) => setSourceCurrency(e.target.value)}
              className="!w-32"
            >
              {SOURCE_CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code}
                </option>
              ))}
            </Select>
          </div>
        </FormField>

        <div className="flex justify-center">
          <ArrowDown className="w-5 h-5 text-white/30" />
        </div>

        <FormField label="Recibe en">
          <Select
            value={destinationId}
            onChange={(e) => setDestinationId(e.target.value)}
          >
            <optgroup label="🌎 Bancos LatAm">
              {grouped.bank_latam.map((d) => (
                <option key={d.id} value={d.id} disabled={!d.enabled}>
                  {d.flag} {d.label}
                </option>
              ))}
            </optgroup>
            <optgroup label="🇺🇸 Estados Unidos">
              {grouped.bank_us.map((d) => (
                <option key={d.id} value={d.id} disabled={!d.enabled}>
                  {d.flag} {d.label}
                </option>
              ))}
            </optgroup>
            <optgroup label="₿ Wallets cripto">
              {grouped.crypto.map((d) => (
                <option key={d.id} value={d.id} disabled={!d.enabled}>
                  {d.label} {!d.enabled ? "(próximamente)" : ""}
                </option>
              ))}
            </optgroup>
          </Select>
        </FormField>

        {!destination.enabled && (
          <div className="text-sm text-amber-300/90 bg-amber-500/10 border border-amber-500/20 rounded-xl p-3">
            🚧 Esta opción estará disponible pronto.
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center py-4 text-sm text-white/60 gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            Calculando...
          </div>
        )}

        {error && destination.enabled && (
          <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl p-3">
            {error}
          </div>
        )}

        {quote && !loading && (
          <div className="space-y-3 pt-2">
            <div className="flex justify-between text-sm text-white/60">
              <span>Tipo de cambio</span>
              <span>
                1 {sourceCurrency} = {quote.breakdown.finalRate?.toFixed(4)}{" "}
                {destination.asset.kind === "fiat" ? destination.asset.currency : ""}
              </span>
            </div>
            {quote.breakdown.fixedFee > 0 && (
              <div className="flex justify-between text-sm text-white/60">
                <span>Cargo de envío</span>
                <MoneyDisplay
                  amount={quote.breakdown.fixedFee}
                  currency={sourceCurrency}
                  size="sm"
                />
              </div>
            )}
            <div className="flex justify-between text-sm text-white/60">
              <span>Tiempo estimado</span>
              <span>{quote.estimatedDeliveryTime}</span>
            </div>
            <div className="border-t border-white/10 pt-3 flex justify-between items-center">
              <span className="text-sm text-white/80">Recibe</span>
              <MoneyDisplay
                amount={quote.beneficiaryReceives}
                currency={
                  destination.asset.kind === "fiat"
                    ? destination.asset.currency
                    : destination.asset.symbol
                }
                size="xl"
                highlight
              />
            </div>
          </div>
        )}
      </CardElevated>

      <Button
        onClick={handleContinue}
        disabled={!quote || loading || !destination.enabled}
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

function sourceCurrencyToAsset(code: string) {
  const meta = SOURCE_CURRENCIES.find((c) => c.code === code);
  if (meta?.crypto) {
    return { kind: "crypto", symbol: code, network: meta.network };
  }
  const country = code === "USD" ? "US" : code === "CLP" ? "CL" : code === "COP" ? "CO" : "US";
  return { kind: "fiat", currency: code, country };
}
