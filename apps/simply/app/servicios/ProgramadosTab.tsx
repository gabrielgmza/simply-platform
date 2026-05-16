"use client";

import { useEffect, useState } from "react";
import { Calendar, Loader2, Trash2, Pause, Play, Plus } from "lucide-react";
import { useToast } from "@/components/toast/Toast";
import SchedulePaymentModal from "./SchedulePaymentModal";
import {
  listScheduled, updateScheduled, deleteScheduled,
  type ScheduledPayment,
} from "@/lib/services-api";

export default function ProgramadosTab({ customerId }: { customerId: string }) {
  const [items, setItems] = useState<ScheduledPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const [modalOpen, setModalOpen] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const data = await listScheduled(customerId);
      setItems(data);
    } catch (e: any) {
      toast.error(e.message || "Error cargando programados");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [customerId]);

  async function togglePause(item: ScheduledPayment) {
    try {
      const updated = await updateScheduled(customerId, item.id, { paused: !item.paused });
      setItems((prev) => prev.map((x) => (x.id === item.id ? updated : x)));
      toast.success(item.paused ? "Reanudado" : "Pausado");
    } catch (e: any) {
      toast.error(e.message);
    }
  }

  async function remove(item: ScheduledPayment) {
    if (!confirm(`¿Eliminar el pago programado "${item.nickname || item.reference}"?`)) return;
    try {
      await deleteScheduled(customerId, item.id);
      setItems((prev) => prev.filter((x) => x.id !== item.id));
      toast.success("Eliminado");
    } catch (e: any) {
      toast.error(e.message);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-5 h-5 animate-spin text-white/40" />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <button
        onClick={() => setModalOpen(true)}
        className="w-full flex items-center justify-center gap-1.5 bg-emerald-500/10 hover:bg-emerald-500/15 ring-1 ring-emerald-500/30 text-emerald-200 rounded-lg py-2.5 text-sm font-medium"
      >
        <Plus className="w-4 h-4" />
        Programar nuevo pago
      </button>
      {items.length === 0 ? (
        <div className="text-center py-12 bg-white/5 ring-1 ring-white/10 rounded-2xl">
          <Calendar className="w-10 h-10 text-white/30 mx-auto mb-3" />
          <p className="text-sm text-white">Sin pagos programados</p>
          <p className="text-xs text-white/50 mt-1">Programá pagos automáticos al pagar un servicio.</p>
        </div>
      ) : (
        items.map((item) => (
          <div key={item.id} className="bg-white/5 ring-1 ring-white/10 rounded-xl p-3 flex items-center gap-3">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${item.paused ? "bg-white/5 text-white/30" : "bg-emerald-500/15 text-emerald-300"}`}>
              <Calendar className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm text-white truncate">{item.nickname || item.reference}</div>
              <div className="text-xs text-white/50 truncate">
                {frequencyLabel(item.frequency)} · {strategyLabel(item.amountStrategy, item.fixedAmount, item.maxAmount)}
              </div>
            </div>
            <button onClick={() => togglePause(item)} className="text-white/40 hover:text-white p-1.5" title={item.paused ? "Reanudar" : "Pausar"}>
              {item.paused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            </button>
            <button onClick={() => remove(item)} className="text-white/40 hover:text-red-400 p-1.5" title="Eliminar">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))
      )}
      <SchedulePaymentModal
        customerId={customerId}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={load}
      />
    </div>
  );
}

function frequencyLabel(f: string): string {
  if (f === "monthly") return "Mensual";
  if (f === "weekly") return "Semanal";
  return "Al vencimiento";
}

function strategyLabel(s: string, fixed: number | null, max: number | null): string {
  if (s === "fixed" && fixed) return `Monto fijo $${fixed.toLocaleString("es-AR")}`;
  if (s === "up_to_max" && max) return `Hasta $${max.toLocaleString("es-AR")}`;
  if (s === "invoice_amount") return "Monto de factura";
  return s;
}
