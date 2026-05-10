"use client";

import { useState, useRef, ReactNode } from "react";
import { Info } from "lucide-react";

interface Props {
  content: ReactNode;
  children?: ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  /** Si no hay children, usa un ícono Info por default */
  iconSize?: number;
}

export default function Tooltip({
  content,
  children,
  position = "top",
  iconSize = 14,
}: Props) {
  const [open, setOpen] = useState(false);
  const timer = useRef<NodeJS.Timeout | null>(null);

  function show() {
    if (timer.current) clearTimeout(timer.current);
    setOpen(true);
  }

  function hide() {
    timer.current = setTimeout(() => setOpen(false), 100);
  }

  // Posicionamiento
  const pos: Record<typeof position, string> = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  // Triángulo
  const arrow: Record<typeof position, string> = {
    top: "top-full left-1/2 -translate-x-1/2 border-t-zinc-800 border-x-transparent border-b-transparent",
    bottom: "bottom-full left-1/2 -translate-x-1/2 border-b-zinc-800 border-x-transparent border-t-transparent",
    left: "left-full top-1/2 -translate-y-1/2 border-l-zinc-800 border-y-transparent border-r-transparent",
    right: "right-full top-1/2 -translate-y-1/2 border-r-zinc-800 border-y-transparent border-l-transparent",
  };

  return (
    <span
      className="relative inline-flex items-center"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      <span
        className="inline-flex items-center cursor-help"
        tabIndex={children ? -1 : 0}
        role="button"
        aria-label="Más información"
      >
        {children || <Info className="text-zinc-500 hover:text-zinc-300 transition" size={iconSize} />}
      </span>

      {open && (
        <span
          role="tooltip"
          className={`absolute z-50 ${pos[position]} pointer-events-none animate-fade-in`}
        >
          <span className="relative block min-w-[180px] max-w-[260px] bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white/85 leading-relaxed shadow-2xl">
            {content}
            <span
              aria-hidden
              className={`absolute w-0 h-0 border-4 ${arrow[position]}`}
            />
          </span>
        </span>
      )}
    </span>
  );
}
