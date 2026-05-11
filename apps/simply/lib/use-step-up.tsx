"use client";

import { useState, useCallback } from "react";
import StepUpModal from "@/components/StepUpModal";

interface StepUpRequest {
  operationType: string;
  operationLabel: string;
  amountUsd?: number;
}

interface PendingState extends StepUpRequest {
  resolve: (ok: boolean) => void;
}

/**
 * Hook para step-up auth en operaciones sensibles.
 *
 * Uso:
 *   const { request, modal } = useStepUp(customerId, email);
 *
 *   async function handleSensitiveAction() {
 *     const ok = await request({
 *       operationType: "revoke_device",
 *       operationLabel: "Revocar dispositivo",
 *     });
 *     if (!ok) return;
 *     // ejecutar la acción real
 *   }
 *
 *   return <>{...}{modal()}</>;
 */
export function useStepUp(customerId: string, email: string) {
  const [pending, setPending] = useState<PendingState | null>(null);

  const request = useCallback(
    async (req: StepUpRequest): Promise<boolean> => {
      try {
        // 1. ¿Backend dice que necesita step-up?
        const checkRes = await fetch("/api/customer-auth/needs-step-up", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customerId,
            amountUsd: req.amountUsd ?? 0,
            operationType: req.operationType,
          }),
        });
        const checkData = await checkRes.json();
        if (!checkRes.ok) {
          console.error("needs-step-up failed", checkData);
          // Por seguridad, si el check falla, pedir step-up igual
        }
        if (!checkData.needsStepUp) {
          return true; // no requiere OTP
        }

        // 2. Disparar envío de OTP
        const otpRes = await fetch("/api/auth/send-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        if (!otpRes.ok) {
          const err = await otpRes.json().catch(() => ({}));
          throw new Error(err.message || "No pudimos enviar el código");
        }

        // 3. Abrir modal y esperar resolución
        return await new Promise<boolean>((resolve) => {
          setPending({ ...req, resolve });
        });
      } catch (e) {
        console.error("step-up request failed", e);
        return false;
      }
    },
    [customerId, email],
  );

  async function handleVerify(code: string) {
    const res = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Código incorrecto");
    }
    // OK
    pending?.resolve(true);
    setPending(null);
  }

  async function handleResend() {
    const res = await fetch("/api/auth/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Error reenviando");
    }
  }

  function handleCancel() {
    pending?.resolve(false);
    setPending(null);
  }

  function modal() {
    if (!pending) return null;
    return (
      <StepUpModal
        email={email}
        operationLabel={pending.operationLabel}
        onVerify={handleVerify}
        onCancel={handleCancel}
        onResend={handleResend}
      />
    );
  }

  return { request, modal };
}
