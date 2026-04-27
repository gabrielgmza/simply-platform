"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { COUNTRIES, SOURCE_CURRENCIES } from "@simply/ui";
import { useQuote } from "@simply/ui";
import { Button, CardElevated, StepIndicator, MoneyDisplay, FormField, Input, Select, CountrySelect } from "@simply/ui";

export default function Home() {
  const router = useRouter();
  const [amount, setAmount] = useState<string>("100");
  const [currency, setCurrency] = useState("USD");
  const [country, setCountry] = useState("CO");

  const num = parseFloat(amount);
  const params = num && num >= 1
    ? { sourceCurrency: currency, destinationCountry: country, amount: num }
    : null;

  const { quote, loading, error } = useQuote(params);

  function handleContinue() {
    if (!quote) return;
    if (typeof window !== "undefined") {
      sessionStorage.setItem(
        "simply_pending_quote",
        JSON.stringify({ ...quote, sourceCurrency: currency, destinationCountry: country, amount: num })
      );
    }
    router.push("/login");
  }

  const countryInfo = COUNTRIES.find((c) => c.code === country)!;

  return (
    <div className="space-y-6">
      <StepIndicator current={0} total={5} />

      <div className="text-center space-y-2">
        <h1 className="text-2xl font-semibold">Enviá dinero a LatAm</h1>
        <p className="text-sm text-white/60">Cotizá sin compromiso. Sin sorpresas.</p>
      </div>

      <CardElevated className="space-y-4">
        <FormField label="Enviás">
          <div className="flex gap-2">
            <Input
              type="number"
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="flex-1"
              placeholder="100"
            />
            <Select value={currency} onChange={(e) => setCurrency(e.target.value)} className="!w-32">
              {SOURCE_CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code}
                </option>
              ))}
            </Select>
          </div>
        </FormField>

        <FormField label="A">
          <CountrySelect countries={COUNTRIES} value={country} onChange={setCountry} />
        </FormField>

        {loading && (
          <div className="flex items-center justify-center py-4 text-sm text-white/60 gap-2">
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Calculando...
          </div>
        )}

        {error && (
          <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl p-3">{error}</div>
        )}

        {quote && !loading && (
          <div className="space-y-3 pt-2">
            <div className="flex justify-between text-sm text-white/60">
              <span>Tipo de cambio</span>
              <span>1 {currency} = {quote.finalRate?.toFixed(4)} {countryInfo.currency}</span>
            </div>
            <div className="flex justify-between text-sm text-white/60">
              <span>Cargo de envío</span>
              <MoneyDisplay amount={quote.fixedFee || 0} currency={currency} size="sm" />
            </div>
            <div className="border-t border-white/10 pt-3 flex justify-between items-center">
              <span className="text-sm text-white/80">El beneficiario recibe</span>
              <MoneyDisplay
                amount={quote.beneficiaryReceives || 0}
                currency={countryInfo.currency}
                size="xl"
                highlight
              />
            </div>
          </div>
        )}
      </CardElevated>

      <Button onClick={handleContinue} disabled={!quote || loading} rightIcon={<ArrowRight className="w-5 h-5" />}>
        Continuar
      </Button>

      <p className="text-center text-xs text-white/40">
        Necesitarás los datos del beneficiario (nombre, banco, cuenta)
      </p>
    </div>
  );
}
