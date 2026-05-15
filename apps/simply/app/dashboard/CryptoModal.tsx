"use client";

import { useEffect, useState } from "react";
import { X, Loader2, AlertCircle, ExternalLink } from "lucide-react";
import { getShortLivedToken } from "@/lib/customer-token-api";

const CRYPTO_URL = "/crypto";

interface Props {
  customerId: string;
  open: boolean;
  onClose: () => void;
}

export default function CryptoModal({ customerId, open, onClose }: Props) {
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    setError(null);
    setToken(null);
    getShortLivedToken(customerId)
      .then((res) => setToken(res.token))
      .catch((e: any) => setError(e.message || "Error obteniendo token"))
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

  const iframeUrl = token ? `${CRYPTO_URL}/?token=${encodeURIComponent(token)}` : null;

  return (
    <div
      className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-stretch sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-2xl bg-zinc-900 sm:rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col h-full sm:h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-white/5 shrink-0">
          <h3 className="text-base font-semibold text-white">Operar con cripto</h3>
          <div className="flex items-center gap-1">
            {iframeUrl && (
              <a
                href={iframeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/40 hover:text-white p-1.5 rounded"
                title="Abrir en pestaña nueva"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
            <button
              onClick={onClose}
              className="text-white/50 hover:text-white p-1.5"
              aria-label="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 min-h-0 bg-black">
          {loading ? (
            <div className="h-full flex items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-white/40" />
            </div>
          ) : error ? (
            <div className="h-full flex items-center justify-center p-6">
              <div className="text-center max-w-sm">
                <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
                <p className="text-sm text-white">No pudimos abrir el módulo cripto</p>
                <p className="text-xs text-white/50 mt-1">{error}</p>
              </div>
            </div>
          ) : iframeUrl ? (
            <iframe
              src={iframeUrl}
              className="w-full h-full border-0"
              allow="clipboard-write; camera"
              title="Simply Cripto"
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
