"use client";

import Link from "next/link";
import { Check, ArrowRight, Sparkles, ShieldCheck, Wallet, Send, Repeat } from "lucide-react";

interface Step {
  icon: any;
  label: string;
  href: string | null;
  done: boolean;
  external?: boolean;
}

interface Props {
  profileStatus: string;
  hasWallet: boolean;
  hasOps: boolean;
}

export default function WelcomeCard({ profileStatus, hasWallet, hasOps }: Props) {
  const verified = profileStatus === "VERIFIED_BASIC" || profileStatus === "VERIFIED_FULL";

  const steps: Step[] = [
    {
      icon: ShieldCheck,
      label: "Verificá tu identidad",
      href: verified ? null : "/registro/dni",
      done: verified,
    },
    {
      icon: Wallet,
      label: "Cargá saldo a tu wallet",
      href: "/recibir",
      done: hasWallet,
    },
    {
      icon: Send,
      label: "Hacé tu primera transferencia",
      href: "/destinatario",
      done: hasOps,
    },
    {
      icon: Repeat,
      label: "Convertí entre monedas",
      href: "/convertir",
      done: false,
    },
  ];

  const nextStep = steps.find((s) => !s.done);

  return (
    <div className="bg-gradient-to-br from-emerald-500/15 via-blue-500/10 to-violet-500/15 ring-1 ring-emerald-500/20 rounded-3xl p-6">
      <div className="flex items-center gap-2 text-emerald-300">
        <Sparkles className="w-5 h-5" />
        <span className="text-xs uppercase tracking-wide font-medium">Bienvenido</span>
      </div>
      <h2 className="text-xl font-bold text-white mt-2">Tu cuenta Simply está lista</h2>
      <p className="text-sm text-white/70 mt-1">
        Empezá a usar Simply con estos primeros pasos:
      </p>

      <div className="mt-4 space-y-2">
        {steps.map((s, i) => {
          const Icon = s.icon;
          const isNext = s === nextStep;
          const inner = (
            <div
              className={`flex items-center gap-3 rounded-xl p-3 transition-colors ${
                s.done
                  ? "bg-white/5 ring-1 ring-emerald-500/20"
                  : isNext
                    ? "bg-white/10 ring-1 ring-white/20 hover:bg-white/15"
                    : "bg-white/5 ring-1 ring-white/10"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  s.done ? "bg-emerald-500/20 text-emerald-300" : "bg-white/5 text-white/60"
                }`}
              >
                {s.done ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
              </div>
              <span className={`text-sm flex-1 ${s.done ? "text-white/50 line-through" : "text-white"}`}>
                {s.label}
              </span>
              {!s.done && s.href && (
                <ArrowRight className={`w-4 h-4 ${isNext ? "text-white" : "text-white/30"}`} />
              )}
            </div>
          );
          if (s.done || !s.href) return <div key={i}>{inner}</div>;
          return (
            <Link key={i} href={s.href} className="block">
              {inner}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
