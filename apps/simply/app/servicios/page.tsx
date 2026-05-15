"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@simply/ui";
import { Receipt, Calendar, History as HistoryIcon, ChevronLeft } from "lucide-react";
import Link from "next/link";
import PagarTab from "./PagarTab";
import ProgramadosTab from "./ProgramadosTab";
import HistorialTab from "./HistorialTab";

type TabKey = "pagar" | "programados" | "historial";

export default function ServiciosPage() {
  const { session, loaded } = useSession();
  const router = useRouter();
  const [tab, setTab] = useState<TabKey>("pagar");

  useEffect(() => {
    if (loaded && !session) router.push("/login");
  }, [loaded, session, router]);

  if (!loaded || !session) return null;

  return (
    <div className="space-y-4">
      <Link href="/dashboard" className="inline-flex items-center gap-1 text-sm text-white/60 hover:text-white">
        <ChevronLeft className="w-4 h-4" />
        Volver
      </Link>

      <h1 className="text-xl font-semibold text-white">Servicios y recargas</h1>

      {/* Tabs */}
      <div className="flex border-b border-white/5">
        <TabButton active={tab === "pagar"} onClick={() => setTab("pagar")} icon={<Receipt className="w-4 h-4" />}>
          Pagar
        </TabButton>
        <TabButton active={tab === "programados"} onClick={() => setTab("programados")} icon={<Calendar className="w-4 h-4" />}>
          Programados
        </TabButton>
        <TabButton active={tab === "historial"} onClick={() => setTab("historial")} icon={<HistoryIcon className="w-4 h-4" />}>
          Historial
        </TabButton>
      </div>

      {tab === "pagar" && <PagarTab customerId={session.customerId} />}
      {tab === "programados" && <ProgramadosTab customerId={session.customerId} />}
      {tab === "historial" && <HistorialTab customerId={session.customerId} />}
    </div>
  );
}

function TabButton({ active, onClick, icon, children }: { active: boolean; onClick: () => void; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs transition-colors ${
        active ? "text-white border-b-2 border-blue-400" : "text-white/50 hover:text-white"
      }`}
    >
      {icon}
      {children}
    </button>
  );
}
