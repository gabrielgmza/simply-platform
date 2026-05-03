"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, User, Wallet, AlertTriangle } from "lucide-react";
import { Button, CardElevated, FormField, Input, Select, useSession } from "@simply/ui";
import { validateCryptoAddress } from "@/lib/destinations";

export default function DestinatarioPage() {
  const router = useRouter();
  const { session, loaded } = useSession();
  const [pending, setPending] = useState<any>(null);

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
    confirmed: false, // checkbox de confirmación
  });
  const [cryptoError, setCryptoError] = useState<string | null>(null);

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
    const isCrypto = pending.destination.category === "crypto";

    if (isCrypto) {
      // Validar address contra la red
      const network = pending.destination.asset.network;
      const v = validateCryptoAddress(cryptoForm.address, network);
      if (!v.valid) {
        setCryptoError(v.reason || "Dirección inválida");
        return;
      }
      if (!cryptoForm.confirmed) {
        setCryptoError("Confirmá que la dirección y la red son correctas");
        return;
      }
      setCryptoError(null);
    }

    const endpointData = isBank ? bankForm : { address: cryptoForm.address.trim() };
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
            <>
              {/* Aviso crítico */}
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 flex gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-amber-100/90 space-y-1">
                  <p className="font-semibold">Las transacciones cripto son irreversibles</p>
                  <p className="text-amber-100/70">
                    Si la dirección o la red son incorrectas, los fondos se pierden.
                    Verificá dos veces antes de confirmar.
                  </p>
                </div>
              </div>

              {/* Recordatorio de red */}
              <div className="rounded-xl bg-white/5 px-4 py-3 text-sm">
                <div className="text-white/60">Red seleccionada</div>
                <div className="font-mono font-semibold mt-0.5">
                  {pending.destination.asset.symbol} · {pending.destination.asset.network}
                </div>
              </div>

              <FormField
                label="Dirección de wallet"
                hint={`Pegá la dirección de la red ${pending.destination.asset.network}`}
              >
                <Input
                  value={cryptoForm.address}
                  onChange={(e) => {
                    setCryptoForm({ ...cryptoForm, address: e.target.value });
                    setCryptoError(null);
                  }}
                  placeholder={
                    pending.destination.asset.network === "BTC"
                      ? "bc1... / 1... / 3..."
                      : pending.destination.asset.network === "TRC20"
                      ? "T..."
                      : pending.destination.asset.network === "SOL"
                      ? "Base58 (32-44 chars)"
                      : "0x..."
                  }
                  required
                  autoFocus
                  spellCheck={false}
                  autoComplete="off"
                  className="font-mono"
                />
              </FormField>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={cryptoForm.confirmed}
                  onChange={(e) =>
                    setCryptoForm({ ...cryptoForm, confirmed: e.target.checked })
                  }
                  className="mt-1 w-4 h-4 rounded accent-accent-500"
                />
                <span className="text-sm text-white/80">
                  Confirmo que la dirección y la red ({pending.destination.asset.network})
                  son correctas. Entiendo que esta operación no se puede revertir.
                </span>
              </label>

              {cryptoError && (
                <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                  {cryptoError}
                </div>
              )}
            </>
          )}

          <Button type="submit" rightIcon={<ArrowRight className="w-5 h-5" />}>
            Revisar y confirmar
          </Button>
        </CardElevated>
      </form>
    </div>
  );
}
