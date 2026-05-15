"use client";

import { useEffect, useState } from "react";
import { getTierTheme } from "@/lib/tier-theme";
import Link from "next/link";
import { ArrowRight, Sparkles, Mail, Key, ShieldCheck, Smartphone, AlertTriangle, Clock, Repeat, TrendingUp, Award, BookOpen, CreditCard } from "lucide-react";
import { listRecommendations, type Recommendation } from "@/lib/recommendations-api";

const ICONS: Record<string, any> = {
  Mail, Key, ShieldCheck, Smartphone, AlertTriangle, Clock,
  Repeat, TrendingUp, Award, BookOpen, CreditCard, Sparkles,
};

export default function FeaturedRecommendation({ customerId, accountLevel }: { customerId: string; accountLevel?: string }) {
  const theme = getTierTheme(accountLevel);
  const [reco, setReco] = useState<Recommendation | null>(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    listRecommendations(customerId)
      .then((rs) => {
        setReco(rs[0] || null);
        setCount(rs.length);
      })
      .catch(() => setReco(null));
  }, [customerId]);

  if (!reco) return null;
  const Icon = ICONS[reco.icon] || Sparkles;

  return (
    <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/5 ring-1 ring-amber-500/20 rounded-2xl p-4">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-300 shrink-0">
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-wide text-amber-300/70">Para vos</span>
            {count > 1 && (
              <Link href="/cuenta?tab=para-vos" className="text-[10px] text-white/40 hover:text-white/70">
                +{count - 1} más
              </Link>
            )}
          </div>
          <h4 className="text-sm font-semibold text-white mt-0.5">{reco.title}</h4>
          <p className="text-xs text-white/60 mt-1">{reco.description}</p>
          <a
            href={reco.ctaHref}
            target={reco.ctaHref.startsWith("http") ? "_blank" : undefined}
            rel={reco.ctaHref.startsWith("http") ? "noopener noreferrer" : undefined}
            className="inline-flex items-center gap-1 text-sm text-amber-300 hover:text-amber-200 font-medium mt-3"
          >
            {reco.ctaLabel}
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
