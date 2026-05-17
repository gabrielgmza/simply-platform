"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { Button } from "@simply/ui";
import { withdrawInvestment, type InvestmentAccount } from "@/lib/investments-api";

export default function WithdrawModal({
  customerId,
  currency,
  open,
  accounts,
  onClose,
  onSuccess,
}: {
  customerId: string;
  currency: string | null;
  open: boolean;
  accounts: InvestmentAccount[];
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open || !currency) return null;
  const acc = accounts.find((a) => a.currency === currency);
  const max = acc ? parseFloat(acc.principal) : 0;

  async function handleSubmit() {
    setError(null);
    const n = parseFloat(amount);
    if (isNaN(n) || n <= 0) {
      setError("Monto inválido");
      return;
    }
    setLoading(true);
    try {
      await withdrawInvestment(customerId, currency!, n);
      setAmount("");
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
        className="bg-zinc-900 ring-1 ring-white/10 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md p-5 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-white font-semibold">Retirar de inversión {currency}</h3>
          <button onClick={onClose} className="text-white/60 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-amber-500/10 ring-1 ring-amber-400/20 rounded-lg p-3 text-xs text-amber-200">
          ⚠️ Si tenés cuotas activas, podría aplicarse fee de rescate del 4%.
        </div>

        <div>
          <label className="text-sm text-white/70 mb-1 block">Monto (máx {max.toFixed(2)})</label>
          <input
            type="number"
            min="0"
            max={max}
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-white/5 ring-1 ring-white/10 rounded-lg px-3 py-2 text-white text-lg"
            placeholder="0.00"
            autoFocus
          />
          <button
            onClick={() => setAmount(max.toFixed(2))}
            className="text-xs text-blue-400 mt-1"
          >
            Retirar todo
          </button>
        </div>

        {error && <div className="text-sm text-rose-400">{error}</div>}

        <Button onClick={handleSubmit} disabled={loading} className="w-full">
          {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Confirmar retiro"}
        </Button>
      </div>
    </div>
  );
}
