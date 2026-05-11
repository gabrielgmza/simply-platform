"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, User, Wallet, AlertTriangle, Copy, Check, Info } from "lucide-react";
import { Button, CardElevated, FormField, Input, Select, useSession } from "@simply/ui";
import { useKycGate } from "@/lib/hooks/useKycGate";
import { validateAddress } from "@/lib/assets";
import SavedSelector from "@/components/SavedSelector";
import type { SavedWallet, SavedBankAccount } from "@/lib/customer-book-api";

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
    label: "", // alias opcional
    confirmed: false,
  });
  const [cryptoError, setCryptoError] = useState<string | null>(null);
  const [copiedDeposit, setCopiedDeposit] = useState(false);

  const { ready: kycReady } = useKycGate();

  useEffect(() => {
    if (!kycReady) return;
    if (typeof window !== "undefined") {
      const p = sessionStorage.getItem("simply_pending_quote");
      if (!p) router.push("/");
      else setPending(JSON.parse(p));
    }
  }, [kycReady, router]);

  // ─── Identificar tipo de origen y destino ───
  const sourceKind = pending?.source?.asset?.kind; // "fiat" | "crypto"
  const destKind = pending?.destination?.asset?.kind;
  const sourceAsset = pending?.source?.asset; // {kind, currency/symbol, country/network}
  const destAsset = pending?.destination?.asset;
  const sourceMeta = pending?.source?.meta; // metadata de assets.ts (incluye name, flag, networkLabel)
  const destMeta = pending?.destination?.meta;

  const isFiatToFiat   = sourceKind === "fiat"   && destKind === "fiat";
  const isFiatToCrypto = sourceKind === "fiat"   && destKind === "crypto";
  const isCryptoToFiat = sourceKind === "crypto" && destKind === "fiat";
  // (cripto-cripto bloqueado en home)

  const needsDepositInstructions = isCryptoToFiat; // tenemos que mostrarle al user dónde mandar
  const needsBankForm = isCryptoToFiat || isFiatToFiat; // cuando destino es fiat
  const needsCryptoAddressForm = isFiatToCrypto; // cuando destino es cripto

  // ─── Validación en vivo ───
  const addressValidation = useMemo(() => {
    if (!needsCryptoAddressForm || !cryptoForm.address) return null;
    return validateAddress(cryptoForm.address.trim(), destAsset?.network || "");
  }, [cryptoForm.address, destAsset, needsCryptoAddressForm]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!pending) return;

    if (needsCryptoAddressForm) {
      const v = validateAddress(cryptoForm.address.trim(), destAsset.network);
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

    const endpointData = needsCryptoAddressForm
      ? {
          kind: "crypto_wallet",
          address: cryptoForm.address.trim(),
          label: cryptoForm.label.trim() || undefined,
          network: destAsset.network,
          symbol: destAsset.symbol,
        }
      : { kind: "bank", ...bankForm };

    if (typeof window !== "undefined") {
      sessionStorage.setItem("simply_destination_endpoint", JSON.stringify(endpointData));
    }
    router.push("/confirmar");
  }

  function copyDepositAddress() {
    const addr = mockDepositAddress(sourceAsset);
    navigator.clipboard.writeText(addr);
    setCopiedDeposit(true);
    setTimeout(() => setCopiedDeposit(false), 1800);
  }

  if (!loaded || !pending) {
    return <div className="text-center py-12 text-white/60">Cargando...</div>;
  }

  return (
    <div className="space-y-6 animate-page-in">
      <div className="text-center space-y-2">
        <div className="wizard-icon-bubble">
          {needsCryptoAddressForm ? (
            <Wallet className="w-6 h-6 text-blue-300" />
          ) : (
            <User className="w-6 h-6 text-blue-300" />
          )}
        </div>
        <h1 className="wizard-title">
          {needsCryptoAddressForm ? "Wallet de destino" : "¿Quién recibe?"}
        </h1>
        <p className="wizard-subtitle">
          {isFiatToFiat && `Datos del beneficiario · ${destMeta?.name || destAsset?.currency}`}
          {isFiatToCrypto && `Vamos a enviarte ${destMeta?.symbol} a tu wallet`}
          {isCryptoToFiat && `Datos de tu cuenta para recibir ${destAsset?.currency}`}
        </p>
      </div>

      {/* ─── Si origen es cripto: instrucciones de depósito ─── */}
      {needsDepositInstructions && (
        <CardElevated className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-white">
            <Info className="w-4 h-4 text-blue-400" />
            Cómo enviar tu {sourceAsset?.symbol}
          </div>

          <p className="text-xs text-zinc-400 leading-relaxed">
            Enviá <span className="font-mono text-white">{pending.source.amount} {sourceAsset?.symbol}</span> a la siguiente dirección.
            Vas a recibir aproximadamente <span className="font-mono text-white">{pending.quote?.beneficiaryReceives?.toFixed(2)} {destAsset?.currency}</span> en tu cuenta.
          </p>

          <div className="rounded-xl bg-black/40 border border-white/10 p-3 space-y-2">
            <div className="text-[10px] uppercase tracking-wider text-zinc-500">Red {sourceAsset?.network}</div>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-xs font-mono text-white break-all">
                {mockDepositAddress(sourceAsset)}
              </code>
              <button
                type="button"
                onClick={copyDepositAddress}
                className="shrink-0 px-2.5 py-2 rounded-lg border border-zinc-700 hover:border-zinc-500 text-zinc-300 transition flex items-center gap-1.5 text-xs"
              >
                {copiedDeposit ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedDeposit ? "Copiada" : "Copiar"}
              </button>
            </div>
          </div>

          <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-3 flex gap-2 text-xs text-amber-200/90">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>
              Enviá EXACTAMENTE en la red <strong>{sourceAsset?.network}</strong>. Otra red = pérdida total. La cotización vale hasta {new Date(pending.quote?.validUntil).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })}.
            </span>
          </div>

          <p className="text-[11px] text-zinc-500 italic">
            🔧 Por ahora la dirección es de prueba. Cuando Vita active producción, se generará una real para tu operación.
          </p>
        </CardElevated>
      )}

      <form onSubmit={handleSubmit}>
        <CardElevated className="space-y-4">
          {/* ─── Form bancario (fiat→fiat o cripto→fiat) ─── */}
          {needsBankForm && (
            <>
              {session && destAsset && (
                <SavedSelector
                  kind="bank"
                  customerId={session.customerId}
                  filter={{ country: destAsset.country, currency: destAsset.currency }}
                  onPick={(b: SavedBankAccount) => {
                    setBankForm({
                      firstName: b.beneficiaryFirstName,
                      lastName: b.beneficiaryLastName,
                      documentType: b.documentType,
                      documentNumber: b.documentNumber,
                      bankCode: b.bankCode || "",
                      accountType: b.accountType,
                      accountNumber: b.accountNumber,
                      routingNumber: b.routingNumber || "",
                      email: b.beneficiaryEmail || "",
                      phone: b.beneficiaryPhone || "",
                      purpose: "EPTOUR",
                      purposeComment: "",
                    });
                  }}
                />
              )}

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
                    onChange={(e) => setBankForm({ ...bankForm, documentNumber: e.target.value })}
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
                    onChange={(e) => setBankForm({ ...bankForm, accountType: e.target.value })}
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
                    onChange={(e) => setBankForm({ ...bankForm, accountNumber: e.target.value })}
                    placeholder="Número de cuenta"
                    required
                    className="flex-1"
                  />
                </div>
              </FormField>

              {destAsset?.country === "US" && (
                <FormField label="Routing number" hint="9 dígitos del banco USA">
                  <Input
                    value={bankForm.routingNumber}
                    onChange={(e) => setBankForm({ ...bankForm, routingNumber: e.target.value })}
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
                  onChange={(e) => setBankForm({ ...bankForm, purposeComment: e.target.value })}
                  placeholder="Apoyo familiar"
                  required
                />
              </FormField>
            </>
          )}

          {/* ─── Form cripto (fiat→cripto) ─── */}
          {needsCryptoAddressForm && (
            <>
              {session && destAsset && (
                <SavedSelector
                  kind="wallet"
                  customerId={session.customerId}
                  filter={{ symbol: destAsset.symbol, network: destAsset.network }}
                  onPick={(w: SavedWallet) => {
                    setCryptoForm({
                      address: w.address,
                      label: w.label,
                      confirmed: false,
                    });
                    setCryptoError(null);
                  }}
                />
              )}

              <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 flex gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-amber-100/90 space-y-1">
                  <p className="font-semibold">Las transacciones cripto son irreversibles</p>
                  <p className="text-amber-100/70 text-xs leading-relaxed">
                    Si la dirección o la red son incorrectas, los fondos se pierden. Verificá dos veces antes de confirmar.
                  </p>
                </div>
              </div>

              <div className="rounded-xl bg-black/40 border border-white/10 p-3 space-y-2">
                <div className="text-[10px] uppercase tracking-wider text-zinc-500">Vas a recibir</div>
                <div className="flex items-center justify-between">
                  <span className="text-base font-semibold text-white">
                    {pending.quote?.beneficiaryReceives?.toFixed(2)} {destAsset?.symbol}
                  </span>
                  <span className="text-xs text-zinc-400 font-mono">
                    {destMeta?.networkLabel || destAsset?.network}
                  </span>
                </div>
              </div>

              <FormField
                label="Dirección de tu wallet"
                hint={`Tiene que ser de la red ${destAsset?.network}`}
              >
                <Input
                  value={cryptoForm.address}
                  onChange={(e) => {
                    setCryptoForm({ ...cryptoForm, address: e.target.value });
                    setCryptoError(null);
                  }}
                  placeholder={getPlaceholder(destAsset?.network)}
                  required
                  autoFocus
                  spellCheck={false}
                  autoComplete="off"
                  className="font-mono text-xs"
                />
                {addressValidation && cryptoForm.address.length > 5 && (
                  <p className={`text-xs mt-1 ${addressValidation.valid ? "text-green-400" : "text-red-400"}`}>
                    {addressValidation.valid
                      ? `✓ Formato válido para ${destAsset?.network}`
                      : addressValidation.reason}
                  </p>
                )}
              </FormField>

              <FormField label="Etiqueta (opcional)" hint="Para que la encuentres después">
                <Input
                  value={cryptoForm.label}
                  onChange={(e) => setCryptoForm({ ...cryptoForm, label: e.target.value })}
                  placeholder="Ej: Mi Trust Wallet"
                />
              </FormField>

              <label className="flex items-start gap-3 cursor-pointer rounded-xl bg-white/5 px-3 py-3 hover:bg-white/8 transition">
                <input
                  type="checkbox"
                  checked={cryptoForm.confirmed}
                  onChange={(e) => setCryptoForm({ ...cryptoForm, confirmed: e.target.checked })}
                  className="mt-0.5 w-4 h-4 rounded accent-blue-500"
                />
                <span className="text-xs text-white/85 leading-relaxed">
                  Confirmo que la dirección y la red <strong>{destAsset?.network}</strong> son correctas. Entiendo que esta operación no se puede revertir y que enviar a una red equivocada significa pérdida total.
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

// ─── Helpers ───

function getPlaceholder(network: string): string {
  switch (network) {
    case "TRC20": return "T... (34 caracteres)";
    case "ERC20":
    case "POLYGON":
    case "BEP20": return "0x... (40 hex)";
    case "BTC": return "bc1... / 1... / 3...";
    default: return "Dirección de wallet";
  }
}

/**
 * Mock de address de depósito mientras Vita no expone el endpoint productivo.
 * Cuando esté disponible, llamamos al backend que la genera por operación.
 */
function mockDepositAddress(sourceAsset: any): string {
  if (!sourceAsset) return "";
  const network = sourceAsset.network;
  // Direcciones mock estables (NO USAR EN PRODUCCIÓN)
  const MOCK: Record<string, string> = {
    TRC20:   "TXYZSimplyDepositMockAddressTron000000",
    ERC20:   "0x000000Simply00Deposit00ERC20Address0000",
    BEP20:   "0x000000Simply00Deposit00BEP20Address0000",
    POLYGON: "0x000000Simply00Deposit00Polygon000000000",
    BTC:     "bc1qsimplymockdepositaddressbtc000000",
  };
  return MOCK[network] || "address-no-disponible";
}
