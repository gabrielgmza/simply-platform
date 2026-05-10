"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import {
  AssetMeta,
  FIAT_ASSETS,
  CRYPTO_ASSETS,
  assetId,
} from "@/lib/assets";

interface Props {
  value: AssetMeta;
  onChange: (a: AssetMeta) => void;
  /** Cuáles ocultar (ej: el ya seleccionado en el otro lado) */
  excludeId?: string;
  /** Opcional: filtrar solo fiat o solo crypto */
  filter?: "all" | "fiat" | "crypto";
  className?: string;
}

export default function AssetSelector({
  value,
  onChange,
  excludeId,
  filter = "all",
  className = "",
}: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const wrapRef = useRef<HTMLDivElement>(null);

  // Cerrar al click afuera
  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const fiats = FIAT_ASSETS.filter((a) => assetId(a) !== excludeId);
  const cryptos = CRYPTO_ASSETS.filter((a) => assetId(a) !== excludeId);

  function matches(a: AssetMeta, q: string): boolean {
    if (!q) return true;
    const lower = q.toLowerCase();
    if (a.kind === "fiat") {
      return (
        a.currency.toLowerCase().includes(lower) ||
        a.country.toLowerCase().includes(lower) ||
        a.name.toLowerCase().includes(lower)
      );
    }
    return (
      a.symbol.toLowerCase().includes(lower) ||
      a.network.toLowerCase().includes(lower) ||
      a.name.toLowerCase().includes(lower) ||
      a.networkLabel.toLowerCase().includes(lower)
    );
  }

  const showFiat = filter === "all" || filter === "fiat";
  const showCrypto = filter === "all" || filter === "crypto";

  const fiatsFiltered = fiats.filter((a) => matches(a, search));
  const cryptosFiltered = cryptos.filter((a) => matches(a, search));

  return (
    <div ref={wrapRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-left flex items-center justify-between gap-2 hover:border-zinc-600 transition"
      >
        <span className="flex items-center gap-2 truncate">
          <AssetIcon a={value} />
          <span className="truncate">
            <AssetLabel a={value} />
          </span>
        </span>
        <ChevronDown className={`w-4 h-4 text-zinc-500 transition ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute left-0 right-0 mt-2 z-50 max-h-96 overflow-hidden rounded-2xl bg-zinc-950 border border-zinc-800 shadow-2xl flex flex-col">
          <div className="p-2 border-b border-zinc-900 sticky top-0 bg-zinc-950">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar moneda o cripto"
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-blue-500"
                autoFocus
              />
            </div>
          </div>

          <div className="overflow-y-auto flex-1 max-h-80">
            {showFiat && fiatsFiltered.length > 0 && (
              <>
                <div className="px-3 pt-3 pb-1 text-[10px] uppercase tracking-wider text-zinc-500 font-medium">
                  Monedas
                </div>
                {fiatsFiltered.map((a) => (
                  <AssetRow
                    key={assetId(a)}
                    asset={a}
                    selected={assetId(a) === assetId(value)}
                    onPick={() => {
                      onChange(a);
                      setOpen(false);
                      setSearch("");
                    }}
                  />
                ))}
              </>
            )}
            {showCrypto && cryptosFiltered.length > 0 && (
              <>
                <div className="px-3 pt-3 pb-1 text-[10px] uppercase tracking-wider text-zinc-500 font-medium">
                  Cripto
                </div>
                {cryptosFiltered.map((a) => (
                  <AssetRow
                    key={assetId(a)}
                    asset={a}
                    selected={assetId(a) === assetId(value)}
                    onPick={() => {
                      onChange(a);
                      setOpen(false);
                      setSearch("");
                    }}
                  />
                ))}
              </>
            )}
            {fiatsFiltered.length === 0 && cryptosFiltered.length === 0 && (
              <div className="text-center py-8 text-sm text-zinc-500">
                Sin resultados
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function AssetIcon({ a }: { a: AssetMeta }) {
  if (a.kind === "fiat") {
    return <span className="text-base leading-none">{a.flag}</span>;
  }
  // Crypto: badge circular con símbolo
  return (
    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-600/20 border border-blue-500/30 text-[10px] font-bold text-blue-300">
      {a.symbol.slice(0, 3)}
    </span>
  );
}

function AssetLabel({ a }: { a: AssetMeta }) {
  if (a.kind === "fiat") {
    return (
      <span className="text-sm text-white">
        {a.currency} <span className="text-zinc-500">· {a.name}</span>
      </span>
    );
  }
  return (
    <span className="text-sm text-white">
      {a.symbol} <span className="text-zinc-500">· {a.networkLabel}</span>
    </span>
  );
}

function AssetRow({
  asset,
  selected,
  onPick,
}: {
  asset: AssetMeta;
  selected: boolean;
  onPick: () => void;
}) {
  const disabled = !asset.enabled;
  return (
    <button
      type="button"
      onClick={disabled ? undefined : onPick}
      disabled={disabled}
      className={`w-full text-left px-3 py-2.5 flex items-center gap-3 transition ${
        disabled
          ? "opacity-40 cursor-not-allowed"
          : selected
          ? "bg-blue-600/15"
          : "hover:bg-white/5"
      }`}
    >
      <AssetIcon a={asset} />
      <div className="flex-1 min-w-0">
        {asset.kind === "fiat" ? (
          <>
            <div className="text-sm text-white">
              {asset.currency} {asset.flag}
            </div>
            <div className="text-xs text-zinc-500">{asset.name}</div>
          </>
        ) : (
          <>
            <div className="text-sm text-white">
              {asset.symbol}
              <span className="text-zinc-500"> · {asset.networkLabel}</span>
            </div>
            <div className="text-xs text-zinc-500">
              {asset.feeHint} · {asset.speed === "fast" ? "Rápido" : asset.speed === "slow" ? "Lento" : "Medio"}
            </div>
          </>
        )}
      </div>
      {disabled && (
        <span className="text-[10px] text-zinc-600 uppercase tracking-wider">
          Pronto
        </span>
      )}
    </button>
  );
}
