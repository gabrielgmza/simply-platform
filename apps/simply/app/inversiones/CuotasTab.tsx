"use client";

import { useEffect, useState } from "react";
import { Card, Button } from "@simply/ui";
import { Loader2, Receipt, Check, AlertCircle } from "lucide-react";
import { getCreditLoans, payInstallment, type CreditLoan } from "@/lib/investments-api";

function fmt(n: number, currency: string = "ARS") {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: currency === "ARS" ? "ARS" : "USD",
    minimumFractionDigits: 2,
  }).format(n);
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("es-AR", { day: "2-digit", month: "short", year: "numeric" });
}

export default function CuotasTab({ customerId }: { customerId: string }) {
  const [loans, setLoans] = useState<CreditLoan[]>([]);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const r = await getCreditLoans(customerId).catch(() => ({ items: [] }));
    setLoans(r.items.filter((l) => l.status === "active"));
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, [customerId]);

  async function handlePay(installmentId: string, amount: number) {
    if (!confirm(`¿Pagar cuota de ${fmt(amount)}?`)) return;
    setPaying(installmentId);
    try {
      await payInstallment(installmentId, amount);
      await load();
    } catch (e: any) {
      alert(e.message);
    } finally {
      setPaying(null);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 text-white/60">
        <Loader2 className="w-5 h-5 animate-spin mr-2" /> Cargando...
      </div>
    );
  }

  if (loans.length === 0) {
    return (
      <Card>
        <div className="p-8 text-center text-white/50">No tenés cuotas activas.</div>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {loans.map((loan) => (
        <Card key={loan.id}>
          <div className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="text-[10px] uppercase tracking-wide text-white/40">
                  {loan.origin === "transfer" ? "Transferencia" : loan.origin === "service_payment" ? "Servicio" : loan.origin}
                </div>
                <div className="text-lg font-semibold text-white">
                  {fmt(parseFloat(loan.principal), loan.currency)}
                </div>
                <div className="text-xs text-white/50">
                  {loan.installmentsCount} cuotas de {fmt(parseFloat(loan.installmentAmount), loan.currency)}
                </div>
              </div>
              <Receipt className="w-5 h-5 text-white/30" />
            </div>

            <div className="space-y-1.5">
              {(loan.installments || []).map((inst) => {
                const isPaid = inst.status === "paid";
                const isOverdue = inst.status === "overdue";
                const amount = parseFloat(inst.amount);
                const paid = parseFloat(inst.paidAmount);
                const remaining = amount - paid + parseFloat(inst.moraAmount);

                return (
                  <div
                    key={inst.id}
                    className={`flex items-center gap-2 p-2 rounded-lg text-xs ${
                      isPaid
                        ? "bg-emerald-500/5 text-emerald-300"
                        : isOverdue
                        ? "bg-rose-500/5 text-rose-300"
                        : "bg-white/5"
                    }`}
                  >
                    <div className="w-6 h-6 rounded-full flex items-center justify-center">
                      {isPaid ? (
                        <Check className="w-3.5 h-3.5" />
                      ) : isOverdue ? (
                        <AlertCircle className="w-3.5 h-3.5" />
                      ) : (
                        <span className="text-[10px] text-white/40">#{inst.installmentNumber}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className={isPaid ? "" : "text-white"}>
                        Cuota {inst.installmentNumber} · {fmtDate(inst.dueDate)}
                      </div>
                      {parseFloat(inst.moraAmount) > 0 && (
                        <div className="text-rose-400 text-[10px]">
                          + Mora {fmt(parseFloat(inst.moraAmount), loan.currency)}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className={isPaid ? "" : "text-white font-medium"}>
                        {fmt(amount, loan.currency)}
                      </div>
                    </div>
                    {!isPaid && (
                      <button
                        onClick={() => handlePay(inst.id, remaining)}
                        disabled={paying === inst.id}
                        className="text-[10px] bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 px-2 py-1 rounded-md disabled:opacity-50"
                      >
                        {paying === inst.id ? "..." : "Pagar"}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
