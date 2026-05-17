"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@simply/ui";
import { TrendingUp, ArrowLeftRight, Receipt, ArrowLeft } from "lucide-react";
import ResumenTab from "./ResumenTab";
import MovimientosTab from "./MovimientosTab";
import CuotasTab from "./CuotasTab";

type Tab = "resumen" | "movimientos" | "cuotas";

export default function InversionesPage() {
  const router = useRouter();
  const { session, loaded } = useSession();
  const [tab, setTab] = useState<Tab>("resumen");

  useEffect(() => {
    if (loaded && !session) router.push("/login");
  }, [loaded, session, router]);

  if (!loaded || !session) {
    return <div className="text-white/60 text-center py-12">Cargando...</div>;
  }

  const tabs: Array<{ id: Tab; label: string; icon: any }> = [
    { id: "resumen", label: "Resumen", icon: TrendingUp },
    { id: "movimientos", label: "Movimientos", icon: ArrowLeftRight },
    { id: "cuotas", label: "Cuotas", icon: Receipt },
  ];

  return (
    <div className="space-y-4 animate-page-in">
      <div className="flex items-center gap-2">
        <button onClick={() => router.back()} className="p-2 -ml-2 text-white/60 hover:text-white">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-semibold text-white">Inversiones</h1>
      </div>

      <div className="flex gap-1 bg-white/5 rounded-xl p-1">
        {tabs.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 text-sm py-2 rounded-lg transition-colors ${
                tab === t.id ? "bg-white/10 text-white" : "text-white/60 hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4" />
              {t.label}
            </button>
          );
        })}
      </div>

      {tab === "resumen" && (
        <ResumenTab customerId={session.customerId} accountLevel={session.accountLevel || "STANDARD"} />
      )}
      {tab === "movimientos" && <MovimientosTab customerId={session.customerId} />}
      {tab === "cuotas" && <CuotasTab customerId={session.customerId} />}
    </div>
  );
}
