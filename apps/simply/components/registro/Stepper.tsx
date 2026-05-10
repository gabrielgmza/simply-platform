"use client";

import { Check } from "lucide-react";

export interface Step {
  key: string;
  label: string;
}

const STEPS: Step[] = [
  { key: "email",   label: "Email" },
  { key: "datos",   label: "Datos" },
  { key: "dni",     label: "Documento" },
  { key: "selfie",  label: "Identidad" },
  { key: "listo",   label: "Listo" },
];

interface Props {
  /** Clave del paso actual (uno de los keys de STEPS) */
  current: string;
}

export default function Stepper({ current }: Props) {
  const currentIdx = STEPS.findIndex((s) => s.key === current);

  return (
    <div className="w-full max-w-md mx-auto px-2">
      {/* Dots + connectors */}
      <div className="flex items-center justify-between">
        {STEPS.map((step, i) => {
          const isDone = i < currentIdx;
          const isCurrent = i === currentIdx;
          const isFuture = i > currentIdx;

          return (
            <div key={step.key} className="flex items-center flex-1 last:flex-none">
              {/* Dot */}
              <div
                className={[
                  "shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-semibold transition-all duration-300",
                  isDone && "bg-blue-600 text-white shadow-[0_0_18px_rgba(37,99,235,0.5)]",
                  isCurrent && "bg-blue-600 text-white ring-4 ring-blue-600/25 shadow-[0_0_22px_rgba(37,99,235,0.65)]",
                  isFuture && "bg-zinc-900 text-zinc-500 border border-zinc-800",
                ].filter(Boolean).join(" ")}
              >
                {isDone ? <Check className="w-3.5 h-3.5" /> : i + 1}
              </div>

              {/* Connector (todos menos el último) */}
              {i < STEPS.length - 1 && (
                <div className="flex-1 h-px mx-1.5 relative overflow-hidden">
                  <div className="absolute inset-0 bg-zinc-800" />
                  <div
                    className={[
                      "absolute inset-y-0 left-0 bg-blue-600 transition-all duration-500",
                      i < currentIdx ? "w-full" : "w-0",
                    ].join(" ")}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Labels */}
      <div className="flex items-start justify-between mt-2.5 px-0.5">
        {STEPS.map((step, i) => {
          const isCurrent = i === currentIdx;
          const isDone = i < currentIdx;
          return (
            <span
              key={step.key}
              className={[
                "text-[10px] font-medium tracking-wide uppercase transition-colors text-center w-12 -ml-2.5 first:ml-0 last:-mr-2",
                isCurrent && "text-blue-300",
                isDone && "text-zinc-300",
                !isCurrent && !isDone && "text-zinc-600",
              ].filter(Boolean).join(" ")}
            >
              {step.label}
            </span>
          );
        })}
      </div>
    </div>
  );
}
