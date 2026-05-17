"use client";

import { useEffect, useState } from "react";
import { Card, Button } from "@simply/ui";
import { Loader2, TrendingUp, Clock, Wallet, Plus, Minus, Sparkles } from "lucide-react";
import {
  getInvestments,
  getCreditLines,
  type InvestmentAccount,
  type CreditLine,
} from "@/lib/investments-api";
import DepositModal from "./DepositModal";
import WithdrawModal from "./WithdrawModal";
import RequestCreditModal from "./RequestCreditModal";

function fmt(n: number, currency: string = "ARS") {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: currency === "ARS" ? "ARS" : "USD",
    minimumFractionDigits: 2,
  }).format(n);
}

export default function ResumenTab({ customerId, accountLevel }: { customerId: string; accountLevel: string }) {
  const [accounts, setAccounts] = useState<InvestmentAccount[]>([]);
  const [lines, setLines] = useState<CreditLine[]>([]);
  const [loading, setLoading] = useState(true);
  const [depositOpen, setDepositOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState<string | null>(null);
  const [creditOpen, setCreditOpen] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const [inv, cl] = await Promise.all([
      getInvestments(customerId).catch(() => ({ accounts: [] })),
      getCreditLines(customerId, accountLevel).catch(() => ({ lines: [] })),
    ]);
    setAccounts(inv.accounts);
    setLines(cl.lines);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, [customerId, accountLevel]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 text-white/60">
        <Loader2 className="w-5 h-5 animate-spin mr-2" /> Cargando...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {accounts.length === 0 ? (
        <Card>
          <div className="p-6 text-center space-y-3">
            <div className="w-12 h-12 mx-auto rounded-full bg-violet-500/10 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-violet-300" />
            </div>
            <h3 className="text-white font-semibold">Empezá a hacer rendir tu plata</h3>
            <p className="text-sm text-white/60">
              Invertí y accedé a crédito sin desarmar tu capital. Rendimiento diario, 0% interés en tu límite.
            </p>
            <Button onClick={() => setDepositOpen(true)} className="w-full">
              <Plus className="w-4 h-4 mr-1" /> Hacer primer depósito
            </Button>
          </div>
        </Card>
      ) : (
        <>
          {accounts.map((acc) => {
            const line = lines.find((l) => l.currency === acc.currency);
            return (
              <Card key={acc.id}>
                <div className="p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[10px] uppercase tracking-wide text-white/40">Inversión {acc.currency}</div>
                      <div className="text-2xl font-semibold text-white mt-0.5">
                        {fmt(parseFloat(acc.principal), acc.currency)}
                      </div>
                    </div>
                    {!acc.isActive ? (
                      <div className="flex items-center gap-1.5 text-xs bg-amber-500/10 text-amber-300 ring-1 ring-amber-500/20 px-2 py-1 rounded-full">
                        <Clock className="w-3 h-3" />
                        Activa en {acc.hoursToActivate}h
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-xs bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-500/20 px-2 py-1 rounded-full">
                        <TrendingUp className="w-3 h-3" />
                        Activa
                      </div>
                    )}
                  </div>

                  {parseFloat(acc.accruedYield) > 0 && (
                    <div className="text-xs text-emerald-400">
                      + {fmt(parseFloat(acc.accruedYield), acc.currency)} acumulado en rendimiento
                    </div>
                  )}

                  {line && (
                    <div className="bg-white/5 rounded-xl p-3 space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-white/60">Línea de crédito disponible</span>
                        <span className="text-white/40">LTV {line.ltvPercent}%</span>
                      </div>
                      <div className="text-xl font-semibold text-emerald-300">
                        {fmt(line.available, acc.currency)}
                      </div>
                      {line.activeLoanPrincipal > 0 && (
                        <div className="text-[11px] text-white/50">
                          Usado: {fmt(line.activeLoanPrincipal, acc.currency)} · Bruto: {fmt(line.grossLine, acc.currency)}
                        </div>
                      )}
                      <Button
                        onClick={() => setCreditOpen(acc.currency)}
                        disabled={!acc.isActive || line.available <= 0}
                        className="w-full mt-2"
                      >
                        Solicitar crédito
                      </Button>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      onClick={() => setDepositOpen(true)}
                      variant="secondary"
                      className="flex items-center justify-center gap-1"
                    >
                      <Plus className="w-4 h-4" /> Depositar
                    </Button>
                    <Button
                      onClick={() => setWithdrawOpen(acc.currency)}
                      variant="secondary"
                      className="flex items-center justify-center gap-1"
                      disabled={parseFloat(acc.principal) <= 0}
                    >
                      <Minus className="w-4 h-4" /> Retirar
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </>
      )}

      <DepositModal
        customerId={customerId}
        open={depositOpen}
        onClose={() => setDepositOpen(false)}
        onSuccess={() => {
          setDepositOpen(false);
          load();
        }}
      />
      <WithdrawModal
        customerId={customerId}
        currency={withdrawOpen}
        open={!!withdrawOpen}
        accounts={accounts}
        onClose={() => setWithdrawOpen(null)}
        onSuccess={() => {
          setWithdrawOpen(null);
          load();
        }}
      />
      <RequestCreditModal
        customerId={customerId}
        currency={creditOpen}
        level={accountLevel}
        open={!!creditOpen}
        line={lines.find((l) => l.currency === creditOpen)}
        onClose={() => setCreditOpen(null)}
        onSuccess={() => {
          setCreditOpen(null);
          load();
        }}
      />
    </div>
  );
}
