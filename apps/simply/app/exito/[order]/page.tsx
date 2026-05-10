"use client";

import { useParams } from "next/navigation";
import {
  CheckCircle2,
  Clock,
  Loader2,
  AlertCircle,
  ArrowRight,
  Receipt,
  Home,
} from "lucide-react";
import {
  Card,
  MoneyDisplay,
  StatusBadge,
  Button,
  useOrderTracking,
} from "@simply/ui";
import StateCard from "@/components/registro/StateCard";

interface StatusConfig {
  icon: any;
  spin?: boolean;
  color: string;
  title: string;
  description: string;
  variant: "success" | "info" | "warning" | "error";
}

const STATUS_CONFIG: Record<string, StatusConfig> = {
  awaiting_funding: {
    icon: Clock,
    color: "text-amber-400",
    title: "Esperando tu pago",
    description: "Una vez que recibamos tus fondos, ejecutamos el envío automáticamente.",
    variant: "warning",
  },
  funding_received: {
    icon: Loader2,
    spin: true,
    color: "text-blue-400",
    title: "Pago recibido",
    description: "Estamos procesando tu envío. Esto puede tardar unos minutos.",
    variant: "info",
  },
  started: {
    icon: Loader2,
    spin: true,
    color: "text-blue-400",
    title: "Procesando",
    description: "Tu operación está en marcha.",
    variant: "info",
  },
  swapping: {
    icon: Loader2,
    spin: true,
    color: "text-blue-400",
    title: "Convirtiendo monedas",
    description: "Estamos haciendo el cambio al mejor rate.",
    variant: "info",
  },
  executing_payout: {
    icon: Loader2,
    spin: true,
    color: "text-blue-400",
    title: "Enviando a destino",
    description: "Tu pago está siendo enviado al destinatario.",
    variant: "info",
  },
  pending: {
    icon: Clock,
    color: "text-amber-400",
    title: "Pendiente",
    description: "Tu operación está en cola para procesarse.",
    variant: "warning",
  },
  completed: {
    icon: CheckCircle2,
    color: "text-green-400",
    title: "¡Operación completada!",
    description: "Los fondos llegaron a destino correctamente.",
    variant: "success",
  },
  denied: {
    icon: AlertCircle,
    color: "text-red-400",
    title: "Operación rechazada",
    description: "No pudimos completar la operación. Contactanos para más info.",
    variant: "error",
  },
  failed: {
    icon: AlertCircle,
    color: "text-red-400",
    title: "Hubo un problema",
    description: "La operación no pudo completarse. Te devolveremos los fondos.",
    variant: "error",
  },
};

const VARIANT_TO_KIND: Record<string, "success" | "warning" | "error" | "verified"> = {
  success: "verified",
  warning: "warning",
  error: "error",
  info: "warning",
};

