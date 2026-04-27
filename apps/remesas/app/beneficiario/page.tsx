"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, User } from "lucide-react";
import { useSession } from "@simply/ui";
import { Button, CardElevated, StepIndicator, FormField, Input, Select } from "@simply/ui";

export default function BeneficiarioPage() {
  const router = useRouter();
  const { session, loaded } = useSession();
  const [quote, setQuote] = useState<any>(null);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    documentType: "CC",
    documentNumber: "",
    bankCode: "",
    accountTypeBank: "CA",
    accountBank: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    purpose: "EPTOUR",
    purposeComentary: "",
  });

  useEffect(() => {
    if (!loaded) return;
    if (!session) {
      router.push("/");
      return;
    }
    if (typeof window !== "undefined") {
      const q = sessionStorage.getItem("simply_pending_quote");
      if (q) setQuote(JSON.parse(q));
    }
  }, [loaded, session, router]);

  function update(field: string, value: string) {
    setForm({ ...form, [field]: value });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (typeof window !== "undefined") {
      sessionStorage.setItem("simply_beneficiary", JSON.stringify(form));
    }
    router.push("/confirmar");
  }

  if (!loaded || !quote) return <div className="text-center py-12 text-white/60">Cargando...</div>;

  return (
    <div className="space-y-6">
      <StepIndicator current={2} total={5} />

      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-accent-500/15 mx-auto flex items-center justify-center">
          <User className="w-6 h-6 text-accent-400" />
        </div>
        <h1 className="text-2xl font-semibold">¿Quién recibe?</h1>
        <p className="text-sm text-white/60">Datos del beneficiario en {quote.destinationCountry}</p>
      </div>

      <form onSubmit={handleSubmit}>
        <CardElevated className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Nombre">
              <Input value={form.firstName} onChange={(e) => update("firstName", e.target.value)} required />
            </FormField>
            <FormField label="Apellido">
              <Input value={form.lastName} onChange={(e) => update("lastName", e.target.value)} required />
            </FormField>
          </div>

          <FormField label="Documento">
            <div className="flex gap-2">
              <Select value={form.documentType} onChange={(e) => update("documentType", e.target.value)} className="!w-32">
                <option value="CC">CC</option>
                <option value="CE">CE</option>
                <option value="PA">Pasaporte</option>
                <option value="RUT">RUT</option>
                <option value="CURP">CURP</option>
              </Select>
              <Input value={form.documentNumber} onChange={(e) => update("documentNumber", e.target.value)} placeholder="Número" required className="flex-1" />
            </div>
          </FormField>

          <FormField label="Banco (código)" hint="Lo obtenés del comprobante del beneficiario">
            <Input value={form.bankCode} onChange={(e) => update("bankCode", e.target.value)} placeholder="Ej: 000050" required />
          </FormField>

          <FormField label="Cuenta">
            <div className="flex gap-2">
              <Select value={form.accountTypeBank} onChange={(e) => update("accountTypeBank", e.target.value)} className="!w-28">
                <option value="CA">Ahorros</option>
                <option value="CC">Corriente</option>
                <option value="CLABE">CLABE</option>
              </Select>
              <Input value={form.accountBank} onChange={(e) => update("accountBank", e.target.value)} placeholder="Número de cuenta" required className="flex-1" />
            </div>
          </FormField>

          <FormField label="Email del beneficiario">
            <Input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="beneficiario@email.com" required />
          </FormField>

          <FormField label="Concepto">
            <Input value={form.purposeComentary} onChange={(e) => update("purposeComentary", e.target.value)} placeholder="Ej: Apoyo familiar" required />
          </FormField>

          <Button type="submit" rightIcon={<ArrowRight className="w-5 h-5" />}>
            Revisar y confirmar
          </Button>
        </CardElevated>
      </form>
    </div>
  );
}
