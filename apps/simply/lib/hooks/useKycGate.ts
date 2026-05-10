"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@simply/ui";

const VERIFIED_STATUSES = ["VERIFIED_BASIC", "VERIFIED_FULL"];

const NEXT_STEP_BY_STATUS: Record<string, string> = {
  // Sin sesión o LEAD → registro desde cero
  LEAD: "/registro",
  // GUEST: tiene email pero faltan datos personales
  GUEST: "/registro/datos",
  // REGISTERED: completó datos pero falta DNI
  REGISTERED: "/registro/dni",
};

/**
 * Guard que protege rutas que requieren KYC completo (VERIFIED_BASIC o más).
 * - Sin sesión → /registro
 * - Sesión pero KYC incompleto → al paso del wizard que corresponda
 * - Sesión + verificado → renderiza la página
 *
 * Refresca el profileStatus desde el backend al montar (por si el cliente
 * verificó en otro tab o el localStorage está desactualizado).
 */
export function useKycGate() {
  const router = useRouter();
  const { session, loaded, update } = useSession();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!loaded) return;

    // Sin sesión: redirigir a registro
    if (!session) {
      router.replace("/registro");
      return;
    }

    const customerId = (session as any).customerId;
    if (!customerId) {
      router.replace("/registro");
      return;
    }

    // Refrescar status desde backend (el localStorage puede estar viejo)
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch(`/api/auth/customer-status?id=${customerId}`, {
          cache: "no-store",
        });
        if (!res.ok) {
          // Si falla, fallback al status del localStorage
          checkStatusAndRoute((session as any).profileStatus);
          return;
        }
        const data = await res.json();
        if (cancelled) return;

        // Sincronizar status en localStorage
        update({ profileStatus: data.profileStatus } as any);

        checkStatusAndRoute(data.profileStatus);
      } catch {
        // Error de red: usar lo que hay en localStorage
        checkStatusAndRoute((session as any).profileStatus);
      }
    })();

    function checkStatusAndRoute(status?: string) {
      if (cancelled) return;
      if (status && VERIFIED_STATUSES.includes(status)) {
        // OK: dejar pasar
        setChecking(false);
        return;
      }
      // No verificado: redirigir al paso faltante
      const next = NEXT_STEP_BY_STATUS[status || "LEAD"] || "/registro";
      router.replace(next);
    }

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded, session?.customerId, router]);

  return { ready: !checking, session };
}