export default function ExitoPage() {
  const params = useParams();
  const order = params.order as string;
  const { tx, error } = useOrderTracking(order);

  // ─── Mock fallback: si el order es "mock-..." (cripto→fiat sin Vita real) ───
  const isMock = order?.startsWith("mock-");

  if (isMock) {
    return <MockSuccessView order={order} />;
  }

  if (error) {
    return (
      <div className="space-y-6 animate-page-in">
        <StateCard
          kind="error"
          title="No pudimos cargar la operación"
          description={error}
        />
        <a href="/">
          <Button variant="secondary">Volver al inicio</Button>
        </a>
      </div>
    );
  }

  if (!tx) {
    return <SkeletonView />;
  }

  const config = STATUS_CONFIG[tx.status] || STATUS_CONFIG.started;
  const Icon = config.icon;

  const sourceAsset = tx.sourceAsset;
  const destAsset = tx.destinationAsset;
  const sourceCode = sourceAsset.kind === "fiat" ? sourceAsset.currency : sourceAsset.symbol;
  const destCode = destAsset.kind === "fiat" ? destAsset.currency : destAsset.symbol;

  const isCompleted = tx.status === "completed";
  const isFailed = tx.status === "denied" || tx.status === "failed";

  return (
    <div className="space-y-6 animate-page-in">
      {/* Hero principal */}
      <div className="text-center space-y-3">
        {isCompleted ? (
          <StateCard
            kind="verified"
            title={config.title}
            description={config.description}
          />
        ) : isFailed ? (
          <StateCard
            kind="error"
            title={config.title}
            description={config.description}
          />
        ) : (
          <Card className="text-center py-7 space-y-3">
            <div className="inline-flex w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 items-center justify-center mx-auto">
              <Icon className={`w-8 h-8 ${config.color} ${config.spin ? "animate-spin" : ""}`} />
            </div>
            <h1 className="text-xl font-semibold text-white">{config.title}</h1>
            <p className="text-sm text-white/60 max-w-sm mx-auto">{config.description}</p>
            <div className="flex justify-center pt-1">
              <StatusBadge status={tx.status} />
            </div>
          </Card>
        )}
      </div>

      {/* Resumen de la operación */}
      <Card className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="text-xs uppercase tracking-wider text-zinc-500 font-medium">
            Detalles de la operación
          </div>
          <div className="text-[10px] uppercase tracking-wider text-zinc-600 font-mono">
            #{String(tx.order).slice(-6)}
          </div>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-white/55">Enviado</span>
          <MoneyDisplay amount={parseFloat(tx.sourceAmount)} currency={sourceCode} size="sm" />
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-white/55">Destino recibe</span>
          <MoneyDisplay
            amount={parseFloat(tx.beneficiaryReceives)}
            currency={destCode}
            size="sm"
            highlight
          />
        </div>

        {tx.createdAt && (
          <div className="flex justify-between text-sm">
            <span className="text-white/55">Fecha</span>
            <span className="text-white/80 text-xs">
              {new Date(tx.createdAt).toLocaleString("es-AR", {
                day: "2-digit",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        )}
      </Card>

      {/* Acciones */}
      <div className="grid grid-cols-2 gap-2">
        <a href="/historial">
          <Button variant="secondary" leftIcon={<Receipt className="w-4 h-4" />}>
            Ver historial
          </Button>
        </a>
        <a href="/">
          <Button leftIcon={<Home className="w-4 h-4" />} rightIcon={<ArrowRight className="w-4 h-4" />}>
            Otro envío
          </Button>
        </a>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Mock view (cripto→fiat sin Vita real)
// ─────────────────────────────────────────────────────────────

function MockSuccessView({ order }: { order: string }) {
  return (
    <div className="space-y-6 animate-page-in">
      <StateCard
        kind="verified"
        title="¡Operación registrada!"
        description="Recibimos tu confirmación. Cuando los fondos lleguen, te avisaremos por email."
      />

      <Card className="space-y-2">
        <div className="text-xs uppercase tracking-wider text-zinc-500 font-medium">
          Referencia
        </div>
        <div className="font-mono text-xs text-white/80">#{order}</div>
      </Card>

      <div className="rounded-xl bg-blue-500/10 border border-blue-500/20 p-3 text-xs text-blue-200/90 leading-relaxed">
        🔧 <strong>Modo prueba:</strong> esta operación es simulada porque Vita aún no expone la API de cripto en producción. Todo el flujo está listo en el frontend; cuando se active, ya funciona automáticamente.
      </div>

      <div className="grid grid-cols-2 gap-2">
        <a href="/historial">
          <Button variant="secondary" leftIcon={<Receipt className="w-4 h-4" />}>
            Ver historial
          </Button>
        </a>
        <a href="/">
          <Button leftIcon={<Home className="w-4 h-4" />}>Otro envío</Button>
        </a>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Skeleton loader
// ─────────────────────────────────────────────────────────────

function SkeletonView() {
  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="text-center py-8 space-y-3">
        <div className="w-16 h-16 rounded-2xl skeleton mx-auto" />
        <div className="h-5 w-40 skeleton rounded mx-auto" />
        <div className="h-4 w-56 skeleton rounded mx-auto" />
      </Card>

      <Card className="space-y-3">
        <div className="h-3 w-32 skeleton rounded" />
        <div className="flex justify-between">
          <div className="h-4 w-20 skeleton rounded" />
          <div className="h-4 w-24 skeleton rounded" />
        </div>
        <div className="flex justify-between">
          <div className="h-4 w-20 skeleton rounded" />
          <div className="h-4 w-24 skeleton rounded" />
        </div>
      </Card>

      <div className="h-11 w-full skeleton rounded-xl" />
    </div>
  );
}
