import { CheckCircle2, Clock, Loader2, AlertCircle, XCircle } from "lucide-react";

type Status = "started" | "processed" | "pending" | "completed" | "denied" | "failed";

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: any; spin?: boolean }> = {
  started:   { label: "Iniciada",    color: "text-blue-400",   bg: "bg-blue-500/10",   icon: Loader2, spin: true },
  processed: { label: "Procesada",   color: "text-blue-400",   bg: "bg-blue-500/10",   icon: Loader2, spin: true },
  pending:   { label: "Pendiente",   color: "text-amber-400",  bg: "bg-amber-500/10",  icon: Clock },
  completed: { label: "Completada",  color: "text-green-400",  bg: "bg-green-500/10",  icon: CheckCircle2 },
  denied:    { label: "Rechazada",   color: "text-red-400",    bg: "bg-red-500/10",    icon: AlertCircle },
  failed:    { label: "Fallida",     color: "text-red-400",    bg: "bg-red-500/10",    icon: XCircle },
};

interface StatusBadgeProps {
  status: Status | string;
  showIcon?: boolean;
}

export function StatusBadge({ status, showIcon = true }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.started;
  const Icon = config.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs ${config.bg} ${config.color}`}>
      {showIcon && <Icon className={`w-3 h-3 ${config.spin ? "animate-spin" : ""}`} />}
      {config.label}
    </span>
  );
}
