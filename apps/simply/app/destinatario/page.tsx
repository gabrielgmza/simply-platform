"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, User, Wallet } from "lucide-react";
import { Button, CardElevated, FormField, Input, Select, useSession } from "@simply/ui";

export default function DestinatarioPage() {
  const router = useRouter();
  const { session, loaded } = useSession();
  const [pending, setPending] = useState<any>(null);

  // Form genérico: lo populan los inputs según el tipo de destino
  const [bankForm, setBankForm] = useState({
    firstName: "",
    lastName: "",
    documentType: "CC",
    documentNumber: "",
    bankCode: "",
    accountType: "CA",
    accountNumber: "",
    routingNumber: "",
    email: "",
    phone: "",
    purpose: "EPTOUR",
    purposeComment: "",
  });

  const [cryptoForm, setCryptoForm] = useState({
    address: "",
  });

  useEffect(() => {
    if (!loaded) return;
    if (!session) {
      router.push("/");
      return;
    }
    if (typeof window !== "undefined") {
      const p = sessionStorage.getItem("simply_pending_quote");
      if (!p) router.push("/");
      else setPending(JSON.parse(p));
    }
  }, [loaded, session, router]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!pending) return;
    const isBank = pending.destination.category.startsWith("bank");
    const endpointData = isBank ? bankForm : cryptoForm;
    if (typeof window !== "undefined") {
      sessionStorage.setItem("simply_destination_endpoint", JSON.stringify(endpointData));
    }
    router.push("/confirmar");
  }

  if (!loaded || !pending)
    return <div className="text-center py-12 text-white/60">Cargando...</div>;

  const isBank = pending.destination.category.startsWith("bank");
  const isCrypto = pending.destination.category === "crypto";

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-accent-500/15 mx-auto flex items-center justify-center">
          {isCrypto ? (
            <Wallet className="w-6 h-6 text-accent-400" />
          ) : (
            <User className="w-6 h-6 text-accent-400" />
          )}
        </div>
        <h1 className="text-2xl font-semibold">¿Quién recibe?</h1>
        <p className="text-sm text-white/60">
          {isBank ? `Datos del beneficiario · ${pending.destination.label}` : "Wallet de destino"}
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <CardElevated className="space-y-4">
          {isBank && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Nombre">
                  <Input
                    value={bankForm.firstName}
                    onChange={(e) => setBankForm({ ...bankForm, firstName: e.target.value })}
                    required
                  />
                </FormField>
                <FormField label="Apellido">
                  <Input
                    value={bankForm.lastName}
                    onChange={(e) => setBankForm({ ...bankForm, lastName: e.target.value })}
                    required
                  />
                </FormField>
              </div>

              <FormField label="Documento">
                <div className="flex gap-2">
                  <Select
                    value={bankForm.documentType}
                    onChange={(e) => setBankForm({ ...bankForm, documentType: e.target.value })}
                    className="!w-32"
                  >
                    <option value="CC">CC</option>
                    <option value="CE">CE</option>
                    <option value="PA">Pasaporte</option>
                    <option value="DNI">DNI</option>
                    <option value="RUT">RUT</option>
                    <option value="CURP">CURP</option>
                  </Select>
                  <Input
                    value={bankForm.documentNumber}
                    onChange={(e) =>
                      setBankForm({ ...bankForm, documentNumber: e.target.value })
                    }
                    placeholder="Número"
                    required
                    className="flex-1"
                  />
                </div>
              </FormField>

              <FormField label="Banco (código)">
                <Input
                  value={bankForm.bankCode}
                  onChange={(e) => setBankForm({ ...bankForm, bankCode: e.target.value })}
                  placeholder="Ej: 000050"
                  required
                />
              </FormField>

              <FormField label="Cuenta">
                <div className="flex gap-2">
                  <Select
                    value={bankForm.accountType}
                    onChange={(e) =>
                      setBankForm({ ...bankForm, accountType: e.target.value })
                    }
                    className="!w-32"
                  >
                    <option value="CA">Ahorros</option>
                    <option value="CC">Corriente</option>
                    <option value="CLABE">CLABE</option>
                    <option value="CHECKING">Checking (US)</option>
                    <option value="SAVINGS">Savings (US)</option>
                  </Select>
                  <Input
                    value={bankForm.accountNumber}
                    onChange={(e) =>
                      setBankForm({ ...bankForm, accountNumber: e.target.value })
                    }
                    placeholder="Número de cuenta"
                    required
                    className="flex-1"
                  />
                </div>
              </FormField>

              {pending.destination.asset.country === "US" && (
                <FormField label="Routing number" hint="9 dígitos del banco USA">
                  <Input
                    value={bankForm.routingNumber}
                    onChange={(e) =>
                      setBankForm({ ...bankForm, routingNumber: e.target.value })
                    }
                    required
                  />
                </FormField>
              )}

              <FormField label="Email del beneficiario">
                <Input
                  type="email"
                  value={bankForm.email}
                  onChange={(e) => setBankForm({ ...bankForm, email: e.target.value })}
                  placeholder="beneficiario@email.com"
                  required
                />
              </FormField>

              <FormField label="Concepto">
                <Input
                  value={bankForm.purposeComment}
                  onChange={(e) =>
                    setBankForm({ ...bankForm, purposeComment: e.target.value })
                  }
                  placeholder="Apoyo familiar"
                  required
                />
              </FormField>
            </>
          )}

          {isCrypto && (
            <FormField label="Dirección de wallet" hint="Asegurate de poner la red correcta">
              <Input
                value={cryptoForm.address}
                onChange={(e) => setCryptoForm({ ...cryptoForm, address: e.target.value })}
                placeholder="0x... o T..."
                required
                autoFocus
              />
            </FormField>
          )}

          <Button type="submit" rightIcon={<ArrowRight className="w-5 h-5" />}>
            Revisar y confirmar
          </Button>
        </CardElevated>
      </form>
    </div>
  );
}
