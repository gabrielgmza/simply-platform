"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Mail, Lock, ShieldCheck, ArrowLeft } from "lucide-react";
import {
  Button,
  CardElevated,
  FormField,
  Input,
  useSession,
} from "@simply/ui";
import PasswordInput from "@/components/PasswordInput";

type Step = "credentials" | "otp";

const TRUST_COOKIE_KEY = "simply_trust_token";
const REDIRECT_AFTER_LOGIN: Record<string, string> = {
  LEAD: "/registro/datos",
  GUEST: "/registro/datos",
  REGISTERED: "/registro/dni",
  VERIFIED_BASIC: "/dashboard",
  VERIFIED_FULL: "/dashboard",
};

function getTrustToken(): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.match(/(?:^|;\s*)simply_trust_token=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : undefined;
}

function saveTrustToken(token: string, expiresAt: string) {
  if (typeof document === "undefined") return;
  const expires = new Date(expiresAt).toUTCString();
  document.cookie = `simply_trust_token=${encodeURIComponent(token)}; path=/; expires=${expires}; SameSite=Lax`;
}

export default function LoginPage() {
  const router = useRouter();
  const { login, session, loaded } = useSession();
  const [step, setStep] = useState<Step>("credentials");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [rememberDevice, setRememberDevice] = useState(true);
  const [verifiedCustomer, setVerifiedCustomer] = useState<any>(null);
  const [twoFactorMethod, setTwoFactorMethod] = useState<"totp" | "email_otp">("email_otp");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);
  const otpInputRef = useRef<HTMLInputElement>(null);

  // Si ya hay sesión, redirigir
  useEffect(() => {
    if (!loaded) return;
    if (session?.profileStatus) {
      const next = REDIRECT_AFTER_LOGIN[session.profileStatus] || "/";
      router.replace(next);
    }
  }, [loaded, session, router]);

  useEffect(() => {
    if (step === "otp") {
      setTimeout(() => otpInputRef.current?.focus(), 100);
    }
  }, [step]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);
    try {
      const trustToken = getTrustToken();
      const res = await fetch("/api/customer-auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
          trustToken,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(
          Array.isArray(data.message) ? data.message.join(", ") : (data.message || "Credenciales inválidas"),
        );
      }

      const customer = data.customer;
      setVerifiedCustomer(customer);

      // Caso 1: trust device válido → login directo
      if (data.trustedDevice && !data.requires2FA) {
        login({
          customerId: customer.id,
          email: customer.email,
          firstName: customer.firstName,
          lastName: customer.lastName,
          profileStatus: customer.profileStatus,
          accountLevel: customer.accountLevel,
        } as any);
        const next = REDIRECT_AFTER_LOGIN[customer.profileStatus] || "/";
        router.push(next);
        return;
      }

      // Caso 2: pedir 2do factor (TOTP o email OTP)
      const method: "totp" | "email_otp" = data.twoFactorMethod || "email_otp";
      setTwoFactorMethod(method);

      if (method === "email_otp") {
        // Disparar envío de OTP por email
        const otpRes = await fetch("/api/auth/send-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email.trim().toLowerCase() }),
        });
        if (!otpRes.ok) {
          const otpErr = await otpRes.json();
          throw new Error(otpErr.message || "No pudimos enviar el código");
        }
        setInfo(`Te enviamos un código a ${email} para confirmar tu identidad.`);
        setResendCooldown(60);
      } else {
        // TOTP: no enviamos nada, el usuario lee el código de su app
        setInfo("Ingresá el código de 6 dígitos de tu app autenticadora (o un código de respaldo).");
      }

      setStep("otp");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify2fa(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!verifiedCustomer) return;
    setLoading(true);
    try {
      // 1. Verificar 2do factor (TOTP o email OTP)
      if (twoFactorMethod === "totp") {
        const totpRes = await fetch("/api/customer-auth/totp/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customerId: verifiedCustomer.id,
            code: code.trim(),
          }),
        });
        const totpData = await totpRes.json();
        if (!totpRes.ok) {
          throw new Error(totpData.message || "Código incorrecto");
        }
      } else {
        const otpRes = await fetch("/api/auth/verify-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email.trim().toLowerCase(), code }),
        });
        const otpData = await otpRes.json();
        if (!otpRes.ok) {
          throw new Error(otpData.message || "Código incorrecto");
        }
      }

      // 2. Completar login y obtener trust token si rememberDevice
      const compRes = await fetch("/api/customer-auth/complete-2fa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          code, // el backend no lo revalida, ya pasamos arriba
          rememberDevice,
          userAgent: navigator.userAgent,
        }),
      });
      const compData = await compRes.json();
      if (!compRes.ok) {
        throw new Error(compData.message || "Error completando el login");
      }

      // 3. Guardar trust token como cookie
      if (compData.newTrustToken && compData.expiresAt) {
        saveTrustToken(compData.newTrustToken, compData.expiresAt);
      }

      // 4. Login en frontend
      const customer = compData.customer;
      login({
        customerId: customer.id,
        email: customer.email,
        firstName: customer.firstName,
        lastName: customer.lastName,
        profileStatus: customer.profileStatus,
        accountLevel: customer.accountLevel,
      } as any);

      const next = REDIRECT_AFTER_LOGIN[customer.profileStatus] || "/";
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
        <div className="w-12 h-12 rounded-2xl bg-blue-500/15 mx-auto flex items-center justify-center">
          {step === "credentials" ? (
            <Lock className="w-6 h-6 text-blue-300" />
          ) : (
            <ShieldCheck className="w-6 h-6 text-blue-300" />
          )}
        </div>
        <h1 className="text-2xl font-semibold">
          {step === "credentials" ? "Ingresá a tu cuenta" : "Verificá tu identidad"}
        </h1>
        <p className="text-sm text-white/60">
          {step === "credentials"
            ? "Email y contraseña."
            : "Ingresá el código de 6 dígitos que te enviamos."}
        </p>
      </div>

      {step === "credentials" && (
        <form onSubmit={handleLogin}>
          <CardElevated className="space-y-4">
            <FormField label="Email">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
                autoFocus
                autoComplete="email"
              />
            </FormField>

            <PasswordInput
              label="Password"
              value={password}
              onChange={setPassword}
              placeholder="Tu contraseña"
              showRules={false}
            />

            {error && (
              <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                {error}
              </div>
            )}

            <Button
              type="submit"
              loading={loading}
              disabled={!email || !password}
              rightIcon={<ArrowRight className="w-5 h-5" />}
            >
              Ingresar
            </Button>

            <div className="flex justify-between text-xs text-white/50 pt-1">
              <a href="/registro" className="hover:text-white transition">
                Crear cuenta nueva
              </a>
              <a href="/registro" className="hover:text-white transition">
                Olvidé mi password
              </a>
            </div>
          </CardElevated>
        </form>
      )}

      {step === "otp" && (
        <form onSubmit={handleVerify2fa}>
          <CardElevated className="space-y-4">
            <FormField label="Código de 6 dígitos">
              <Input
                ref={otpInputRef}
                type="text"
                inputMode="numeric"
                pattern="\d{6}"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="000000"
                className="text-center text-2xl tracking-[0.5em] font-mono"
                required
              />
            </FormField>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberDevice}
                onChange={(e) => setRememberDevice(e.target.checked)}
                className="w-4 h-4 rounded accent-blue-500"
              />
              <span className="text-xs text-white/80">
                Recordar este dispositivo por 30 días
              </span>
            </label>

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
              Verificar y entrar
            </Button>

            <div className="flex items-center justify-between text-sm pt-2">
              <button
                type="button"
                onClick={() => {
                  setStep("credentials");
                  setCode("");
                  setError(null);
                  setInfo(null);
                }}
                className="text-white/60 hover:text-white inline-flex items-center gap-1 transition"
              >
                <ArrowLeft className="w-4 h-4" />
                Volver
              </button>

              <button
                type="button"
                onClick={() => {
                  void fetch("/api/auth/send-otp", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: email.trim().toLowerCase() }),
                  });
                  setResendCooldown(60);
                  setInfo(`Te enviamos un nuevo código.`);
                }}
                disabled={resendCooldown > 0 || loading}
                className="text-blue-400 hover:text-blue-300 disabled:text-white/30 disabled:cursor-not-allowed transition"
              >
                {resendCooldown > 0 ? `Reenviar en ${resendCooldown}s` : "Reenviar"}
              </button>
            </div>
          </CardElevated>
        </form>
      )}
    </div>
  );
}
