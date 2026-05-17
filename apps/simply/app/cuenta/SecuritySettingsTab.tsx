"use client";

import { useEffect, useState } from "react";
import { ShieldCheck, Trash2, Smartphone, AlertCircle, Loader2 } from "lucide-react";
import { Button, Card } from "@simply/ui";
import { useStepUp } from "@/lib/use-step-up";
import TotpSection from "./TotpSection";
import PreferencesSection from "./PreferencesSection";
import {
  getSecuritySettings,
  updateSecuritySettings,
  listTrustedDevices,
  revokeTrustedDevice,
  type SecuritySettings,
  type TrustedDevice,
} from "@/lib/customer-auth-api";

export default function SecuritySettingsTab({ customerId, email }: { customerId: string; email: string }) {
  const [settings, setSettings] = useState<SecuritySettings | null>(null);
  const [devices, setDevices] = useState<TrustedDevice[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const { request: stepUp, modal: stepUpModal } = useStepUp(customerId, email);

  // Inputs editables (separados del settings para detectar dirty)
  const [alwaysOtp, setAlwaysOtp] = useState(false);
  const [otpSensitive, setOtpSensitive] = useState(true);
  const [amountUsd, setAmountUsd] = useState("500");

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const [s, d] = await Promise.all([
        getSecuritySettings(customerId),
        listTrustedDevices(customerId),
      ]);
      setSettings(s);
      setDevices(d);
      setAlwaysOtp(s.alwaysRequireOtp);
      setOtpSensitive(s.otpOnSensitiveOps);
      setAmountUsd(String(s.sensitiveAmountUsd ?? "500"));
    } catch (e: any) {
      setError(e.message || "Error cargando seguridad");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerId]);

  async function handleSave() {
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const amount = parseFloat(amountUsd);
      if (isNaN(amount) || amount < 0) {
        throw new Error("Umbral inválido");
      }
      const updated = await updateSecuritySettings(customerId, {
        alwaysRequireOtp: alwaysOtp,
        otpOnSensitiveOps: otpSensitive,
        sensitiveAmountUsd: amount,
      });
      setSettings(updated);
      setSuccess("Cambios guardados");
      setTimeout(() => setSuccess(null), 3000);
    } catch (e: any) {
      setError(e.message || "Error guardando");
    } finally {
      setSaving(false);
    }
  }

  async function handleRevoke(deviceId: string) {
    if (!confirm("¿Revocar este dispositivo? Tendrá que volver a iniciar sesión con código.")) {
      return;
    }
    // Step-up auth: pedir OTP fresco antes de revocar
    const confirmed = await stepUp({
      operationType: "revoke_device",
      operationLabel: "Revocar dispositivo",
    });
    if (!confirmed) return;
    try {
      await revokeTrustedDevice(customerId, deviceId);
      setDevices((prev) => prev.filter((d) => d.id !== deviceId));
    } catch (e: any) {
      setError(e.message || "Error revocando");
    }
  }

  const isDirty =
    settings !== null &&
    (alwaysOtp !== settings.alwaysRequireOtp ||
      otpSensitive !== settings.otpOnSensitiveOps ||
      amountUsd !== String(settings.sensitiveAmountUsd));

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 text-white/60">
        <Loader2 className="w-5 h-5 animate-spin mr-2" />
        Cargando...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ─── Toggles + umbral ─── */}
      <Card>
        <div className="p-5 space-y-5">
          <div className="flex items-center gap-2 text-white">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="font-semibold">Política de verificación</h3>
          </div>

          {/* Toggle alwaysRequireOtp */}
          <label className="flex items-start justify-between gap-4 cursor-pointer">
            <div className="flex-1">
              <div className="text-sm text-white">Pedir código en cada inicio de sesión</div>
              <div className="text-xs text-white/50 mt-0.5">
                Ignora los dispositivos de confianza. Máxima seguridad, más fricción.
              </div>
            </div>
            <input
              type="checkbox"
              checked={alwaysOtp}
              onChange={(e) => setAlwaysOtp(e.target.checked)}
              className="w-5 h-5 mt-0.5 accent-emerald-500"
            />
          </label>

          {/* Toggle otpOnSensitiveOps */}
          <label className="flex items-start justify-between gap-4 cursor-pointer">
            <div className="flex-1">
              <div className="text-sm text-white">Pedir código en operaciones sensibles</div>
              <div className="text-xs text-white/50 mt-0.5">
                Cambiar contraseña, agregar wallet, montos sobre el umbral.
              </div>
            </div>
            <input
              type="checkbox"
              checked={otpSensitive}
              onChange={(e) => setOtpSensitive(e.target.checked)}
              className="w-5 h-5 mt-0.5 accent-emerald-500"
            />
          </label>

          {/* Umbral USD */}
          <div>
            <label className="text-sm text-white">Umbral de monto sensible (USD)</label>
            <div className="text-xs text-white/50 mt-0.5 mb-2">
              Operaciones iguales o mayores requieren código.
            </div>
            <div className="flex items-center gap-2">
              <span className="text-white/60">USD</span>
              <input
                type="number"
                min="0"
                step="50"
                value={amountUsd}
                onChange={(e) => setAmountUsd(e.target.value)}
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg p-3">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="text-sm text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3">
              {success}
            </div>
          )}

          <Button
            onClick={handleSave}
            disabled={!isDirty || saving}
            className="w-full"
          >
            {saving ? "Guardando..." : "Guardar cambios"}
          </Button>
        </div>
      </Card>

      <PreferencesSection customerId={customerId} />

      <TotpSection customerId={customerId} />

      {/* ─── Trusted devices ─── */}
      <Card>
        <div className="p-5 space-y-4">
          <div className="flex items-center gap-2 text-white">
            <Smartphone className="w-5 h-5 text-blue-400" />
            <h3 className="font-semibold">Dispositivos de confianza</h3>
          </div>

          {devices.length === 0 ? (
            <div className="text-sm text-white/50 py-4 text-center">
              No tenés dispositivos de confianza activos.
            </div>
          ) : (
            <div className="space-y-2">
              {devices.map((d) => (
                <div
                  key={d.id}
                  className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-lg p-3"
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-white truncate">
                      {d.label || d.userAgent || "Dispositivo"}
                      {d.isCurrent && (
                        <span className="ml-2 text-[10px] uppercase text-emerald-400">Actual</span>
                      )}
                    </div>
                    <div className="text-xs text-white/40 truncate">
                      {d.ipAddress ? `IP ${d.ipAddress} · ` : ""}
                      Último uso: {new Date(d.lastUsedAt).toLocaleString("es-AR")}
                    </div>
                    <div className="text-xs text-white/40">
                      Expira: {new Date(d.expiresAt).toLocaleDateString("es-AR")}
                    </div>
                  </div>
                  <button
                    onClick={() => handleRevoke(d.id)}
                    className="text-red-400 hover:text-red-300 p-2 shrink-0"
                    title="Revocar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {stepUpModal()}
    </div>
  );
}
