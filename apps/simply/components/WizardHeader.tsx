"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { X } from "lucide-react";

const LANDING_URL = "https://gosimply.xyz";

interface Props {
  /** Si true, muestra botón "Salir" que vuelve a la home */
  allowExit?: boolean;
}

export default function WizardHeader({ allowExit = true }: Props) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);

  function handleExit() {
    if (!confirming) {
      setConfirming(true);
      setTimeout(() => setConfirming(false), 3000);
      return;
    }
    router.push("/");
  }

  return (
    <header className="fixed top-0 inset-x-0 z-50 px-4 pt-4 pointer-events-none">
      <div className="pointer-events-auto max-w-md mx-auto px-4 sm:px-5 py-3 flex items-center justify-between gap-4 rounded-[1.4rem] border border-white/[0.08] bg-black/65 backdrop-blur-2xl shadow-[0_18px_60px_rgba(0,0,0,0.45)]">
        {/* Logo más chico */}
        <a href={LANDING_URL} className="shrink-0 flex items-center" aria-label="Simply">
          <img
            src="/assets/logo-simply.webp"
            alt="Simply"
            className="h-8 w-auto"
            draggable={false}
          />
        </a>

        {/* Indicador "Verificación" centrado */}
        <span className="text-xs font-medium text-zinc-400 tracking-wider uppercase">
          Verificación
        </span>

        {/* Salir */}
        {allowExit ? (
          <button
            onClick={handleExit}
            className={[
              "shrink-0 w-9 h-9 rounded-xl border flex items-center justify-center transition-all",
              confirming
                ? "border-red-500/40 bg-red-500/10 text-red-300"
                : "border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:border-zinc-700",
            ].join(" ")}
            aria-label={confirming ? "Click otra vez para confirmar" : "Salir"}
            title={confirming ? "Click otra vez para confirmar" : "Salir"}
          >
            <X className="w-4 h-4" />
          </button>
        ) : (
          <div className="w-9 h-9" />
        )}
      </div>
    </header>
  );
}
