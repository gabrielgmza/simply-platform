"use client";

import { useState } from "react";
import { X, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@simply/ui";

export default function TotpDisableModal({
  onConfirm,
  onClose,
}: {
  onConfirm: (password: string) => Promise<void>;
  onClose: () => void;
}) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleConfirm() {
    if (!password) {
      setError("Ingresá tu contraseña");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await onConfirm(password);
      onClose();
    } catch (e: any) {
      setError(e.message || "Contraseña incorrecta");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-zinc-900 border border-white/10 rounded-2xl max-w-md w-full p-6 space-y-5">
        <div className="flex items-start justify-between">
          <h3 className="font-semibold text-white">Desactivar autenticador</h3>
          <button onClick={onClose} className="text-white/60 hover:text-white" disabled={loading}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-white/70">
          Al desactivar, perdés esta capa extra de seguridad. Los códigos de respaldo se
          eliminan. Confirmá con tu contraseña actual:
        </p>

        <div>
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(null);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleConfirm();
            }}
            placeholder="Contraseña actual"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white"
            disabled={loading}
            autoFocus
          />
        </div>

        {error && (
          <div className="flex items-start gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg p-3">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex gap-2">
          <Button onClick={onClose} variant="secondary" className="flex-1" disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm} disabled={loading || !password} className="flex-1">
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2 inline" />
                Desactivando...
              </>
            ) : (
              "Desactivar"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
