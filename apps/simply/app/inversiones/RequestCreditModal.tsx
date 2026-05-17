"use client";

import { useState, useMemo } from "react";
import { X, Loader2 } from "lucide-react";
import { Button } from "@simply/ui";
import { createLoan, type CreditLine } from "@/lib/investments-api";

function fmt(n: number, currency: string) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: currency === "ARS" ? "ARS" : "USD",
    minimumFractionDigits: 2,
  }).format(n);
}

export default function RequestCreditModal({
  customerId,
  currency,
  level,
  open,
  line,
  onClose,
  onSuccess,
}: {
  customerId: string;
  currency: string | null;
  level: string;
  open: boolean;
  line?: CreditLine;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [amount, setAmount] = useState("");
  const [installments, setInstallments] = useState(3);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const principal = parseFloat(amount) || 0;
  const annualRate = (line?.interestRateAnnual || 0) / 100;
  const monthlyRate = annualRate / 12;
  const totalToPay = principal * (1 + monthlyRate * installments);
  const installmentAmount = installments > 0 ? totalToPay / installments : 0;

  const installmentOptions = useMemo(() => {
    const max = line?.maxInstallments || 6;
    const opts: number[] = [];
    for (const n of [1, 3, 6, 12, 24, 36, 60]) {
      if (n <= max) opts.push(n);
    }
    return opts;
  }, [line]);

  if (!open || !currency || !line) return null;

  async function handleSubmit() {
    setError(null);
    if (principal <= 0) return setError("Monto inválido");
    if (principal > line!.available) return setError(`Excede línea disponible: ${fmt(line!.available, currency!)}`);
    setLoading(true);
    try {
      await createLoan({
        customerId,
        level,
        currency: currency!,
        principal,
        installments,
        origin: "other",
      });
      onSuccess();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60" onClick={onClose}>
      <div
        className="bg-zinc-900 ring-1 ring-white/10 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md p-5 space-y-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-white font-semibold">Solicitar crédito {currency}</h3>
          <button onClick={onClose} className="text-white/60 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-emerald-500/10 ring-1 ring-emerald-400/20 rounded-lg p-3 text-xs text-emerald-200">
          💎 Tu inversión sigue rindiendo. Tasa: {annualRate === 0 ? "0% (sin interés)" : `${(annualRate * 100).toFixed(2)}% anual`}.
        </div>

        <div>
          <label className="text-sm text-white/70 mb-1 block">Disponible: {fmt(line.available, currency)}</label>
          <input
            type="number"
            min="0"
            max={line.available}
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-white/5 ring-1 ring-white/10 rounded-lg px-3 py-2 text-white text-lg"
            placeholder="0.00"
            autoFocus
          />
        </div>

        <div>
          <label className="text-sm text-white/70 mb-2 block">Cuotas (máx {line.maxInstallments})</label>
          <div className="grid grid-cols-4 gap-1.5">
            {installmentOptions.map((n) => (
              <button
                key={n}
                onClick={() => setInstallments(n)}
                className={`py-2 rounded-lg text-sm ${
                  installments === n ? "bg-blue-500/20 ring-1 ring-blue-400/40 text-blue-200" : "bg-white/5 text-white/70"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {principal > 0 && (
          <div className="bg-white/5 rounded-lg p-3 space-y-1 text-sm">
            <div className="flex justify-between text-white/70">
              <span>Cuota mensual</span>
              <span className="text-white font-medium">{fmt(installmentAmount, currency)}</span>
            </div>
            <div className="flex justify-between text-white/70">
              <span>Total a devolver</span>
              <span className="text-white">{fmt(totalToPay, currency)}</span>
            </div>
          </div>
        )}

        {error && <div className="text-sm text-rose-400">{error}</div>}

        <Button onClick={handleSubmit} disabled={loading || principal <= 0} className="w-full">
          {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Confirmar solicitud"}
        </Button>
      </div>
    </div>
  );
}
