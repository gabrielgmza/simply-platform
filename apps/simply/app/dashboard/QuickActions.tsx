"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, ArrowDownLeft, Bitcoin, Repeat } from "lucide-react";
import ReceiveModal from "./ReceiveModal";
import SendModal from "./SendModal";
import CryptoModal from "./CryptoModal";

interface Props {
  customerId: string;
  firstName?: string;
}

export default function QuickActions({ customerId, firstName }: Props) {
  const [receiveOpen, setReceiveOpen] = useState(false);
  const [sendOpen, setSendOpen] = useState(false);
  const [cryptoOpen, setCryptoOpen] = useState(false);

  return (
    <>
      <div className="grid grid-cols-4 gap-2">
        <button
          onClick={() => setSendOpen(true)}
          className="flex flex-col items-center gap-1.5 bg-white/5 hover:bg-white/10 ring-1 ring-white/10 rounded-2xl p-3 transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-blue-300">
            <ArrowUpRight className="w-5 h-5" />
          </div>
          <span className="text-xs text-white/80">Enviar</span>
        </button>

        <button
          onClick={() => setReceiveOpen(true)}
          className="flex flex-col items-center gap-1.5 bg-white/5 hover:bg-white/10 ring-1 ring-white/10 rounded-2xl p-3 transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-emerald-300">
            <ArrowDownLeft className="w-5 h-5" />
          </div>
          <span className="text-xs text-white/80">Recibir</span>
        </button>

        <button
          onClick={() => setCryptoOpen(true)}
          className="flex flex-col items-center gap-1.5 bg-white/5 hover:bg-white/10 ring-1 ring-white/10 rounded-2xl p-3 transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-amber-300">
            <Bitcoin className="w-5 h-5" />
          </div>
          <span className="text-xs text-white/80">Cripto</span>
        </button>

        <Link
          href="/convertir"
          className="flex flex-col items-center gap-1.5 bg-white/5 hover:bg-white/10 ring-1 ring-white/10 rounded-2xl p-3 transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-violet-300">
            <Repeat className="w-5 h-5" />
          </div>
          <span className="text-xs text-white/80">Convertir</span>
        </Link>
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
