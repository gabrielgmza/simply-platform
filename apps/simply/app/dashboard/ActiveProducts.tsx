"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Wallet as WalletIcon, Bitcoin, TrendingUp, CreditCard, ArrowRight } from "lucide-react";
import { Card } from "@simply/ui";
import { getBalances, type BalancesResponse } from "@/lib/balances-api";
import { listOperations, type Operation } from "@/lib/operations-api";

interface ProductCard {
  key: string;
  label: string;
  subtitle: string;
  icon: any;
  iconColor: string;
  href: string;
}

export default function ActiveProducts({ customerId }: { customerId: string }) {
  const [products, setProducts] = useState<ProductCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getBalances(customerId).catch(() => null),
      listOperations(customerId, { limit: 200 }).catch(() => [] as Operation[]),
    ]).then(([bal, ops]) => {
      const cards: ProductCard[] = [];

      // Wallet ARS
      const arsBalance = parseFloat(bal?.balances?.ARS?.available || "0");
      if (bal?.linked && arsBalance > 0) {
        cards.push({
          key: "wallet-ars",
          label: "Wallet ARS",
          subtitle: `$${arsBalance.toLocaleString("es-AR", { minimumFractionDigits: 2 })} disponibles`,
          icon: WalletIcon,
          iconColor: "text-blue-400",
          href: "/wallet",
        });
      }

      // Cripto: si hizo ops crypto
      const cryptoOps = ops.filter((o) => o.module === "crypto");
      if (cryptoOps.length > 0) {
        cards.push({
          key: "crypto",
          label: "Cripto",
          subtitle: `${cryptoOps.length} operacion${cryptoOps.length === 1 ? "" : "es"}`,
          icon: Bitcoin,
          iconColor: "text-amber-400",
          href: "https://crypto.gosimply.xyz",
        });
      }

      // Inversiones
      const investOps = ops.filter((o) => o.module === "investment");
      if (investOps.length > 0) {
        const total = investOps.reduce((a, o) => a + parseFloat(o.amount || "0"), 0);
        cards.push({
          key: "investment",
          label: "Inversiones",
          subtitle: `$${total.toLocaleString("es-AR", { minimumFractionDigits: 2 })} invertidos`,
          icon: TrendingUp,
          iconColor: "text-violet-400",
          href: "/inversiones",
        });
      }

      // Crédito (Originación)
      const credOps = ops.filter((o) => o.module === "originacion");
      if (credOps.length > 0) {
        const activos = credOps.filter((o) => o.status === "processing" || o.status === "pending").length;
        cards.push({
          key: "credit",
          label: "Crédito",
          subtitle: activos > 0 ? `${activos} en curso` : "Historial disponible",
          icon: CreditCard,
          iconColor: "text-emerald-400",
          href: "/cuenta?tab=operaciones",
        });
      }

      setProducts(cards);
      setLoading(false);
    });
  }, [customerId]);

  if (loading) return null;
  if (products.length === 0) return null;

  return (
    <div>
      <h3 className="text-sm font-semibold text-white mb-2">Tus productos</h3>
      <div className="grid grid-cols-2 gap-2">
        {products.map((p) => {
          const Icon = p.icon;
          const isExternal = p.href.startsWith("http");
          const Wrapper: any = isExternal ? "a" : Link;
          const wrapperProps: any = isExternal
            ? { href: p.href, target: "_blank", rel: "noopener noreferrer" }
            : { href: p.href };
          return (
            <Wrapper
              key={p.key}
              {...wrapperProps}
              className="block bg-white/5 hover:bg-white/10 ring-1 ring-white/10 rounded-2xl p-3 transition-colors"
            >
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center ${p.iconColor}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-white/30 ml-auto" />
              </div>
              <div className="text-sm text-white mt-2">{p.label}</div>
              <div className="text-xs text-white/50 mt-0.5 truncate">{p.subtitle}</div>
            </Wrapper>
          );
        })}
      </div>
    </div>
  );
}
