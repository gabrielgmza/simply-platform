"use client";

import { useEffect, useState } from "react";
import { Zap, Wifi, Droplet, Phone, FileText, Loader2, ChevronRight, ArrowLeft, Check } from "lucide-react";
import { useToast } from "@/components/toast/Toast";
import {
  listBillers, lookupBill, executePayment,
  type Biller, type Bill,
} from "@/lib/services-api";

const CATEGORY_ICONS: Record<string, any> = {
  utility: Zap,
  tv_internet: Wifi,
  telco: Phone,
  tax: FileText,
};

const CATEGORY_LABELS: Record<string, string> = {
  utility: "Servicios",
  tv_internet: "TV e internet",
  telco: "Recargas",
  tax: "Impuestos",
};

export default function PagarTab({ customerId }: { customerId: string }) {
  const [country, setCountry] = useState("AR");
  const [billers, setBillers] = useState<Biller[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Biller | null>(null);
  const [reference, setReference] = useState("");
  const [bill, setBill] = useState<Bill | null>(null);
  const [step, setStep] = useState<"list" | "reference" | "confirm">("list");
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  useEffect(() => {
    setLoading(true);
    listBillers(country)
      .then(setBillers)
      .finally(() => setLoading(false));
  }, [country]);

  function chooseBiller(b: Biller) {
    setSelected(b);
    setReference("");
    setBill(null);
    setStep("reference");
  }

  function backToList() {
    setSelected(null);
    setBill(null);
    setStep("list");
  }

  async function doLookup() {
    if (!selected || !reference.trim()) {
      toast.error("Ingresá el código");
      return;
    }
    setSubmitting(true);
    try {
      const b = await lookupBill(selected.id, reference.trim(), customerId);
      setBill(b);
      setStep("confirm");
    } catch (e: any) {
      toast.error(e.message || "No se pudo consultar");
    } finally {
      setSubmitting(false);
    }
  }

  async function doPay() {
    if (!selected || !bill || !bill.amount) return;
    setSubmitting(true);
    try {
      const result = await executePayment({
        customerId,
        billerId: selected.id,
        reference: bill.reference,
        amount: bill.amount,
        billId: bill.id,
      });
      if (result.status === "completed") {
        toast.success("Pago realizado");
        setSelected(null);
        setBill(null);
        setReference("");
        setStep("list");
      } else {
        toast.error("El pago no se pudo procesar. Probá de nuevo.");
      }
    } catch (e: any) {
      toast.error(e.message || "Error procesando pago");
    } finally {
      setSubmitting(false);
    }
  }

  // ─── Vista lista ───
  if (step === "list") {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-5 h-5 animate-spin text-white/40" />
        </div>
      );
    }

    // Agrupar por categoría
    const byCategory: Record<string, Biller[]> = {};
    for (const b of billers) {
      if (!byCategory[b.category]) byCategory[b.category] = [];
      byCategory[b.category].push(b);
    }

    return (
      <div className="space-y-4">
        {/* Selector de país */}
        <div className="flex gap-2">
          {(["AR", "UY", "PY"] as const).map((c) => (
            <button
              key={c}
              onClick={() => setCountry(c)}
              className={`px-3 py-1.5 rounded-lg text-xs ${
                country === c ? "bg-blue-500/20 text-blue-200 ring-1 ring-blue-500/30" : "bg-white/5 text-white/50 hover:bg-white/10"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {Object.entries(byCategory).map(([cat, list]) => {
          const Icon = CATEGORY_ICONS[cat] || FileText;
          return (
            <div key={cat}>
              <h3 className="text-xs uppercase tracking-wide text-white/40 mb-2">{CATEGORY_LABELS[cat] || cat}</h3>
              <div className="space-y-1">
                {list.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => chooseBiller(b)}
                    className="w-full flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 ring-1 ring-white/10 rounded-xl transition-colors"
                  >
                    <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-blue-300 shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-sm text-white flex-1 text-left">{b.name}</span>
                    <ChevronRight className="w-4 h-4 text-white/30" />
                  </button>
                ))}
              </div>
            </div>
          );
        })}
        {billers.length === 0 && (
          <div className="text-center py-8 text-sm text-white/40">
            Sin proveedores disponibles en {country}
          </div>
        )}
      </div>
    );
  }

  // ─── Vista referencia ───
  if (step === "reference" && selected) {
    return (
      <div className="space-y-4">
        <button onClick={backToList} className="inline-flex items-center gap-1 text-xs text-white/60 hover:text-white">
          <ArrowLeft className="w-3.5 h-3.5" />
          Volver
        </button>
        <div className="bg-white/5 ring-1 ring-white/10 rounded-xl p-4">
          <div className="text-xs text-white/40 mb-1">Pagar</div>
          <div className="text-lg text-white">{selected.name}</div>
        </div>
        <div>
          <label className="text-xs text-white/60">{selected.referenceLabel}</label>
          <input
            type="text"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            placeholder={selected.referenceLabel}
            className="w-full mt-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm"
            autoFocus
          />
        </div>
        <button
          onClick={doLookup}
          disabled={!reference.trim() || submitting}
          className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-white/10 disabled:text-white/40 text-white rounded-lg py-2.5 text-sm font-medium transition-colors flex items-center justify-center gap-2"
        >
          {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Consultar"}
        </button>
      </div>
    );
  }

  // ─── Vista confirmación ───
  if (step === "confirm" && bill && selected) {
    return (
      <div className="space-y-4">
        <button onClick={() => setStep("reference")} className="inline-flex items-center gap-1 text-xs text-white/60 hover:text-white">
          <ArrowLeft className="w-3.5 h-3.5" />
          Volver
        </button>
        <div className="bg-white/5 ring-1 ring-white/10 rounded-xl p-4 space-y-2">
          <Row label="Proveedor" value={selected.name} />
          <Row label="Referencia" value={bill.reference} mono />
          {bill.beneficiary && <Row label="A nombre de" value={bill.beneficiary} />}
          {bill.dueDate && <Row label="Vencimiento" value={new Date(bill.dueDate).toLocaleDateString("es-AR")} />}
          <div className="border-t border-white/5 pt-2">
            <div className="text-xs text-white/40">Monto a pagar</div>
            <div className="text-2xl font-semibold text-white">
              ${(bill.amount || 0).toLocaleString("es-AR", { minimumFractionDigits: 2 })}
            </div>
          </div>
        </div>
        <button
          onClick={doPay}
          disabled={submitting}
          className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-white/10 text-white rounded-lg py-2.5 text-sm font-medium flex items-center justify-center gap-2"
        >
          {submitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Check className="w-4 h-4" />
              Confirmar pago
            </>
          )}
        </button>
      </div>
    );
  }

  return null;
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-white/50">{label}</span>
      <span className={`text-white ${mono ? "font-mono" : ""}`}>{value}</span>
    </div>
  );
}
