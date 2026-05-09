"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Clock } from "lucide-react";
import { Card, Button, StatusBadge, MoneyDisplay, useSession } from "@simply/ui";

export default function HistorialPage() {
  const router = useRouter();
  const { session, loaded } = useSession();
  const [items, setItems] = useState<any[] | null>(null);

  useEffect(() => {
    if (!loaded) return;
    if (!session) {
      router.push("/");
      return;
    }
    setItems([]);
  }, [loaded, session, router]);

  if (!loaded || items === null)
    return <div className="text-center py-12 text-white/60">Cargando...</div>;

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-semibold">Historial</h1>
        <p className="text-sm text-white/60">Tus operaciones</p>
      </div>

      {items.length === 0 ? (
        <Card className="text-center py-12 space-y-3">
          <Clock className="w-10 h-10 text-white/30 mx-auto" />
          <p className="text-sm text-white/60">No tenés operaciones aún</p>
          <a href="/">
            <Button variant="secondary" fullWidth={false}>
              Empezar
            </Button>
          </a>
        </Card>
      ) : (
        <div className="space-y-3">
          {items.map((it) => (
            <a
              key={it.order}
              href={`/exito/${it.order}`}
              className="card block hover:border-white/10"
            >
              <div className="flex justify-between items-center">
                <span className="text-sm text-white/80">
                  Orden #{String(it.order).slice(-6)}
                </span>
                <StatusBadge status={it.status} />
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
