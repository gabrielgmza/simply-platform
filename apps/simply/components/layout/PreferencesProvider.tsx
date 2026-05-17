"use client";

import { useRouter } from "next/navigation";
import { useSession, clearSession } from "@simply/ui";
import { usePreferences } from "@/lib/use-preferences";
import { useSessionTimeout } from "@/lib/use-session-timeout";

/**
 * Carga preferencias del cliente, las aplica al DOM,
 * y arma el timer de cierre por inactividad.
 */
export default function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { session } = useSession();
  const { prefs } = usePreferences(session?.customerId);

  useSessionTimeout(prefs?.sessionTimeoutMinutes, () => {
    clearSession();
    router.push("/?reason=inactivity");
  });

  return <>{children}</>;
}
