"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  X, User, Building2, Bitcoin, ArrowRight, AlertCircle,
} from "lucide-react";
import { useToast } from "@/components/toast/Toast";

type TabKey = "simply" | "cbu" | "crypto";

const TABS: Array<{ key: TabKey; label: string; icon: any; iconColor: string }> = [
  { key: "simply", label: "A Simply", icon: User,       iconColor: "text-blue-300" },
  { key: "cbu",    label: "A CBU",    icon: Building2,  iconColor: "text-emerald-300" },
  { key: "crypto", label: "Cripto",   icon: Bitcoin,    iconColor: "text-amber-300" },
];

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function SendModal({ open, onClose }: Props) {
  const router = useRouter();
  const toast = useToast();
  const [tab, setTab] = useState<TabKey>("simply");

  // Form state por tab
  const [simplyTarget, setSimplyTarget] = useState("");
  const [cbu, setCbu] = useState("");
  const [cryptoAddress, setCryptoAddress] = useState("");
  const [cryptoNetwork, setCryptoNetwork] = useState("TRC20");
  const [cryptoAsset, setCryptoAsset] = useState("USDT");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  // Cerrar con Escape
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  function handleContinue() {
    const params = new URLSearchParams();
    params.set("tab", tab);
    if (tab === "simply") {
      if (!simplyTarget.trim()) {
        toast.error("Indicá el email o alias del destinatario");
        return;
      }
      params.set("target", simplyTarget.trim());
    } else if (tab === "cbu") {
      const cleanCbu = cbu.replace(/\s/g, "");
      if (cleanCbu.length !== 22 || !/^\d+$/.test(cleanCbu)) {
        toast.error("CBU inválido (22 dígitos)");
        return;
      }
      params.set("cbu", cleanCbu);
    } else if (tab === "crypto") {
      if (!cryptoAddress.trim()) {
        toast.error("Indicá la dirección de la wallet");
        return;
      }
      params.set("address", cryptoAddress.trim());
      params.set("network", cryptoNetwork);
      params.set("asset", cryptoAsset);
    }
    if (amount) params.set("amount", amount);
    if (note) params.set("note", note);

    onClose();
    router.push(`/destinatario?${params.toString()}`);
  }

  return (
    <div
      className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-md bg-zinc-900 sm:rounded-2xl rounded-t-2xl border border-white/10 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/5">
          <h3 className="text-base font-semibold text-white">Enviar dinero</h3>
          <button
            onClick={onClose}
            className="text-white/50 hover:text-white p-1"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/5">
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = tab === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex-1 flex flex-col items-center gap-1 py-3 px-2 text-xs transition-colors ${
                  active
                    ? "text-white border-b-2 border-blue-400"
                    : "text-white/50 hover:text-white"
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? t.iconColor : ""}`} />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Body */}
        <div className="p-4 space-y-3">
          {tab === "simply" && (
            <div>
              <label className="text-[10px] uppercase tracking-wide text-white/40">
                Email o alias de Simply
              </label>
              <input
                type="text"
                value={simplyTarget}
                onChange={(e) => setSimplyTarget(e.target.value)}
                placeholder="usuario@email.com o alias.simply"
                className="w-full mt-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
                autoFocus
              />
            </div>
          )}

          {tab === "cbu" && (
            <div>
              <label className="text-[10px] uppercase tracking-wide text-white/40">
                CBU del destinatario (22 dígitos)
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={cbu}
                onChange={(e) => setCbu(e.target.value)}
                placeholder="0000000000000000000000"
                maxLength={26}
                className="w-full mt-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm font-mono"
                autoFocus
              />
            </div>
          )}

          {tab === "crypto" && (
            <>
              <div>
                <label className="text-[10px] uppercase tracking-wide text-white/40">
                  Dirección de la wallet
                </label>
                <input
                  type="text"
                  value={cryptoAddress}
                  onChange={(e) => setCryptoAddress(e.target.value)}
                  placeholder="TXyZ..."
                  className="w-full mt-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm font-mono"
                  autoFocus
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] uppercase tracking-wide text-white/40">Red</label>
                  <select
                    value={cryptoNetwork}
                    onChange={(e) => setCryptoNetwork(e.target.value)}
                    className="w-full mt-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
                  >
                    <option value="TRC20" className="bg-zinc-900">TRC20 (Tron)</option>
                    <option value="ERC20" className="bg-zinc-900">ERC20 (Ethereum)</option>
                    <option value="BEP20" className="bg-zinc-900">BEP20 (BSC)</option>
                    <option value="POLYGON" className="bg-zinc-900">Polygon</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-wide text-white/40">Activo</label>
                  <select
                    value={cryptoAsset}
                    onChange={(e) => setCryptoAsset(e.target.value)}
                    className="w-full mt-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
                  >
                    <option value="USDT" className="bg-zinc-900">USDT</option>
                    <option value="USDC" className="bg-zinc-900">USDC</option>
                  </select>
                </div>
              </div>
              <div className="text-[10px] text-amber-300 flex items-start gap-1.5 bg-amber-500/5 ring-1 ring-amber-500/20 rounded-lg p-2">
                <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>Verificá la dirección y red. Los envíos cripto son irreversibles.</span>
              </div>
            </>
          )}

          {/* Monto y nota (común) */}
          <div>
            <label className="text-[10px] uppercase tracking-wide text-white/40">
              Monto (opcional)
            </label>
            <input
              type="text"
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full mt-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
            />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-wide text-white/40">
              Concepto (opcional)
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ej: alquiler febrero"
              className="w-full mt-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
            />
          </div>

          <button
            onClick={handleContinue}
            className="w-full flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg py-2.5 text-sm font-medium transition-colors mt-2"
          >
            Continuar
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
