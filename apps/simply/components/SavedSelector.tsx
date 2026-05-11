"use client";

import { useEffect, useState } from "react";
import { BookOpen, Plus, ChevronDown } from "lucide-react";
import {
  listWallets,
  listBanks,
  type SavedWallet,
  type SavedBankAccount,
} from "@/lib/customer-book-api";

interface PropsWallet {
  kind: "wallet";
  customerId: string;
  /** Cripto: filtrar por symbol+network del destino */
  filter: { symbol: string; network: string };
  onPick: (w: SavedWallet) => void;
}

interface PropsBank {
  kind: "bank";
  customerId: string;
  /** Fiat: filtrar por country+currency del destino */
  filter: { country: string; currency: string };
  onPick: (b: SavedBankAccount) => void;
}

type Props = PropsWallet | PropsBank;

export default function SavedSelector(props: Props) {
  const [wallets, setWallets] = useState<SavedWallet[] | null>(null);
  const [banks, setBanks] = useState<SavedBankAccount[] | null>(null);
  const [expanded, setExpanded] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        if (props.kind === "wallet") {
          const data = await listWallets(props.customerId);
          if (!cancelled) setWallets(data);
        } else {
          const data = await listBanks(props.customerId);
          if (!cancelled) setBanks(data);
        }
      } catch (e: any) {
        if (!cancelled) setError(e.message);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [props.kind, props.customerId]);

  // Filtrar por match con el destino actual
  const filteredWallets = (wallets || []).filter(
    (w) =>
      props.kind === "wallet" &&
      w.symbol.toUpperCase() === props.filter.symbol.toUpperCase() &&
      w.network.toUpperCase() === props.filter.network.toUpperCase(),
  );

  const filteredBanks = (banks || []).filter(
    (b) =>
      props.kind === "bank" &&
      b.country.toUpperCase() === props.filter.country.toUpperCase() &&
      b.currency.toUpperCase() === props.filter.currency.toUpperCase(),
  );

  const items = props.kind === "wallet" ? filteredWallets : filteredBanks;
  const loading = (props.kind === "wallet" ? wallets : banks) === null;

  // Nada que mostrar si no hay match
  if (loading) return null;
  if (items.length === 0) return null;
  if (error) return null;

  return (
    <div className="rounded-xl bg-blue-500/5 border border-blue-500/20 overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between px-3 py-2.5 text-left hover:bg-white/5 transition"
      >
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-blue-300" />
          <span className="text-xs font-medium text-blue-200">
            {items.length} {props.kind === "wallet" ? "wallet" : "cuenta"}
            {items.length !== 1 ? "s" : ""} guardada
            {items.length !== 1 ? "s" : ""} en tu libreta
          </span>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-blue-300 transition ${expanded ? "rotate-180" : ""}`}
        />
      </button>

      {expanded && (
        <div className="border-t border-blue-500/20 max-h-72 overflow-y-auto">
          {props.kind === "wallet" &&
            filteredWallets.map((w) => (
              <WalletRow key={w.id} wallet={w} onPick={() => props.onPick(w)} />
            ))}
          {props.kind === "bank" &&
            filteredBanks.map((b) => (
              <BankRow key={b.id} bank={b} onPick={() => props.onPick(b)} />
            ))}

          <a
            href="/cuenta?tab=libreta"
            className="flex items-center gap-2 px-3 py-2.5 text-xs text-zinc-400 hover:text-white hover:bg-white/5 transition border-t border-blue-500/10"
          >
            <Plus className="w-3.5 h-3.5" />
            Gestionar libreta en Mi cuenta
          </a>
        </div>
      )}
    </div>
  );
}

function WalletRow({ wallet, onPick }: { wallet: SavedWallet; onPick: () => void }) {
  return (
    <button
      type="button"
      onClick={onPick}
      className="w-full text-left px-3 py-2.5 hover:bg-white/5 transition flex items-center gap-3 border-b border-white/5 last:border-0"
    >
      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-600/20 border border-blue-500/30 text-[10px] font-bold text-blue-300 shrink-0">
        {wallet.symbol.slice(0, 3)}
      </span>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-white truncate">{wallet.label}</div>
        <div className="text-[10px] font-mono text-zinc-500 truncate">
          {wallet.address.slice(0, 18)}…{wallet.address.slice(-8)}
        </div>
      </div>
      <span className="text-[10px] text-blue-300 shrink-0">Usar →</span>
    </button>
  );
}

function BankRow({ bank, onPick }: { bank: SavedBankAccount; onPick: () => void }) {
  const flagMap: Record<string, string> = {
    AR: "🇦🇷", BR: "🇧🇷", CL: "🇨🇱", CO: "🇨🇴", MX: "🇲🇽",
    PE: "🇵🇪", VE: "🇻🇪", US: "🇺🇸", EU: "🇪🇺", CN: "🇨🇳",
  };
  return (
    <button
      type="button"
      onClick={onPick}
      className="w-full text-left px-3 py-2.5 hover:bg-white/5 transition flex items-center gap-3 border-b border-white/5 last:border-0"
    >
      <span className="text-base shrink-0">{flagMap[bank.country] || "🏦"}</span>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-white truncate">{bank.label}</div>
        <div className="text-[10px] text-zinc-500 truncate">
          {bank.beneficiaryFirstName} {bank.beneficiaryLastName} · Cta. {bank.accountNumber}
        </div>
      </div>
      <span className="text-[10px] text-blue-300 shrink-0">Usar →</span>
    </button>
  );
}
