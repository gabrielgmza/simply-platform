"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { Check, AlertCircle, Info, X } from "lucide-react";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextValue {
  show: (message: string, type?: ToastType) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast debe usarse dentro de <ToastProvider>");
  return ctx;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const show = useCallback((message: string, type: ToastType = "info") => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setToasts((prev) => [...prev, { id, type, message }]);
    // Auto-dismiss
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2400);
  }, []);

  const success = useCallback((message: string) => show(message, "success"), [show]);
  const error = useCallback((message: string) => show(message, "error"), [show]);
  const info = useCallback((message: string) => show(message, "info"), [show]);

  const dismiss = (id: string) => setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <ToastContext.Provider value={{ show, success, error, info }}>
      {children}
      {/* Container fijo arriba a la derecha */}
      <div className="fixed top-20 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={() => dismiss(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

const TYPE_STYLES: Record<ToastType, { bg: string; ring: string; icon: any; iconColor: string }> = {
  success: { bg: "bg-emerald-500/10", ring: "ring-emerald-500/30", icon: Check, iconColor: "text-emerald-300" },
  error:   { bg: "bg-red-500/10",     ring: "ring-red-500/30",     icon: AlertCircle, iconColor: "text-red-300" },
  info:    { bg: "bg-blue-500/10",    ring: "ring-blue-500/30",    icon: Info, iconColor: "text-blue-300" },
};

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 10);
    return () => clearTimeout(t);
  }, []);

  const style = TYPE_STYLES[toast.type];
  const Icon = style.icon;

  return (
    <div
      className={`pointer-events-auto flex items-center gap-2 px-3 py-2 rounded-xl ring-1 backdrop-blur-md ${style.bg} ${style.ring} shadow-lg transition-all duration-300 ${mounted ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}`}
      style={{ minWidth: 200, maxWidth: 360 }}
    >
      <Icon className={`w-4 h-4 ${style.iconColor} shrink-0`} />
      <span className="text-sm text-white flex-1 truncate">{toast.message}</span>
      <button onClick={onDismiss} className="text-white/40 hover:text-white shrink-0">
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
