"use client";

import { useEffect, useRef, useState } from "react";
import { ShieldAlert, X, Loader2 } from "lucide-react";
import { Button } from "@simply/ui";

interface StepUpModalProps {
  email: string;
  operationLabel: string; // ej: "Revocar dispositivo"
  method: "totp" | "email_otp";
  onVerify: (code: string) => Promise<void>; // throw si el código es inválido
  onCancel: () => void;
  onResend: () => Promise<void>;
}

export default function StepUpModal({
  email,
  operationLabel,
  method,
  onVerify,
  onCancel,
  onResend,
}: StepUpModalProps) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(60);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  async function handleSubmit() {
    const minLen = method === "totp" ? 6 : 6;
    const valid = method === "totp"
      ? (/^\d{6}$/.test(code) || /^[A-Z0-9]{4}-?[A-Z0-9]{4}-?[A-Z0-9]{4}$/.test(code))
      : /^\d{6}$/.test(code);
    if (!valid) {
      setError(
        method === "totp"
          ? "Ingresá un código de 6 dígitos o un código de respaldo"
          : "Ingresá el código de 6 dígitos",
      );
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await onVerify(code);
      // El padre cierra el modal
    } catch (e: any) {
      setError(e.message || "Código incorrecto");
      setLoading(false);
    }
  }

  async function handleResend() {
    try {
      await onResend();
      setResendCooldown(60);
      setError(null);
    } catch (e: any) {
      setError(e.message || "Error reenviando");
    }
  }

  // Email enmascarado: t***@simply.local
  const masked = email.replace(/^(.)(.*)(@.*)$/, (_, a, b, c) => a + "*".repeat(b.length) + c);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-zinc-900 border border-white/10 rounded-2xl max-w-md w-full p-6 space-y-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2 text-amber-400">
            <ShieldAlert className="w-5 h-5" />
            <h3 className="font-semibold">Confirmar identidad</h3>
          </div>
          <button onClick={onCancel} className="text-white/60 hover:text-white" disabled={loading}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-white/80">
            Para continuar con <span className="font-medium text-white">{operationLabel}</span>,
            {method === "totp"
              ? " ingresá el código de tu app autenticadora (o un código de respaldo)."
              : " ingresá el código que enviamos a:"}
          </p>
          {method === "email_otp" && (
            <p className="text-sm text-white/60">{masked}</p>
          )}
        </div>

        <div>
          <input
            ref={inputRef}
            type="text"
            inputMode={method === "totp" ? "text" : "numeric"}
            maxLength={method === "totp" ? 14 : 6}
            value={code}
            onChange={(e) => {
              if (method === "totp") {
                // Aceptar dígitos o backup code (alfanum + guiones)
                setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, "").slice(0, 14));
              } else {
                setCode(e.target.value.replace(/\D/g, "").slice(0, 6));
              }
              setError(null);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSubmit();
            }}
            placeholder={method === "totp" ? "123456" : "123456"}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-center text-2xl tracking-widest font-mono"
            disabled={loading}
          />
        </div>

        {error && (
          <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg p-3">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-2">
          <Button onClick={handleSubmit} disabled={loading || code.length !== 6} className="w-full">
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2 inline" />
                Verificando...
              </>
            ) : (
              "Confirmar"
            )}
          </Button>

          {method === "email_otp" && (
            <button
              onClick={handleResend}
              disabled={resendCooldown > 0 || loading}
              className="text-sm text-white/60 hover:text-white disabled:text-white/30 disabled:cursor-not-allowed py-2"
            >
              {resendCooldown > 0
                ? `Reenviar código en ${resendCooldown}s`
                : "Reenviar código"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
