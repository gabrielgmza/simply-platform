"use client";

import { useState } from "react";
import { X, Copy, Download, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@simply/ui";
import type { TotpSetupResult } from "@/lib/customer-auth-api";

type Step = "qr" | "backup";

export default function TotpSetupModal({
  data,
  onConfirm,
  onClose,
}: {
  data: TotpSetupResult;
  onConfirm: (code: string) => Promise<string[]>;
  onClose: () => void;
}) {
  const [step, setStep] = useState<Step>("qr");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [acknowledged, setAcknowledged] = useState(false);

  async function handleConfirm() {
    if (code.length !== 6) {
      setError("Ingresá el código de 6 dígitos");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const codes = await onConfirm(code);
      setBackupCodes(codes);
      setStep("backup");
    } catch (e: any) {
      setError(e.message || "Código incorrecto");
    } finally {
      setLoading(false);
    }
  }

  function downloadCodes() {
    const text =
      "Simply — Códigos de respaldo del autenticador\n" +
      "==============================================\n\n" +
      "Guardá estos códigos en un lugar seguro. Cada uno se puede usar UNA SOLA VEZ\n" +
      "si perdés acceso a tu app autenticadora.\n\n" +
      backupCodes.join("\n") +
      "\n\nGenerados: " +
      new Date().toLocaleString("es-AR");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "simply-backup-codes.txt";
    a.click();
    URL.revokeObjectURL(url);
  }

  function copyCodes() {
    navigator.clipboard.writeText(backupCodes.join("\n"));
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-zinc-900 border border-white/10 rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6 space-y-5">
        <div className="flex items-start justify-between">
          <h3 className="font-semibold text-white">
            {step === "qr" ? "Configurar autenticador" : "Guardá tus códigos de respaldo"}
          </h3>
          {step === "qr" && (
            <button onClick={onClose} className="text-white/60 hover:text-white" disabled={loading}>
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {step === "qr" && (
          <>
            <p className="text-sm text-white/70">
              1. Abrí Google Authenticator, Authy o 1Password.
              <br />
              2. Escaneá este código QR:
            </p>

            <div className="flex justify-center bg-white p-3 rounded-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={data.qrDataUrl} alt="QR" className="w-48 h-48" />
            </div>

            <details className="text-xs text-white/60">
              <summary className="cursor-pointer">¿No podés escanear? Ingresá manualmente</summary>
              <div className="mt-2 bg-white/5 p-2 rounded font-mono text-white break-all">
                {data.secretBase32}
              </div>
            </details>

            <div>
              <label className="text-sm text-white">3. Ingresá el código de 6 dígitos:</label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.replace(/\D/g, "").slice(0, 6));
                  setError(null);
                }}
                placeholder="123456"
                className="mt-2 w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-center text-2xl tracking-widest font-mono"
                disabled={loading}
                autoFocus
              />
            </div>

            {error && (
              <div className="flex items-start gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Button
              onClick={handleConfirm}
              disabled={loading || code.length !== 6}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2 inline" />
                  Verificando...
                </>
              ) : (
                "Confirmar y activar"
              )}
            </Button>
          </>
        )}

        {step === "backup" && (
          <>
            <div className="text-sm text-amber-400 bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
              <strong>Importante:</strong> Estos códigos solo se muestran una vez. Guardalos
              ahora en un lugar seguro. Cada uno funciona una sola vez.
            </div>

            <div className="bg-white/5 border border-white/10 rounded-lg p-4 font-mono text-sm text-white grid grid-cols-2 gap-2">
              {backupCodes.map((c, i) => (
                <div key={i} className="select-all">
                  {c}
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <button
                onClick={copyCodes}
                className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg py-2 text-sm text-white"
              >
                <Copy className="w-4 h-4" />
                Copiar
              </button>
              <button
                onClick={downloadCodes}
                className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg py-2 text-sm text-white"
              >
                <Download className="w-4 h-4" />
                Descargar
              </button>
            </div>

            <label className="flex items-start gap-2 cursor-pointer text-sm text-white/80">
              <input
                type="checkbox"
                checked={acknowledged}
                onChange={(e) => setAcknowledged(e.target.checked)}
                className="mt-0.5 accent-emerald-500"
              />
              <span>Guardé los códigos en un lugar seguro</span>
            </label>

            <Button onClick={onClose} disabled={!acknowledged} className="w-full">
              Listo
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
