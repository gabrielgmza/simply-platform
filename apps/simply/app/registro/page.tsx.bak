"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Mail, ShieldCheck, ArrowLeft } from "lucide-react";
import {
  Button,
  CardElevated,
  FormField,
  Input,
  useSession,
} from "@simply/ui";

type Step = "email" | "otp";

const KYC_STEPS_REMAINING: Record<string, string> = {
  LEAD: "/registro/datos",
  GUEST: "/registro/datos",
  REGISTERED: "/registro/dni",
  VERIFIED_BASIC: "/destinatario",
  VERIFIED_FULL: "/destinatario",
};

export default function RegistroPage() {
  const router = useRouter();
  const { login, session, loaded } = useSession();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);
  const otpInputRef = useRef<HTMLInputElement>(null);

  // Si ya hay sesión activa, redirigir según profileStatus
  useEffect(() => {
    if (!loaded) return;
    if (session?.profileStatus) {
      const next = KYC_STEPS_REMAINING[session.profileStatus] || "/destinatario";
      router.replace(next);
    }
  }, [loaded, session, router]);

  // Auto-focus en input de OTP al cambiar de paso
  useEffect(() => {
    if (step === "otp") {
      setTimeout(() => otpInputRef.current?.focus(), 100);
    }
  }, [step]);

  // Cooldown timer para reenviar OTP
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  async function handleSendOtp(e?: React.FormEvent) {
    e?.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "No pudimos enviar el código");
      setStep("otp");
      setInfo(`Te enviamos un código a ${email}. Revisá tu correo (y la carpeta de spam).`);
      setResendCooldown(60);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp(e?: React.FormEvent) {
    e?.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Código incorrecto");

      const customer = data.customer;
      login({
        customerId: customer.id,
        email: customer.email,
        firstName: customer.firstName,
        lastName: customer.lastName,
        profileStatus: customer.profileStatus,
        accountLevel: customer.accountLevel,
      } as any);

      // Redirigir según el progreso del KYC
      const next = KYC_STEPS_REMAINING[customer.profileStatus] || "/registro/datos";
      router.push(next);
    } catch (e: any) {
      setError(e.message);
      setCode("");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6 animate-page-in">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-accent-500/15 mx-auto flex items-center justify-center">
          {step === "email" ? (
            <Mail className="w-6 h-6 text-accent-400" />
          ) : (
            <ShieldCheck className="w-6 h-6 text-accent-400" />
          )}
        </div>
        <h1 className="text-2xl font-semibold">
          {step === "email" ? "Identificate" : "Verificá tu email"}
        </h1>
        <p className="text-sm text-white/60">
          {step === "email"
            ? "Tu email para empezar el registro."
            : "Ingresá el código de 6 dígitos que te enviamos."}
        </p>
      </div>

      {step === "email" && (
        <form onSubmit={handleSendOtp}>
          <CardElevated className="space-y-4">
            <FormField label="Email">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
                autoFocus
              />
            </FormField>

            {error && (
              <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                {error}
              </div>
            )}

            <Button
              type="submit"
              loading={loading}
              disabled={!email || !email.includes("@")}
              rightIcon={<ArrowRight className="w-5 h-5" />}
            >
              Enviar código
            </Button>

            <p className="text-xs text-white/40 text-center">
              Al continuar aceptás los términos y la política de privacidad.
            </p>
          </CardElevated>
        </form>
      )}

      {step === "otp" && (
        <form onSubmit={handleVerifyOtp}>
          <CardElevated className="space-y-4">
            <FormField label="Código de 6 dígitos">
              <Input
                ref={otpInputRef}
                type="text"
                inputMode="numeric"
                pattern="\d{6}"
                maxLength={6}
                value={code}
                onChange={(e) =>
                  setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                placeholder="000000"
                className="text-center text-2xl tracking-[0.5em] font-mono"
                required
              />
            </FormField>

            {info && !error && (
              <div className="text-sm text-blue-200/90 bg-blue-500/10 border border-blue-500/20 rounded-xl p-3">
                {info}
              </div>
            )}

            {error && (
              <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                {error}
              </div>
            )}

            <Button
              type="submit"
              loading={loading}
              disabled={code.length !== 6}
              rightIcon={<ArrowRight className="w-5 h-5" />}
            >
              Verificar
            </Button>

            <div className="flex items-center justify-between text-sm pt-2">
              <button
                type="button"
                onClick={() => {
                  setStep("email");
                  setCode("");
                  setError(null);
                  setInfo(null);
                }}
                className="text-white/60 hover:text-white inline-flex items-center gap-1 transition"
              >
                <ArrowLeft className="w-4 h-4" />
                Cambiar email
              </button>

              <button
                type="button"
                onClick={() => handleSendOtp()}
                disabled={resendCooldown > 0 || loading}
                className="text-blue-400 hover:text-blue-300 disabled:text-white/30 disabled:cursor-not-allowed transition"
              >
                {resendCooldown > 0
                  ? `Reenviar en ${resendCooldown}s`
                  : "Reenviar código"}
              </button>
            </div>
          </CardElevated>
        </form>
      )}
    </div>
  );
}
