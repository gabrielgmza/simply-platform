"use client";

import { useEffect, useState } from "react";
import {
  X, Receipt, CheckCircle, XCircle, Clock, Copy, Check, Loader2, AlertCircle,
} from "lucide-react";
import { useToast } from "@/components/toast/Toast";
import { getServicePayment, type ServicePaymentDetail } from "@/lib/services-api";

interface Props {
  paymentId: string | null;
  open: boolean;
  onClose: () => void;
}

export default function ServicePaymentDetailModal({ paymentId, open, onClose }: Props) {
  const [data, setData] = useState<ServicePaymentDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  useEffect(() => {
    if (!open || !paymentId) return;
    setLoading(true);
    setError(null);
    setData(null);
    getServicePayment(paymentId)
      .then(setData)
      .catch((e: any) => setError(e.message || "Error cargando detalle"))
      .finally(() => setLoading(false));
  }, [open, paymentId]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[80] bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-md bg-zinc-900 sm:rounded-2xl rounded-t-2xl border border-white/10 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-white/5 shrink-0">
          <h3 className="text-base font-semibold text-white">Detalle del pago</h3>
          <button onClick={onClose} className="text-white/50 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-5 h-5 animate-spin text-white/40" />
            </div>
          ) : error ? (
            <div className="flex items-start gap-2 text-sm text-red-400 bg-red-500/10 ring-1 ring-red-500/30 rounded-lg p-3">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          ) : data ? (
            <Content payment={data} toast={toast} />
          ) : null}
        </div>
      </div>
    </div>
  );
}

const STATUS_CONFIG: Record<string, { label: string; icon: any; bg: string; text: string }> = {
  completed: { label: "Completado", icon: CheckCircle, bg: "bg-emerald-500/15", text: "text-emerald-300" },
  pending:   { label: "Pendiente",  icon: Clock,       bg: "bg-amber-500/15",   text: "text-amber-300" },
  failed:    { label: "Fallido",    icon: XCircle,     bg: "bg-red-500/15",     text: "text-red-300" },
  refunded:  { label: "Reembolsado",icon: XCircle,     bg: "bg-white/10",       text: "text-white/50" },
};

function Content({ payment, toast }: { payment: ServicePaymentDetail; toast: any }) {
  const statusConfig = STATUS_CONFIG[payment.status] || STATUS_CONFIG.pending;
  const StatusIcon = statusConfig.icon;

  function copy(value: string, label: string) {
    navigator.clipboard.writeText(value).then(() => toast.success(`${label} copiado`));
  }

  return (
    <div className="space-y-4">
      {/* Header con icono + monto */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-cyan-300">
          <Receipt className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs text-white/50">{payment.biller?.name || "Pago de servicio"}</div>
          <div className="text-xl font-semibold text-white">
            ${Number(payment.amount).toLocaleString("es-AR", { minimumFractionDigits: 2 })} {payment.currency}
          </div>
        </div>
      </div>

      {/* Status badge */}
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs ${statusConfig.bg} ${statusConfig.text}`}>
        <StatusIcon className="w-3.5 h-3.5" />
        {statusConfig.label}
      </div>

      {/* Detalle */}
      <div className="space-y-1 text-sm">
        {payment.biller && (
          <>
            <Field label="Proveedor" value={payment.biller.name} />
            <Field label={payment.biller.referenceLabel || "Referencia"} value={payment.reference} mono onCopy={() => copy(payment.reference, "Referencia")} />
          </>
        )}
        {!payment.biller && (
          <Field label="Referencia" value={payment.reference} mono />
        )}
        <Field label="Fecha" value={new Date(payment.createdAt).toLocaleString("es-AR", { dateStyle: "long", timeStyle: "short" })} />
        {payment.completedAt && (
          <Field label="Procesado" value={new Date(payment.completedAt).toLocaleString("es-AR", { dateStyle: "long", timeStyle: "short" })} />
        )}
        <Field
          label="ID del pago"
          value={payment.id}
          mono small
          onCopy={() => copy(payment.id, "ID")}
        />
        {payment.providerExternalId && (
          <Field
            label="ID proveedor"
            value={payment.providerExternalId}
            mono small
            onCopy={() => copy(payment.providerExternalId!, "ID proveedor")}
          />
        )}
        {payment.scheduledPaymentId && (
          <Field label="Pago programado" value="Ejecución automática" />
        )}
      </div>
    </div>
  );
}

function Field({ label, value, mono, small, onCopy }: { label: string; value: string; mono?: boolean; small?: boolean; onCopy?: () => void }) {
  const [copied, setCopied] = useState(false);
  function handleClick() {
    if (!onCopy) return;
    onCopy();
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }
  return (
    <div className="flex items-start justify-between gap-2 py-1.5 border-b border-white/5 last:border-0">
      <span className="text-white/50 shrink-0">{label}</span>
      <div className="flex items-center gap-1.5 min-w-0">
        <span className={`text-white text-right truncate ${mono ? "font-mono" : ""} ${small ? "text-xs" : ""}`}>{value}</span>
        {onCopy && (
          <button onClick={handleClick} className="text-white/40 hover:text-white shrink-0">
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        )}
      </div>
    </div>
  );
}
