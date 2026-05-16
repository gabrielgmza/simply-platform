"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, ArrowDownLeft, Bitcoin, Repeat } from "lucide-react";
import ReceiveModal from "./ReceiveModal";
import SendModal from "./SendModal";
import CryptoModal from "./CryptoModal";
import { getTierTheme } from "@/lib/tier-theme";

interface Props {
  customerId: string;
  firstName?: string;
  accountLevel?: string;
}

export default function QuickActions({ customerId, firstName, accountLevel }: Props) {
  const theme = getTierTheme(accountLevel);
  const [receiveOpen, setReceiveOpen] = useState(false);
  const [sendOpen, setSendOpen] = useState(false);
  const [cryptoOpen, setCryptoOpen] = useState(false);

  return (
    <>
      <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
        <button
          onClick={() => setSendOpen(true)}
          className={`flex flex-col items-center gap-1.5 bg-white/5 hover:bg-white/10 rounded-2xl p-2 sm:p-3 transition-colors ${theme.accentRing} ring-1`}
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/5 flex items-center justify-center text-blue-300">
            <ArrowUpRight className="w-5 h-5" />
          </div>
          <span className="text-xs text-white/80">Enviar</span>
        </button>

        <button
          onClick={() => setReceiveOpen(true)}
          className={`flex flex-col items-center gap-1.5 bg-white/5 hover:bg-white/10 rounded-2xl p-2 sm:p-3 transition-colors ${theme.accentRing} ring-1`}
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/5 flex items-center justify-center text-emerald-300">
            <ArrowDownLeft className="w-5 h-5" />
          </div>
          <span className="text-xs text-white/80">Recibir</span>
        </button>

        <button
          onClick={() => setCryptoOpen(true)}
          className={`flex flex-col items-center gap-1.5 bg-white/5 hover:bg-white/10 rounded-2xl p-2 sm:p-3 transition-colors ${theme.accentRing} ring-1`}
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/5 flex items-center justify-center text-amber-300">
            <Bitcoin className="w-5 h-5" />
          </div>
          <span className="text-xs text-white/80">Cripto</span>
        </button>

        <button
          disabled
          className="flex flex-col items-center gap-1.5 bg-white/[0.03] ring-1 ring-white/5 rounded-2xl p-3 relative opacity-60 cursor-not-allowed"
          title="Próximamente"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/5 flex items-center justify-center text-violet-300">
            <Repeat className="w-5 h-5" />
          </div>
          <span className="text-xs text-white/80">Convertir</span>
          <span className="absolute top-1 right-1 text-[8px] uppercase tracking-wide text-white/40 bg-white/5 px-1 py-0.5 rounded">
            Pronto
          </span>
        </button>
      </div>

      <ReceiveModal
        customerId={customerId}
        firstName={firstName}
        open={receiveOpen}
        onClose={() => setReceiveOpen(false)}
      />
      <SendModal
        open={sendOpen}
        onClose={() => setSendOpen(false)}
      />
      <CryptoModal
        customerId={customerId}
        open={cryptoOpen}
        onClose={() => setCryptoOpen(false)}
      />
    </>
  );
}
