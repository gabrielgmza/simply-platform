"use client";

import Link from "next/link";
import { ArrowUpRight, ArrowDownLeft, Bitcoin, Repeat } from "lucide-react";

const actions = [
  { label: "Enviar", icon: ArrowUpRight, href: "/destinatario", color: "text-blue-300" },
  { label: "Recibir", icon: ArrowDownLeft, href: "/recibir", color: "text-emerald-300" },
  { label: "Cripto", icon: Bitcoin, href: "https://crypto.gosimply.xyz", color: "text-amber-300", external: true },
  { label: "Convertir", icon: Repeat, href: "/convertir", color: "text-violet-300" },
];

export default function QuickActions() {
  return (
    <div className="grid grid-cols-4 gap-2">
      {actions.map((a) => {
        const Icon = a.icon;
        const Wrapper: any = a.external ? "a" : Link;
        const props: any = a.external
          ? { href: a.href, target: "_blank", rel: "noopener noreferrer" }
          : { href: a.href };
        return (
          <Wrapper
            key={a.label}
            {...props}
            className="flex flex-col items-center gap-1.5 bg-white/5 hover:bg-white/10 ring-1 ring-white/10 rounded-2xl p-3 transition-colors"
          >
            <div className={`w-10 h-10 rounded-full bg-white/5 flex items-center justify-center ${a.color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <span className="text-xs text-white/80">{a.label}</span>
          </Wrapper>
        );
      })}
    </div>
  );
}
