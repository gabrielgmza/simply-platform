"use client";

import { Smile } from "lucide-react";
import { CardElevated, useSession } from "@simply/ui";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RegistroSelfiePage() {
  const router = useRouter();
  const { session, loaded } = useSession();

  useEffect(() => {
    if (loaded && !session) router.replace("/registro");
  }, [loaded, session, router]);

  return (
    <div className="space-y-6 animate-page-in">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-accent-500/15 mx-auto flex items-center justify-center">
          <Smile className="w-6 h-6 text-accent-400" />
        </div>
        <h1 className="text-2xl font-semibold">Verificación de identidad</h1>
        <p className="text-sm text-white/60">
          Una selfie con desafíos de prueba de vida.
        </p>
      </div>

      <CardElevated>
        <div className="text-center py-8 space-y-3">
          <p className="text-amber-300/90 text-sm">
            🚧 Esta etapa estará disponible pronto.
          </p>
          <p className="text-white/50 text-xs">
            Sprint 4 — Selfie + liveness check
          </p>
        </div>
      </CardElevated>
    </div>
  );
}
