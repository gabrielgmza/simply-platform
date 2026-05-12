"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { User, BookOpen, Settings, LogOut, ShieldCheck, Mail, Phone, IdCard, Receipt, Sparkles } from "lucide-react";
import { Button, Card, CardElevated, useSession } from "@simply/ui";
import { clearSession } from "@simply/ui";
import PerfilTab from "./PerfilTab";
import LibretaTab from "./LibretaTab";
import OperacionesTab from "./OperacionesTab";
import ParaVosTab from "./ParaVosTab";
import SecuritySettingsTab from "./SecuritySettingsTab";
import NotificationPrefsTab from "./NotificationPrefsTab";

type Tab = "perfil" | "libreta" | "operaciones" | "para-vos" | "settings";

function CuentaContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { session, loaded } = useSession();
  const [tab, setTab] = useState<Tab>("perfil");

  // Soportar ?tab=libreta en URL
  useEffect(() => {
    const t = searchParams.get("tab") as Tab | null;
    if (t && ["perfil", "libreta", "settings"].includes(t)) {
      setTab(t);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!loaded) return;
    if (!session) {
      router.push("/registro");
    }
  }, [loaded, session, router]);

  function handleTabChange(t: Tab) {
    setTab(t);
    // Actualizar URL sin recargar
    const url = new URL(window.location.href);
    url.searchParams.set("tab", t);
    window.history.replaceState({}, "", url);
  }

  function handleLogout() {
    if (!confirm("¿Cerrar sesión?")) return;
    clearSession();
    router.push("/");
  }

  if (!loaded || !session) {
    return <div className="text-center py-12 text-white/60">Cargando...</div>;
  }

  const fullName =
    session.firstName || session.lastName
      ? `${session.firstName || ""} ${session.lastName || ""}`.trim()
      : session.email.split("@")[0];

  return (
    <div className="space-y-6 animate-page-in">
      {/* Hero con datos del cliente */}
      <CardElevated className="space-y-3">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-xl font-semibold text-blue-300 shrink-0">
            {fullName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-semibold text-white truncate">{fullName}</h1>
            <div className="text-xs text-white/60 truncate">{session.email}</div>
            <div className="mt-2 inline-flex items-center gap-1.5 text-xs">
              <KycBadge status={session.profileStatus} />
            </div>
          </div>
        </div>
      </CardElevated>

      {/* Tabs */}
      <div className="grid grid-cols-3 gap-1 p-1 bg-zinc-900 rounded-2xl border border-white/5">
        <TabButton active={tab === "perfil"} onClick={() => handleTabChange("perfil")} icon={<User className="w-4 h-4" />}>
          Perfil
        </TabButton>
        <TabButton active={tab === "libreta"} onClick={() => handleTabChange("libreta")} icon={<BookOpen className="w-4 h-4" />}>
          Libreta
        </TabButton>
        <TabButton active={tab === "operaciones"} onClick={() => handleTabChange("operaciones")} icon={<Receipt className="w-4 h-4" />}>
          Operaciones
        </TabButton>
        <TabButton active={tab === "para-vos"} onClick={() => handleTabChange("para-vos")} icon={<Sparkles className="w-4 h-4" />}>
          Para vos
        </TabButton>
        <TabButton active={tab === "settings"} onClick={() => handleTabChange("settings")} icon={<Settings className="w-4 h-4" />}>
          Ajustes
        </TabButton>
      </div>

      {/* Content */}
      {tab === "perfil" && <PerfilTab session={session} />}
      {tab === "libreta" && <LibretaTab customerId={session.customerId} />}
      {tab === "operaciones" && <OperacionesTab customerId={session.customerId} />}
      {tab === "para-vos" && <ParaVosTab customerId={session.customerId} />}
      {tab === "settings" && (
        <div className="space-y-6">
          <SecuritySettingsTab customerId={session.customerId} email={session.email} />
          <NotificationPrefsTab customerId={session.customerId} />
          <SettingsTab onLogout={handleLogout} />
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────

function TabButton({
  active,
  onClick,
  icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-2.5 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition ${
        active
          ? "bg-blue-500/15 text-blue-200 border border-blue-500/30"
          : "text-zinc-400 hover:text-white border border-transparent"
      }`}
    >
      {icon}
      {children}
    </button>
  );
}

function KycBadge({ status }: { status?: string }) {
  const map: Record<string, { label: string; color: string; icon: any }> = {
    LEAD:            { label: "Cuenta nueva",   color: "text-zinc-400 bg-zinc-500/15 border-zinc-500/30",   icon: User },
    GUEST:           { label: "Invitado",       color: "text-zinc-400 bg-zinc-500/15 border-zinc-500/30",   icon: User },
    REGISTERED:     { label: "Sin verificar",  color: "text-amber-300 bg-amber-500/15 border-amber-500/30", icon: User },
    VERIFIED_BASIC: { label: "Básico verificado", color: "text-blue-300 bg-blue-500/15 border-blue-500/30", icon: ShieldCheck },
    VERIFIED_FULL:  { label: "Verificado",     color: "text-green-300 bg-green-500/15 border-green-500/30", icon: ShieldCheck },
  };
  const cfg = map[status || "LEAD"] || map.LEAD;
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[10px] uppercase tracking-wider font-medium ${cfg.color}`}>
      <Icon className="w-3 h-3" />
      {cfg.label}
    </span>
  );
}

function SettingsTab({ onLogout }: { onLogout: () => void }) {
  return (
    <Card>
      <div className="p-4 space-y-2">
        <div className="text-xs uppercase tracking-wider text-zinc-500 font-medium">
          Sesión
        </div>
        <Button onClick={onLogout} variant="secondary" className="w-full">
          <LogOut className="w-4 h-4 mr-2" />
          Cerrar sesión
        </Button>
      </div>
    </Card>
  );
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <CuentaContent />
    </Suspense>
  );
}
