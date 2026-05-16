"use client";

import { useEffect, useState } from "react";
import { X, Calendar, Loader2, AlertCircle, Check } from "lucide-react";
import { useToast } from "@/components/toast/Toast";
import { createScheduled, listBillers, type Biller } from "@/lib/services-api";

type Frequency = "monthly" | "weekly" | "one_time_on_due";
type AmountStrategy = "fixed" | "invoice_amount" | "up_to_max";

interface Props {
  customerId: string;
  // Si vienen, se pre-llenan (caso: ya pagaste y querés programar)
  prefillBillerId?: string;
  prefillReference?: string;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function SchedulePaymentModal({
  customerId, prefillBillerId, prefillReference, open, onClose, onSuccess,
}: Props) {
  const [billers, setBillers] = useState<Biller[]>([]);
  const [billerId, setBillerId] = useState<string>(prefillBillerId || "");
  const [reference, setReference] = useState<string>(prefillReference || "");
  const [nickname, setNickname] = useState("");
  const [frequency, setFrequency] = useState<Frequency>("monthly");
  const [amountStrategy, setAmountStrategy] = useState<AmountStrategy>("invoice_amount");
  const [fixedAmount, setFixedAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [nextExecutionAt, setNextExecutionAt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  useEffect(() => {
    if (!open) return;
    setError(null);
    if (!billerId) {
      listBillers("AR").then(setBillers).catch(() => setBillers([]));
    }
  }, [open, billerId]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const selectedBiller = billers.find((b) => b.id === billerId) || (prefillBillerId ? null : null);

  async function handleCreate() {
    setError(null);
    if (!billerId) { setError("Seleccioná un proveedor"); return; }
    if (!reference.trim()) { setError("Ingresá el código de referencia"); return; }
    if (amountStrategy === "fixed") {
      const v = parseFloat(fixedAmount);
      if (!v || v <= 0) { setError("Monto fijo inválido"); return; }
    }
    if (amountStrategy === "up_to_max") {
      const v = parseFloat(maxAmount);
      if (!v || v <= 0) { setError("Tope máximo inválido"); return; }
    }

    setLoading(true);
    try {
      await createScheduled(customerId, {
        billerId,
        reference: reference.trim(),
        nickname: nickname.trim() || undefined,
        frequency,
        amountStrategy,
        fixedAmount: amountStrategy === "fixed" ? parseFloat(fixedAmount) : undefined,
        maxAmount: amountStrategy === "up_to_max" ? parseFloat(maxAmount) : undefined,
        nextExecutionAt: nextExecutionAt || undefined,
      });
      toast.success("Pago programado");
      onSuccess?.();
      onClose();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[70] bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-md bg-zinc-900 sm:rounded-2xl rounded-t-2xl border border-white/10 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-white/5 shrink-0">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-300" />
            <h3 className="text-base font-semibold text-white">Programar pago</h3>
          </div>
          <button onClick={onClose} className="text-white/50 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {/* Selector de biller (si no viene prefilled) */}
          {!prefillBillerId && (
            <div>
              <label className="text-[10px] uppercase tracking-wide text-white/40">Proveedor</label>
              <select
                value={billerId}
                onChange={(e) => setBillerId(e.target.value)}
                className="w-full mt-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
              >
                <option value="" className="bg-zinc-900">Seleccionar...</option>
                {billers.map((b) => (
                  <option key={b.id} value={b.id} className="bg-zinc-900">{b.name}</option>
                ))}
              </select>
            </div>
          )}

          {/* Referencia */}
          <div>
            <label className="text-[10px] uppercase tracking-wide text-white/40">
              {selectedBiller?.referenceLabel || "Código de referencia"}
            </label>
            <input
              type="text"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="Ej: 0000123456"
              className="w-full mt-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
              readOnly={!!prefillReference}
            />
          </div>

          {/* Apodo opcional */}
          <div>
            <label className="text-[10px] uppercase tracking-wide text-white/40">Apodo (opcional)</label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder='Ej: "Luz de casa"'
              maxLength={50}
              className="w-full mt-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
            />
          </div>

          {/* Frecuencia */}
          <div>
            <label className="text-[10px] uppercase tracking-wide text-white/40">Frecuencia</label>
            <div className="grid grid-cols-3 gap-1 mt-1">
              <FreqBtn active={frequency === "monthly"} onClick={() => setFrequency("monthly")}>Mensual</FreqBtn>
              <FreqBtn active={frequency === "weekly"} onClick={() => setFrequency("weekly")}>Semanal</FreqBtn>
              <FreqBtn active={frequency === "one_time_on_due"} onClick={() => setFrequency("one_time_on_due")}>Vencimiento</FreqBtn>
            </div>
          </div>

          {/* Estrategia de monto */}
          <div>
            <label className="text-[10px] uppercase tracking-wide text-white/40">Monto</label>
            <div className="space-y-1 mt-1">
              <RadioOption
                label="Monto de la factura"
                description="Pagamos el total que indique cada factura"
                checked={amountStrategy === "invoice_amount"}
                onClick={() => setAmountStrategy("invoice_amount")}
              />
              <RadioOption
                label="Monto fijo"
                description="Pagamos siempre el mismo monto"
                checked={amountStrategy === "fixed"}
                onClick={() => setAmountStrategy("fixed")}
              />
              {amountStrategy === "fixed" && (
                <div className="pl-7">
                  <input
                    type="text"
                    inputMode="decimal"
                    value={fixedAmount}
                    onChange={(e) => setFixedAmount(e.target.value.replace(/[^\d.]/g, ""))}
                    placeholder="$ 0.00"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
                  />
                </div>
              )}
              <RadioOption
                label="Hasta un máximo"
                description="Pagamos lo que indique la factura, pero solo si está bajo el tope"
                checked={amountStrategy === "up_to_max"}
                onClick={() => setAmountStrategy("up_to_max")}
              />
              {amountStrategy === "up_to_max" && (
                <div className="pl-7">
                  <input
                    type="text"
                    inputMode="decimal"
                    value={maxAmount}
                    onChange={(e) => setMaxAmount(e.target.value.replace(/[^\d.]/g, ""))}
                    placeholder="$ 0.00 tope"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Fecha primera ejecución */}
          <div>
            <label className="text-[10px] uppercase tracking-wide text-white/40">
              Fecha del primer pago (opcional)
            </label>
            <input
              type="date"
              value={nextExecutionAt}
              onChange={(e) => setNextExecutionAt(e.target.value)}
              className="w-full mt-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
            />
            <p className="text-[10px] text-white/40 mt-0.5">Si no la indicás, se ejecuta al detectar próxima factura.</p>
          </div>

          {error && (
            <div className="flex items-start gap-2 text-xs text-red-400 bg-red-500/10 ring-1 ring-red-500/30 rounded-lg p-2.5">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-white/5 shrink-0">
          <button
            onClick={handleCreate}
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-white/10 text-white rounded-lg py-2.5 text-sm font-medium flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
              <>
                <Check className="w-4 h-4" />
                Crear pago programado
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function FreqBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`text-xs py-2 rounded-lg transition-colors ${
        active ? "bg-emerald-500/20 text-emerald-200 ring-1 ring-emerald-500/30" : "bg-white/5 text-white/50 hover:bg-white/10"
      }`}
    >
      {children}
    </button>
  );
}

function RadioOption({ label, description, checked, onClick }: { label: string; description: string; checked: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-start gap-2 p-2 rounded-lg text-left transition-colors ${
        checked ? "bg-emerald-500/10 ring-1 ring-emerald-500/30" : "bg-white/5 hover:bg-white/10"
      }`}
    >
      <div className={`w-4 h-4 rounded-full border-2 mt-0.5 shrink-0 flex items-center justify-center ${checked ? "border-emerald-400" : "border-white/30"}`}>
        {checked && <div className="w-2 h-2 rounded-full bg-emerald-400" />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm text-white">{label}</div>
        <div className="text-[10px] text-white/50 mt-0.5">{description}</div>
      </div>
    </button>
  );
}
