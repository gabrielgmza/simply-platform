"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Receipt } from "lucide-react";
import {
  Card,
  Button,
  StatusBadge,
  MoneyDisplay,
  useSession,
} from "@simply/ui";
import StateCard from "@/components/registro/StateCard";

interface OperationItem {
  order: string;
  status: string;
  sourceAsset: { kind: "fiat" | "crypto"; currency?: string; symbol?: string };
  destinationAsset: { kind: "fiat" | "crypto"; currency?: string; symbol?: string };
  sourceAmount: string;
  beneficiaryReceives: string;
  createdAt: string;
}

export default function HistorialPage() {
  const router = useRouter();
  const { session, loaded } = useSession();
  const [items, setItems] = useState<OperationItem[] | null>(null);

  useEffect(() => {
    if (!loaded) return;
    if (!session) {
      router.push("/");
      return;
    }
    // TODO: cuando esté listo el endpoint, cargar operaciones reales
    // fetch(`/api/transfer-engine/customer/${session.customerId}`)
    setItems([]);
  }, [loaded, session, router]);

  if (!loaded || items === null) {
    return <SkeletonHistorial />;
  }

  return (
    <div className="space-y-6 animate-page-in">
      <div className="text-center space-y-2">
        <div className="wizard-icon-bubble">
          <Receipt className="w-6 h-6 text-blue-300" />
        </div>
        <h1 className="wizard-title">Historial</h1>
        <p className="wizard-subtitle">Tus operaciones recientes</p>
      </div>

      {items.length === 0 ? (
        <StateCard
          kind="empty"
          title="Sin operaciones"
          description="Cuando hagas tu primer envío, aparecerá acá."
        >
          <a href="/">
            <Button rightIcon={<ArrowRight className="w-4 h-4" />}>
              Empezar
            </Button>
          </a>
        </StateCard>
      ) : (
        <div className="space-y-3">
          {items.map((it) => (
            <OperationRow key={it.order} item={it} />
          ))}
        </div>
      )}
    </div>
  );
}

function OperationRow({ item }: { item: OperationItem }) {
  const sourceCode =
    item.sourceAsset.kind === "fiat" ? item.sourceAsset.currency : item.sourceAsset.symbol;
  const destCode =
    item.destinationAsset.kind === "fiat" ? item.destinationAsset.currency : item.destinationAsset.symbol;

  return (
    <a
      href={`/exito/${item.order}`}
      className="block rounded-2xl border border-white/10 bg-zinc-950/80 hover:bg-zinc-950 hover:border-white/20 p-4 transition group"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0 space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-white truncate">
              {sourceCode} → {destCode}
            </span>
            <StatusBadge status={item.status} />
          </div>
          <div className="flex items-center gap-2 text-xs text-white/50">
            <span>#{String(item.order).slice(-6)}</span>
            <span>·</span>
            <span>
              {new Date(item.createdAt).toLocaleString("es-AR", {
                day: "2-digit",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>

        <div className="text-right space-y-0.5">
          <MoneyDisplay
            amount={parseFloat(item.sourceAmount)}
            currency={sourceCode!}
            size="sm"
          />
          <div className="text-xs text-white/40">→</div>
          <MoneyDisplay
            amount={parseFloat(item.beneficiaryReceives)}
            currency={destCode!}
            size="sm"
            highlight
          />
        </div>
      </div>
    </a>
  );
}

function SkeletonHistorial() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-2">
        <div className="w-14 h-14 skeleton rounded-2xl mx-auto" />
        <div className="h-7 w-32 skeleton rounded mx-auto" />
        <div className="h-4 w-40 skeleton rounded mx-auto" />
      </div>

      {[1, 2, 3].map((i) => (
        <div key={i} className="rounded-2xl border border-white/5 bg-zinc-950/80 p-4">
          <div className="flex justify-between gap-3">
            <div className="space-y-2 flex-1">
              <div className="h-5 w-32 skeleton rounded" />
              <div className="h-3 w-24 skeleton rounded" />
            </div>
            <div className="space-y-1 text-right">
              <div className="h-4 w-20 skeleton rounded ml-auto" />
              <div className="h-4 w-16 skeleton rounded ml-auto" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
