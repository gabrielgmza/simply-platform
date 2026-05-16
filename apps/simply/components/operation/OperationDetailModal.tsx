"use client";

import { useEffect, useState } from "react";
import {
  X, ArrowDownLeft, ArrowUpRight, Bitcoin, Receipt, CheckCircle, XCircle, Clock,
  Copy, Check, Loader2, AlertCircle,
} from "lucide-react";
import { useToast } from "@/components/toast/Toast";
import { getOperation, type Operation } from "@/lib/operations-api";

interface Props {
  operationId: string | null;
  open: boolean;
  onClose: () => void;
}

export default function OperationDetailModal({ operationId, open, onClose }: Props) {
  const [op, setOp] = useState<Operation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  useEffect(() => {
    if (!open || !operationId) return;
    setLoading(true);
    setError(null);
    setOp(null);
    getOperation(operationId)
      .then(setOp)
      .catch((e: any) => setError(e.message || "Error cargando detalle"))
      .finally(() => setLoading(false));
  }, [open, operationId]);

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
          <h3 className="text-base font-semibold text-white">Detalle de operación</h3>
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
          ) : op ? (
            <OperationContent op={op} toast={toast} />
          ) : null}
        </div>
      </div>
    </div>
  );
}

function OperationContent({ op, toast }: { op: Operation; toast: any }) {
  const moduleConfig = MODULE_CONFIG[op.module] || MODULE_CONFIG.default;
  const Icon = moduleConfig.icon;
  const statusConfig = STATUS_CONFIG[op.status] || STATUS_CONFIG.pending;
  const StatusIcon = statusConfig.icon;

  function copy(value: string, label: string) {
    navigator.clipboard.writeText(value).then(() => toast.success(`${label} copiado`));
  }

  const md = op.metadata || {};
  const description = String(md.description || md.note || md.concept || "");

  return (
    <div className="space-y-4">
      {/* Header con icono + monto */}
      <div className="flex items-center gap-3">
        <div className={`w-12 h-12 rounded-full bg-white/5 flex items-center justify-center ${moduleConfig.iconColor}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs text-white/50">{moduleConfig.label}</div>
          <div className="text-xl font-semibold text-white">
            ${Number(op.amount).toLocaleString("es-AR", { minimumFractionDigits: 2 })} {op.currency}
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
        {description && <Field label="Descripción" value={description} />}
        <Field label="Tipo" value={op.type} mono />
        <Field label="Fecha" value={new Date(op.createdAt).toLocaleString("es-AR", { dateStyle: "long", timeStyle: "short" })} />
        <Field
          label="ID operación"
          value={op.id}
          mono small
          onCopy={() => copy(op.id, "ID")}
        />
        {op.externalId && (
          <Field
            label="ID externo (proveedor)"
            value={op.externalId}
            mono small
            onCopy={() => copy(op.externalId!, "ID externo")}
          />
        )}
        {md.beneficiary && <Field label="A nombre de" value={String(md.beneficiary)} />}
        {md.cbu && <Field label="CBU destino" value={String(md.cbu)} mono onCopy={() => copy(String(md.cbu), "CBU")} />}
        {md.address && <Field label="Dirección destino" value={String(md.address)} mono small onCopy={() => copy(String(md.address), "Dirección")} />}
        {md.network && <Field label="Red" value={String(md.network)} />}
        {md.providerStatus && <Field label="Estado proveedor" value={String(md.providerStatus)} mono />}
      </div>

      {/* Metadata adicional (todo lo que no mapeamos) */}
      {Object.keys(md).filter((k) => !["description","note","concept","beneficiary","cbu","address","network","providerStatus","providerExternalId"].includes(k)).length > 0 && (
        <details className="text-xs text-white/40">
          <summary className="cursor-pointer hover:text-white/60">Metadata avanzada</summary>
          <pre className="mt-2 bg-white/5 rounded-lg p-2 overflow-x-auto text-[10px]">
            {JSON.stringify(md, null, 2)}
          </pre>
        </details>
      )}
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
          <button onClick={handleClick} className="text-white/40 hover:text-white shrink-0" title="Copiar">
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        )}
      </div>
    </div>
  );
}

const MODULE_CONFIG: Record<string, { label: string; icon: any; iconColor: string }> = {
  wallet:    { label: "Transferencia ARS",    icon: ArrowUpRight,    iconColor: "text-blue-300" },
  transfers: { label: "Transferencia",         icon: ArrowUpRight,    iconColor: "text-blue-300" },
  crypto:    { label: "Operación cripto",      icon: Bitcoin,         iconColor: "text-amber-300" },
  remesas:   { label: "Remesa",                icon: ArrowDownLeft,   iconColor: "text-emerald-300" },
  services:  { label: "Pago de servicio",      icon: Receipt,         iconColor: "text-cyan-300" },
  default:   { label: "Operación",             icon: ArrowUpRight,    iconColor: "text-white/50" },
};

const STATUS_CONFIG: Record<string, { label: string; icon: any; bg: string; text: string }> = {
  completed: { label: "Completada", icon: CheckCircle, bg: "bg-emerald-500/15", text: "text-emerald-300" },
  pending:   { label: "Pendiente",  icon: Clock,       bg: "bg-amber-500/15",   text: "text-amber-300" },
  failed:    { label: "Fallida",    icon: XCircle,     bg: "bg-red-500/15",     text: "text-red-300" },
  cancelled: { label: "Cancelada",  icon: XCircle,     bg: "bg-white/10",       text: "text-white/50" },
};
