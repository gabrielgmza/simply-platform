"use client";

import { useEffect, useState } from "react";
import { X, Mail, ShieldCheck, Loader2, AlertCircle, ArrowRight } from "lucide-react";
import { useToast } from "@/components/toast/Toast";
import { requestEmailChange, confirmEmailChange } from "@/lib/email-change-api";

interface Props {
  customerId: string;
  currentEmail: string;
  open: boolean;
  onClose: () => void;
  onSuccess: (newEmail: string) => void;
}

type Step = "email" | "verify";

export default function EmailChangeModal({ customerId, currentEmail, open, onClose, onSuccess }: Props) {
  const [step, setStep] = useState<Step>("email");
  const [newEmail, setNewEmail] = useState("");
  const [emailOtp, setEmailOtp] = useState("");
  const [totpCode, setTotpCode] = useState("");
  const [requiresTotp, setRequiresTotp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  useEffect(() => {
    if (open) {
      setStep("email");
      setNewEmail("");
      setEmailOtp("");
      setTotpCode("");
      setRequiresTotp(false);
      setError(null);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  async function handleRequest() {
    setError(null);
    if (!newEmail || !newEmail.includes("@")) {
      setError("Email inválido");
      return;
    }
    if (newEmail.toLowerCase() === currentEmail.toLowerCase()) {
      setError("Ese ya es tu email actual");
      return;
    }
    setLoading(true);
    try {
      const res = await requestEmailChange(customerId, newEmail);
      setRequiresTotp(res.requiresTotp);
      setStep("verify");
      toast.success("Código enviado al nuevo email");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleConfirm() {
    setError(null);
    if (!emailOtp || emailOtp.length < 4) {
      setError("Ingresá el código del email");
      return;
    }
    if (requiresTotp && !totpCode) {
      setError("Ingresá el código TOTP");
      return;
    }
    setLoading(true);
    try {
      const res = await confirmEmailChange(customerId, emailOtp, requiresTotp ? totpCode : undefined);
      toast.success("Email actualizado");
      onSuccess(res.newEmail);
      onClose();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
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
        <div className="flex items-center justify-between p-4 border-b border-white/5">
          <h3 className="text-base font-semibold text-white">Cambiar email</h3>
          <button onClick={onClose} className="text-white/50 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-3">
          {step === "email" ? (
            <>
              <div className="flex items-start gap-2 text-xs text-white/60 bg-white/5 ring-1 ring-white/10 rounded-lg p-3">
                <Mail className="w-4 h-4 text-blue-300 mt-0.5 shrink-0" />
                <div>
                  Tu email actual: <span className="text-white">{currentEmail}</span>
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-wide text-white/40">Nuevo email</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="nuevo@email.com"
                  className="w-full mt-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
                  autoFocus
                />
              </div>

              {error && (
                <div className="flex items-start gap-2 text-xs text-red-400 bg-red-500/10 ring-1 ring-red-500/30 rounded-lg p-2.5">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                onClick={handleRequest}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-white/10 text-white rounded-lg py-2.5 text-sm font-medium flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                  <>
                    Enviar código
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </>
          ) : (
            <>
              <div className="text-xs text-white/60">
                Te enviamos un código a <span className="text-white">{newEmail}</span>. Ingresalo abajo.
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-wide text-white/40">Código del email</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={emailOtp}
                  onChange={(e) => setEmailOtp(e.target.value.replace(/\D/g, ""))}
                  placeholder="------"
                  maxLength={6}
                  className="w-full mt-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm font-mono text-center text-lg tracking-widest"
                  autoFocus
                />
              </div>

              {requiresTotp && (
                <div>
                  <label className="text-[10px] uppercase tracking-wide text-white/40 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Código de tu autenticador (TOTP)
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={totpCode}
                    onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ""))}
                    placeholder="------"
                    maxLength={6}
                    className="w-full mt-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm font-mono text-center text-lg tracking-widest"
                  />
                </div>
              )}

              {error && (
                <div className="flex items-start gap-2 text-xs text-red-400 bg-red-500/10 ring-1 ring-red-500/30 rounded-lg p-2.5">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                onClick={handleConfirm}
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-white/10 text-white rounded-lg py-2.5 text-sm font-medium flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirmar cambio"}
              </button>

              <button
                onClick={() => setStep("email")}
                className="w-full text-xs text-white/40 hover:text-white"
              >
                ← Cambiar el email
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
