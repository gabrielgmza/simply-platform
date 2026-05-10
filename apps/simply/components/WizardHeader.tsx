"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, X } from "lucide-react";

const LANDING_URL = "https://gosimply.xyz";

interface Props {
  /** Si se provee, muestra botón "atrás" que vuelve a esa ruta */
  backTo?: string;
  /** Si true, muestra botón "Salir" con confirmación */
  allowExit?: boolean;
}

export default function WizardHeader({ backTo, allowExit = true }: Props) {
  const router = useRouter();
  const [confirmExit, setConfirmExit] = useState(false);

  function handleExit() {
    setConfirmExit(true);
  }

  function confirmAndExit() {
    // Limpiar sessionStorage temporal del wizard
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("simply_pending_quote");
      sessionStorage.removeItem("simply_destination_endpoint");
    }
    router.push("/");
  }

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50 px-4 pt-4 pointer-events-none">
        <div className="pointer-events-auto max-w-md mx-auto px-3 sm:px-4 py-3 flex items-center justify-between gap-3 rounded-[1.4rem] border border-white/[0.08] bg-black/65 backdrop-blur-2xl shadow-[0_18px_60px_rgba(0,0,0,0.45)]">
          {/* Botón atrás (si aplica) */}
          {backTo ? (
            <button
              onClick={() => router.push(backTo)}
              className="shrink-0 w-9 h-9 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 flex items-center justify-center transition"
              aria-label="Volver"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          ) : (
            <a href={LANDING_URL} className="shrink-0 flex items-center" aria-label="Simply">
              <img
                src="/assets/logo-simply.webp"
                alt="Simply"
                className="h-8 w-auto"
                draggable={false}
              />
            </a>
          )}

          {/* Centro: logo si no hay atrás, sino texto */}
          {backTo ? (
            <a href={LANDING_URL} className="flex items-center gap-2" aria-label="Simply">
              <img
                src="/assets/logo-simply.webp"
                alt="Simply"
                className="h-7 w-auto"
                draggable={false}
              />
              <span className="text-[11px] font-medium text-zinc-500 tracking-wider uppercase hidden sm:inline">
                Verificación
              </span>
            </a>
          ) : (
            <span className="text-xs font-medium text-zinc-400 tracking-wider uppercase">
              Verificación
            </span>
          )}

          {/* Salir */}
          {allowExit ? (
            <button
              onClick={handleExit}
              className="shrink-0 w-9 h-9 rounded-xl border border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:border-zinc-700 flex items-center justify-center transition"
              aria-label="Salir"
              title="Salir"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <div className="w-9 h-9" />
          )}
        </div>
      </header>

      {/* Diálogo de confirmación de salida */}
      {confirmExit && (
        <div
          className="fixed inset-0 z-[110] bg-black/85 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in"
          onClick={() => setConfirmExit(false)}
        >
          <div
            className="max-w-sm w-full bg-zinc-950 border border-white/10 rounded-2xl p-6 space-y-4 shadow-2xl animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-2">
              <h3 className="text-base font-semibold text-white">¿Querés salir?</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Vas a perder el progreso del registro. Tu información ya guardada quedará en tu cuenta.
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setConfirmExit(false)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-zinc-800 hover:border-zinc-600 text-sm text-white transition"
              >
                Continuar
              </button>
              <button
                onClick={confirmAndExit}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-600/90 hover:bg-red-500 text-sm text-white font-medium transition"
              >
                Salir
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
