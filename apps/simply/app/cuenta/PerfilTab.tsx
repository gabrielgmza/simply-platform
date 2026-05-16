"use client";

import { useEffect, useRef, useState } from "react";
import { useToast } from "@/components/toast/Toast";
import EmailChangeModal from "./EmailChangeModal";
import { Mail, Phone, User, IdCard, ShieldCheck, Camera, Loader2, AlertCircle, Check } from "lucide-react";
import { Card, Button } from "@simply/ui";
import { getCustomer, updateCustomer, uploadAvatar, type CustomerProfile } from "@/lib/customer-api";

export default function PerfilTab({ session }: { session: any }) {
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toast = useToast();
  const [emailModalOpen, setEmailModalOpen] = useState(false);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const p = await getCustomer(session.customerId);
      setProfile(p);
      setFirstName(p.firstName || "");
      setLastName(p.lastName || "");
      setEmail(p.email || "");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [session.customerId]);

  async function saveFields(opts: { silent?: boolean } = {}) {
    if (!profile) return;
    setSaving(true);
    setError(null);
    try {
      const updated = await updateCustomer(session.customerId, {
        firstName: firstName || null as any,
        lastName: lastName || null as any,
      });
      setProfile(updated);
      // Refrescar simply_session en localStorage
      if (typeof window !== "undefined") {
        try {
          const raw = localStorage.getItem("simply_session");
          if (raw) {
            const sess = JSON.parse(raw);
            sess.firstName = updated.firstName;
            sess.lastName = updated.lastName;
            localStorage.setItem("simply_session", JSON.stringify(sess));
          }
        } catch {}
      }
      if (!opts.silent) toast.success("Guardado");
    } catch (e: any) {
      setError(e.message || "Error guardando");
      toast.error(e.message || "Error guardando");
    } finally {
      setSaving(false);
    }
  }

  // Auto-save con debounce de 800ms al modificar nombre/apellido
  useEffect(() => {
    if (!profile) return;
    const dirty = firstName !== (profile.firstName || "") || lastName !== (profile.lastName || "");
    if (!dirty) return;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      saveFields();
    }, 800);
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstName, lastName]);

  async function handleAvatarPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError("La imagen no puede pesar más de 5MB");
      return;
    }
    setUploadingAvatar(true);
    setError(null);
    try {
      const url = await uploadAvatar(session.customerId, file);
      const updated = await updateCustomer(session.customerId, { photoUrl: url });
      setProfile(updated);
      toast.success("Foto actualizada");
    } catch (e: any) {
      setError(e.message || "Error subiendo la foto");
      toast.error(e.message || "Error subiendo la foto");
    } finally {
      setUploadingAvatar(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8 text-white/60">
        <Loader2 className="w-5 h-5 animate-spin mr-2" />
        Cargando...
      </div>
    );
  }

  const initials = `${(firstName || "?").charAt(0)}${(lastName || "").charAt(0)}`.toUpperCase();

  return (
    <>
      <div className="space-y-3">
      {/* Avatar */}
      <Card>
        <div className="p-4 flex items-center gap-4">
          <div className="relative shrink-0">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-2xl font-bold text-white overflow-hidden">
              {profile?.photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={profile.photoUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                initials
              )}
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingAvatar}
              className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-white text-zinc-900 flex items-center justify-center shadow-lg hover:bg-white/90 disabled:opacity-50"
              title="Cambiar foto"
            >
              {uploadingAvatar ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Camera className="w-4 h-4" />
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleAvatarPick}
              className="hidden"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-white truncate">
              {(firstName || "") + " " + (lastName || "")}
            </div>
            <div className="text-xs text-white/50 truncate">{email}</div>
          </div>
        </div>
      </Card>

      {/* Editable */}
      <Card>
        <div className="p-4 space-y-3">
          <div className="text-xs uppercase tracking-wider text-zinc-500 font-medium">
            Datos personales
          </div>

          <div>
            <label className="text-xs text-white/50 block mb-1">Nombre</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
              placeholder="Tu nombre"
            />
          </div>

          <div>
            <label className="text-xs text-white/50 block mb-1">Apellido</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
              placeholder="Tu apellido"
            />
          </div>

          <div>
            <label className="text-xs text-white/50 block mb-1">Email</label>
            <div className="flex gap-2 mt-1">
              <input
                type="email"
                value={email}
                readOnly
                className="flex-1 bg-white/[0.03] border border-white/10 rounded-lg px-3 py-2 text-white/70 text-sm cursor-not-allowed"
              />
              <button
                onClick={() => setEmailModalOpen(true)}
                className="text-xs text-blue-300 hover:text-blue-200 px-3 py-2 bg-blue-500/10 ring-1 ring-blue-500/30 rounded-lg"
              >
                Cambiar
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg p-3">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}
          {saving && (
            <div className="text-xs text-white/40">Guardando...</div>
          )}
        </div>
      </Card>

      {/* Solo lectura: phone, DNI */}
      {(profile?.phone || profile?.documentNumber) && (
        <Card>
          <div className="p-4 space-y-2">
            <div className="text-xs uppercase tracking-wider text-zinc-500 font-medium">
              Información verificada
            </div>
            {profile.phone && (
              <DataRow
                icon={<Phone className="w-4 h-4" />}
                label="Teléfono"
                value={`${profile.phoneCountryCode || ""} ${profile.phone}`.trim()}
              />
            )}
            {profile.documentNumber && (
              <DataRow
                icon={<IdCard className="w-4 h-4" />}
                label="Documento"
                value={`${profile.documentType || ""} ${profile.documentNumber}`.trim()}
              />
            )}
            <p className="text-[10px] text-white/40 mt-2">
              Para cambiar estos datos contactá a soporte.
            </p>
          </div>
        </Card>
      )}

      {/* KYC status */}
      <Card>
        <div className="p-4 space-y-2">
          <div className="text-xs uppercase tracking-wider text-zinc-500 font-medium">
            Verificación de identidad
          </div>
          {profile?.profileStatus === "VERIFIED_FULL" || profile?.profileStatus === "VERIFIED_BASIC" ? (
            <div className="flex items-center gap-2 text-sm text-green-300">
              <ShieldCheck className="w-5 h-5" />
              Tu identidad está verificada
            </div>
          ) : (
            <>
              <p className="text-sm text-white/70">
                Verificá tu identidad para acceder a todos los productos.
              </p>
              <a href="/registro" className="inline-block">
                <Button variant="secondary">Completar verificación</Button>
              </a>
            </>
          )}
        </div>
      </Card>
    </div>

      <EmailChangeModal
        customerId={session.customerId}
        currentEmail={email}
        open={emailModalOpen}
        onClose={() => setEmailModalOpen(false)}
        onSuccess={(newEmail) => {
          setEmail(newEmail);
          setProfile((p) => p ? { ...p, email: newEmail, emailVerified: true } : p);
          if (typeof window !== "undefined") {
            try {
              const raw = localStorage.getItem("simply_session");
              if (raw) {
                const sess = JSON.parse(raw);
                sess.email = newEmail;
                localStorage.setItem("simply_session", JSON.stringify(sess));
              }
            } catch {}
          }
        }}
      />
    </>
  );
}

function DataRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
      <div className="text-zinc-500">{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="text-[10px] uppercase tracking-wider text-zinc-500">{label}</div>
        <div className="text-sm text-white truncate">{value}</div>
      </div>
    </div>
  );
}
