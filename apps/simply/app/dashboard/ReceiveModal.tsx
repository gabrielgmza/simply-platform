"use client";

import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  X, Building2, Bitcoin, QrCode, Link as LinkIcon,
  Copy, Check, Loader2, AlertTriangle, Share2,
} from "lucide-react";
import { useToast } from "@/components/toast/Toast";
import { getBalances } from "@/lib/balances-api";

type TabKey = "cvu" | "crypto" | "qr" | "link";

const TABS: Array<{ key: TabKey; label: string; icon: any }> = [
  { key: "cvu",    label: "CVU",    icon: Building2 },
  { key: "crypto", label: "Cripto", icon: Bitcoin },
  { key: "qr",     label: "QR",     icon: QrCode },
  { key: "link",   label: "Link",   icon: LinkIcon },
];

interface Props {
  customerId: string;
  firstName?: string;
  open: boolean;
  onClose: () => void;
}

export default function ReceiveModal({ customerId, firstName, open, onClose }: Props) {
  const [tab, setTab] = useState<TabKey>("cvu");
  const [cvu, setCvu] = useState<string | null>(null);
  const [alias, setAlias] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    getBalances(customerId)
      .then((bal) => {
        const wallet = bal.wallets?.[0];
        setCvu(wallet?.cvu || null);
        setAlias(wallet?.alias || null);
      })
      .catch(() => setCvu(null))
      .finally(() => setLoading(false));
  }, [open, customerId]);

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

  // Link de recepción público (placeholder)
  const publicLink = alias
    ? `https://app.gosimply.xyz/p/${alias}`
    : `https://app.gosimply.xyz/p/${customerId.slice(0, 8)}`;

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
          <h3 className="text-base font-semibold text-white">Recibir dinero</h3>
          <button
            onClick={onClose}
            className="text-white/50 hover:text-white p-1"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/5 overflow-x-auto">
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = tab === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex-1 min-w-0 flex flex-col items-center gap-1 py-3 px-2 text-xs transition-colors ${
                  active
                    ? "text-white border-b-2 border-blue-400"
                    : "text-white/50 hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="truncate">{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Body */}
        <div className="p-4 min-h-[280px]">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-5 h-5 animate-spin text-white/40" />
            </div>
          ) : tab === "cvu" ? (
            <CvuTab cvu={cvu} alias={alias} toast={toast} firstName={firstName} />
          ) : tab === "crypto" ? (
            <CryptoTab />
          ) : tab === "qr" ? (
            <QrTab cvu={cvu} alias={alias} publicLink={publicLink} />
          ) : (
            <LinkTab publicLink={publicLink} toast={toast} />
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Tab: CVU
// ─────────────────────────────────────────────────────────
function CvuTab({ cvu, alias, toast, firstName }: { cvu: string | null; alias: string | null; toast: any; firstName?: string }) {
  if (!cvu) {
    return (
      <div className="flex flex-col items-center text-center py-8">
        <AlertTriangle className="w-10 h-10 text-amber-400 mb-3" />
        <p className="text-sm text-white">Tu cuenta aún no tiene CVU</p>
        <p className="text-xs text-white/50 mt-1">
          Hacé tu primera carga de saldo para activarla.
        </p>
      </div>
    );
  }

  function copy(value: string, label: string) {
    navigator.clipboard.writeText(value).then(() => toast.success(`${label} copiado`));
  }

  return (
    <div className="space-y-3">
      <div className="text-xs text-white/50">
        Compartí estos datos para recibir transferencias en pesos.
      </div>

      <DataField label="Titular" value={firstName ? `${firstName} (Simply)` : "Simply"} />
      <DataField label="CVU" value={cvu} onCopy={() => copy(cvu, "CVU")} mono />
      {alias && <DataField label="Alias" value={alias} onCopy={() => copy(alias, "Alias")} />}
      <DataField label="Banco" value="Simply Wallet" />
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Tab: Cripto (próximamente)
// ─────────────────────────────────────────────────────────
function CryptoTab() {
  return (
    <div className="flex flex-col items-center text-center py-8">
      <Bitcoin className="w-10 h-10 text-amber-400 mb-3" />
      <p className="text-sm text-white">Wallets cripto próximamente</p>
      <p className="text-xs text-white/50 mt-2 max-w-sm">
        Vas a poder recibir USDT, USDC, BTC y ETH directo a tu cuenta Simply.
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Tab: QR
// ─────────────────────────────────────────────────────────
function QrTab({ cvu, alias, publicLink }: { cvu: string | null; alias: string | null; publicLink: string }) {
  // El QR encodea el alias (preferido) o CVU. Si nada, el link público.
  const qrValue = alias || cvu || publicLink;

  if (!qrValue) {
    return (
      <div className="flex flex-col items-center text-center py-8 text-white/50 text-sm">
        Sin datos para generar el QR todavía.
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="bg-white p-4 rounded-2xl">
        <QRCodeSVG value={qrValue} size={180} level="M" />
      </div>
      <p className="text-xs text-white/50 mt-3 text-center">
        Escaneá este código para iniciar una transferencia
      </p>
      {alias && <p className="text-sm text-white mt-1 font-mono">{alias}</p>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Tab: Link
// ─────────────────────────────────────────────────────────
function LinkTab({ publicLink, toast }: { publicLink: string; toast: any }) {
  function copy() {
    navigator.clipboard.writeText(publicLink).then(() => toast.success("Link copiado"));
  }

  async function share() {
    if ((navigator as any).share) {
      try {
        await (navigator as any).share({ url: publicLink, title: "Recibí dinero en Simply" });
      } catch {}
    } else {
      copy();
    }
  }

  return (
    <div className="space-y-3">
      <div className="text-xs text-white/50">
        Tu link personal para recibir pagos rápido:
      </div>
      <div className="flex items-center gap-2 bg-white/5 ring-1 ring-white/10 rounded-lg px-3 py-3">
        <span className="text-sm text-white truncate flex-1 font-mono">{publicLink}</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={copy}
          className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 text-white rounded-lg py-2.5 text-sm transition-colors"
        >
          <Copy className="w-4 h-4" />
          Copiar
        </button>
        <button
          onClick={share}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg py-2.5 text-sm transition-colors"
        >
          <Share2 className="w-4 h-4" />
          Compartir
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────
function DataField({ label, value, onCopy, mono }: { label: string; value: string; onCopy?: () => void; mono?: boolean }) {
  const [copied, setCopied] = useState(false);
  function handleClick() {
    if (!onCopy) return;
    onCopy();
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }
  return (
    <div className="bg-white/5 ring-1 ring-white/10 rounded-lg px-3 py-2.5 flex items-center gap-2">
      <div className="flex-1 min-w-0">
        <div className="text-[10px] uppercase tracking-wide text-white/40">{label}</div>
        <div className={`text-sm text-white truncate ${mono ? "font-mono" : ""}`}>{value}</div>
      </div>
      {onCopy && (
        <button onClick={handleClick} className="text-white/40 hover:text-white shrink-0" title="Copiar">
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
        </button>
      )}
    </div>
  );
}
