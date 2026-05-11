"use client";

import { useEffect, useState } from "react";
import { Smartphone, Check, Loader2, AlertCircle } from "lucide-react";
import { Button, Card } from "@simply/ui";
import {
  getTotpStatus,
  setupTotp,
  enableTotp,
  disableTotp,
  type TotpStatus,
  type TotpSetupResult,
} from "@/lib/customer-auth-api";
import TotpSetupModal from "./TotpSetupModal";
import TotpDisableModal from "./TotpDisableModal";

export default function TotpSection({ customerId }: { customerId: string }) {
  const [status, setStatus] = useState<TotpStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [setupOpen, setSetupOpen] = useState(false);
  const [setupData, setSetupData] = useState<TotpSetupResult | null>(null);
  const [disableOpen, setDisableOpen] = useState(false);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const s = await getTotpStatus(customerId);
      setStatus(s);
    } catch (e: any) {
      setError(e.message || "Error cargando TOTP");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerId]);

  async function handleStartSetup() {
    setError(null);
    try {
      const data = await setupTotp(customerId);
      setSetupData(data);
      setSetupOpen(true);
    } catch (e: any) {
      setError(e.message || "Error iniciando configuración");
    }
  }

  async function handleConfirmSetup(code: string): Promise<string[]> {
    // Devuelve los backup codes; lanza si falla
    const res = await enableTotp(customerId, code);
    await load();
    return res.backupCodes;
  }

  async function handleDisable(password: string) {
    await disableTotp(customerId, password);
    await load();
  }

  if (loading) {
    return (
      <Card>
        <div className="p-5 flex items-center text-white/60">
          <Loader2 className="w-4 h-4 animate-spin mr-2" />
          Cargando...
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <div className="p-5 space-y-4">
          <div className="flex items-center gap-2 text-white">
            <Smartphone className="w-5 h-5 text-blue-400" />
            <h3 className="font-semibold">Autenticador (TOTP)</h3>
          </div>

          {status?.enabled ? (
            <>
              <div className="flex items-center gap-2 text-sm text-emerald-400">
                <Check className="w-4 h-4" />
                <span>Autenticador activado</span>
              </div>
              <div className="text-xs text-white/50">
                Códigos de respaldo disponibles: {status.backupCodesRemaining} de 10
                {status.backupCodesRemaining <= 2 && status.backupCodesRemaining > 0 && (
                  <span className="text-amber-400 ml-2">
                    Te quedan pocos — desactivá y reactivá para generar nuevos.
                  </span>
                )}
              </div>
              <Button
                onClick={() => setDisableOpen(true)}
                variant="secondary"
                className="w-full"
              >
                Desactivar autenticador
              </Button>
            </>
          ) : (
            <>
              <p className="text-sm text-white/70">
                Usá Google Authenticator, Authy o 1Password para generar códigos sin depender
                del email. Más rápido y más seguro.
              </p>
              {error && (
                <div className="flex items-start gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
              <Button onClick={handleStartSetup} className="w-full">
                Activar autenticador
              </Button>
            </>
          )}
        </div>
      </Card>

      {setupOpen && setupData && (
        <TotpSetupModal
          data={setupData}
          onConfirm={handleConfirmSetup}
          onClose={() => {
            setSetupOpen(false);
            setSetupData(null);
          }}
        />
      )}

      {disableOpen && (
        <TotpDisableModal
          onConfirm={handleDisable}
          onClose={() => setDisableOpen(false)}
        />
      )}
    </>
  );
}
