"use client";

import { useEffect, useState } from "react";
import {
  Mail, Key, ShieldCheck, Smartphone, AlertTriangle, Clock,
  Repeat, TrendingUp, Award, BookOpen, CreditCard,
  Sparkles, X, Loader2, ArrowRight,
} from "lucide-react";
import { Card } from "@simply/ui";
import { listRecommendations, dismissRecommendation, type Recommendation } from "@/lib/recommendations-api";

const ICONS: Record<string, any> = {
  Mail, Key, ShieldCheck, Smartphone, AlertTriangle, Clock,
  Repeat, TrendingUp, Award, BookOpen, CreditCard,
};

const CATEGORY_COLORS: Record<string, { bg: string; ring: string; icon: string }> = {
  security:      { bg: "bg-red-500/10",     ring: "ring-red-500/30",     icon: "text-red-400" },
  kyc:           { bg: "bg-emerald-500/10", ring: "ring-emerald-500/30", icon: "text-emerald-400" },
  product:       { bg: "bg-blue-500/10",    ring: "ring-blue-500/30",    icon: "text-blue-400" },
  engagement:    { bg: "bg-violet-500/10",  ring: "ring-violet-500/30",  icon: "text-violet-400" },
  "tier-upgrade":{ bg: "bg-amber-500/10",   ring: "ring-amber-500/30",   icon: "text-amber-400" },
};

export default function ParaVosTab({ customerId }: { customerId: string }) {
  const [recos, setRecos] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dismissing, setDismissing] = useState<Set<string>>(new Set());

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await listRecommendations(customerId);
      setRecos(data);
    } catch (e: any) {
      setError(e.message || "Error cargando recomendaciones");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerId]);

  async function handleDismiss(ruleId: string) {
    setDismissing((s) => new Set(s).add(ruleId));
    try {
      await dismissRecommendation(customerId, ruleId);
      setRecos((rs) => rs.filter((r) => r.id !== ruleId));
    } catch (e: any) {
      setError(e.message);
    } finally {
      setDismissing((s) => {
        const ns = new Set(s);
        ns.delete(ruleId);
        return ns;
      });
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 text-white/60">
        <Loader2 className="w-5 h-5 animate-spin mr-2" />
        Cargando...
      </div>
    );
  }

  if (recos.length === 0) {
    return (
      <Card>
        <div className="p-10 text-center">
          <Sparkles className="w-10 h-10 mx-auto mb-3 text-white/30" />
          <p className="text-sm text-white/70">¡Todo en orden!</p>
          <p className="text-xs text-white/40 mt-1">No tenemos recomendaciones para vos por ahora.</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {error && (
        <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg p-3">
          {error}
        </div>
      )}

      {recos.map((r) => {
        const Icon = ICONS[r.icon] || Sparkles;
        const c = CATEGORY_COLORS[r.category] || CATEGORY_COLORS.product;
        const isDismissing = dismissing.has(r.id);
        const progress = typeof r.meta?.progress === "number" ? r.meta.progress : null;

        return (
          <div
            key={r.id}
            className={`relative rounded-2xl ${c.bg} ring-1 ${c.ring} p-4 transition-opacity ${isDismissing ? "opacity-50" : ""}`}
          >
            <button
              onClick={() => handleDismiss(r.id)}
              disabled={isDismissing}
              className="absolute top-3 right-3 text-white/40 hover:text-white/80"
              title="No me interesa"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-start gap-3 pr-6">
              <div className={`w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center shrink-0 ${c.icon}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-white">{r.title}</h4>
                <p className="text-xs text-white/60 mt-1">{r.description}</p>

                {progress !== null && (
                  <div className="mt-3">
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-400 transition-all"
                        style={{ width: `${Math.min(100, Math.round(progress * 100))}%` }}
                      />
                    </div>
                    <div className="text-[10px] text-white/40 mt-1">
                      {Math.round(progress * 100)}% del próximo tier
                    </div>
                  </div>
                )}

                <a
                  href={r.ctaHref}
                  target={r.ctaHref.startsWith("http") ? "_blank" : undefined}
                  rel={r.ctaHref.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="inline-flex items-center gap-1 text-sm text-white hover:text-white/80 font-medium mt-3"
                >
                  {r.ctaLabel}
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
