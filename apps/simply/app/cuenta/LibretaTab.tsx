"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Wallet, Banknote, Copy, Check, Loader2 } from "lucide-react";
import { Button, Card, FormField, Input, Select } from "@simply/ui";
import {
  listWallets,
  createWallet,
  deleteWallet,
  listBanks,
  createBank,
  deleteBank,
  type SavedWallet,
  type SavedBankAccount,
} from "@/lib/customer-book-api";
import { CRYPTO_ASSETS, FIAT_ASSETS, validateAddress } from "@/lib/assets";

type SubTab = "wallets" | "banks";

export default function LibretaTab({ customerId }: { customerId: string }) {
  const [sub, setSub] = useState<SubTab>("wallets");

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-1 p-1 bg-zinc-900 rounded-2xl border border-white/5">
        <button
          onClick={() => setSub("wallets")}
          className={`px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition ${
            sub === "wallets"
              ? "bg-blue-500/15 text-blue-200 border border-blue-500/30"
              : "text-zinc-400 hover:text-white border border-transparent"
          }`}
        >
          <Wallet className="w-3.5 h-3.5" /> Wallets cripto
        </button>
        <button
          onClick={() => setSub("banks")}
          className={`px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition ${
            sub === "banks"
              ? "bg-blue-500/15 text-blue-200 border border-blue-500/30"
              : "text-zinc-400 hover:text-white border border-transparent"
          }`}
        >
          <Banknote className="w-3.5 h-3.5" /> Cuentas bancarias
        </button>
      </div>

      {sub === "wallets" && <WalletsSection customerId={customerId} />}
      {sub === "banks" && <BanksSection customerId={customerId} />}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Wallets
// ─────────────────────────────────────────────────────────────

function WalletsSection({ customerId }: { customerId: string }) {
  const [items, setItems] = useState<SavedWallet[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    void load();
  }, [customerId]);

  async function load() {
    try {
      const data = await listWallets(customerId);
      setItems(data);
    } catch (e: any) {
      setError(e.message);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar esta wallet?")) return;
    try {
      await deleteWallet(customerId, id);
      void load();
    } catch (e: any) {
      alert(e.message);
    }
  }

  if (items === null) {
    return (
      <div className="text-center py-8 text-zinc-500 flex items-center justify-center gap-2 text-sm">
        <Loader2 className="w-4 h-4 animate-spin" /> Cargando…
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {error && (
        <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl p-3">
          {error}
        </div>
      )}

      {items.length === 0 && !showForm && (
        <Card className="text-center py-6 space-y-3">
          <Wallet className="w-10 h-10 text-zinc-600 mx-auto" />
          <p className="text-sm text-white/60">
            No tenés wallets guardadas.
          </p>
          <Button onClick={() => setShowForm(true)} leftIcon={<Plus className="w-4 h-4" />} fullWidth={false}>
            Agregar wallet
          </Button>
        </Card>
      )}

      {items.length > 0 && (
        <>
          {items.map((w) => (
            <WalletRow key={w.id} wallet={w} onDelete={() => handleDelete(w.id)} />
          ))}
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="w-full rounded-2xl border border-dashed border-zinc-700 hover:border-blue-500 text-zinc-400 hover:text-blue-300 py-3 text-sm flex items-center justify-center gap-1.5 transition"
            >
              <Plus className="w-4 h-4" /> Agregar wallet
            </button>
          )}
        </>
      )}

      {showForm && (
        <NewWalletForm
          customerId={customerId}
          onCancel={() => setShowForm(false)}
          onCreated={() => {
            setShowForm(false);
            void load();
          }}
        />
      )}
    </div>
  );
}

function WalletRow({ wallet, onDelete }: { wallet: SavedWallet; onDelete: () => void }) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(wallet.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <Card className="space-y-2.5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-600/20 border border-blue-500/30 text-[10px] font-bold text-blue-300 shrink-0">
              {wallet.symbol.slice(0, 3)}
            </span>
            <span className="text-sm font-semibold text-white truncate">{wallet.label}</span>
          </div>
          <div className="mt-1 text-xs text-zinc-400">
            {wallet.symbol} · {wallet.network}
          </div>
        </div>
        <button
          onClick={onDelete}
          className="shrink-0 p-2 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition"
          aria-label="Eliminar wallet"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center gap-2 bg-black/40 border border-white/5 rounded-lg px-2.5 py-1.5">
        <code className="flex-1 text-[10px] font-mono text-white/80 break-all">{wallet.address}</code>
        <button
          onClick={copy}
          className="shrink-0 text-zinc-400 hover:text-white transition"
          aria-label="Copiar dirección"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>
    </Card>
  );
}

function NewWalletForm({
  customerId,
  onCancel,
  onCreated,
}: {
  customerId: string;
  onCancel: () => void;
  onCreated: () => void;
}) {
  const [label, setLabel] = useState("");
  const [assetId, setAssetIdLocal] = useState(CRYPTO_ASSETS[0].symbol + "-" + CRYPTO_ASSETS[0].network);
  const [address, setAddress] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [symbol, network] = assetId.split("-");
  const validation = address.length > 5 ? validateAddress(address.trim(), network) : null;

  async function handleSave() {
    setError(null);
    if (!label.trim()) {
      setError("Poneles una etiqueta para identificarla");
      return;
    }
    const v = validateAddress(address.trim(), network);
    if (!v.valid) {
      setError(v.reason || "Dirección inválida");
      return;
    }
    setSaving(true);
    try {
      await createWallet(customerId, { label, symbol, network, address: address.trim() });
      onCreated();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card className="space-y-3 border-blue-500/20 bg-blue-500/5">
      <div className="text-xs uppercase tracking-wider text-blue-300 font-medium">
        Nueva wallet
      </div>

      <FormField label="Etiqueta">
        <Input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Ej: Mi Trust Wallet"
          autoFocus
        />
      </FormField>

      <FormField label="Cripto y red">
        <Select value={assetId} onChange={(e) => setAssetIdLocal(e.target.value)}>
          {CRYPTO_ASSETS.filter((a) => a.enabled).map((a) => (
            <option key={`${a.symbol}-${a.network}`} value={`${a.symbol}-${a.network}`}>
              {a.symbol} · {a.networkLabel}
            </option>
          ))}
        </Select>
      </FormField>

      <FormField label="Dirección">
        <Input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder={
            network === "TRC20" ? "T..." :
            network === "BTC" ? "bc1... / 1... / 3..." :
            "0x..."
          }
          spellCheck={false}
          autoComplete="off"
          className="font-mono text-xs"
        />
        {validation && (
          <p className={`text-xs mt-1 ${validation.valid ? "text-green-400" : "text-red-400"}`}>
            {validation.valid ? `✓ Formato válido para ${network}` : validation.reason}
          </p>
        )}
      </FormField>

      {error && (
        <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-2">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-2">
        <Button variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button onClick={handleSave} loading={saving}>
          Guardar
        </Button>
      </div>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────
// Bancos
// ─────────────────────────────────────────────────────────────

function BanksSection({ customerId }: { customerId: string }) {
  const [items, setItems] = useState<SavedBankAccount[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    void load();
  }, [customerId]);

  async function load() {
    try {
      const data = await listBanks(customerId);
      setItems(data);
    } catch (e: any) {
      setError(e.message);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar esta cuenta bancaria?")) return;
    try {
      await deleteBank(customerId, id);
      void load();
    } catch (e: any) {
      alert(e.message);
    }
  }

  if (items === null) {
    return (
      <div className="text-center py-8 text-zinc-500 flex items-center justify-center gap-2 text-sm">
        <Loader2 className="w-4 h-4 animate-spin" /> Cargando…
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {error && (
        <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl p-3">
          {error}
        </div>
      )}

      {items.length === 0 && !showForm && (
        <Card className="text-center py-6 space-y-3">
          <Banknote className="w-10 h-10 text-zinc-600 mx-auto" />
          <p className="text-sm text-white/60">
            No tenés cuentas bancarias guardadas.
          </p>
          <Button onClick={() => setShowForm(true)} leftIcon={<Plus className="w-4 h-4" />} fullWidth={false}>
            Agregar cuenta
          </Button>
        </Card>
      )}

      {items.length > 0 && (
        <>
          {items.map((b) => (
            <BankRow key={b.id} bank={b} onDelete={() => handleDelete(b.id)} />
          ))}
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="w-full rounded-2xl border border-dashed border-zinc-700 hover:border-blue-500 text-zinc-400 hover:text-blue-300 py-3 text-sm flex items-center justify-center gap-1.5 transition"
            >
              <Plus className="w-4 h-4" /> Agregar cuenta
            </button>
          )}
        </>
      )}

      {showForm && (
        <NewBankForm
          customerId={customerId}
          onCancel={() => setShowForm(false)}
          onCreated={() => {
            setShowForm(false);
            void load();
          }}
        />
      )}
    </div>
  );
}

function BankRow({ bank, onDelete }: { bank: SavedBankAccount; onDelete: () => void }) {
  const flagMap: Record<string, string> = {
    AR: "🇦🇷", BR: "🇧🇷", CL: "🇨🇱", CO: "🇨🇴", MX: "🇲🇽",
    PE: "🇵🇪", VE: "🇻🇪", US: "🇺🇸", EU: "🇪🇺", CN: "🇨🇳",
  };
  return (
    <Card className="space-y-2.5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-base shrink-0">{flagMap[bank.country] || "🏦"}</span>
            <span className="text-sm font-semibold text-white truncate">{bank.label}</span>
          </div>
          <div className="mt-1 text-xs text-zinc-400 truncate">
            {bank.beneficiaryFirstName} {bank.beneficiaryLastName} · {bank.currency}
          </div>
          <div className="mt-0.5 text-xs text-zinc-500 truncate">
            {bank.bankCode && `${bank.bankCode} · `}Cta. {bank.accountNumber}
          </div>
        </div>
        <button
          onClick={onDelete}
          className="shrink-0 p-2 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition"
          aria-label="Eliminar cuenta"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </Card>
  );
}

function NewBankForm({
  customerId,
  onCancel,
  onCreated,
}: {
  customerId: string;
  onCancel: () => void;
  onCreated: () => void;
}) {
  const [form, setForm] = useState({
    label: "",
    country: "CO",
    currency: "COP",
    beneficiaryFirstName: "",
    beneficiaryLastName: "",
    documentType: "CC",
    documentNumber: "",
    beneficiaryEmail: "",
    beneficiaryPhone: "",
    bankCode: "",
    accountType: "CA",
    accountNumber: "",
    routingNumber: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function update<K extends keyof typeof form>(k: K, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  // Auto-ajustar currency cuando cambian country
  useEffect(() => {
    const f = FIAT_ASSETS.find((a) => a.country === form.country);
    if (f) update("currency", f.currency);
  }, [form.country]);

  async function handleSave() {
    setError(null);
    if (!form.label.trim() || !form.beneficiaryFirstName.trim() || !form.accountNumber.trim()) {
      setError("Completá los campos obligatorios");
      return;
    }
    setSaving(true);
    try {
      await createBank(customerId, {
        ...form,
        beneficiaryEmail: form.beneficiaryEmail || null,
        beneficiaryPhone: form.beneficiaryPhone || null,
        bankCode: form.bankCode || null,
        routingNumber: form.routingNumber || null,
      } as any);
      onCreated();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card className="space-y-3 border-blue-500/20 bg-blue-500/5">
      <div className="text-xs uppercase tracking-wider text-blue-300 font-medium">
        Nueva cuenta bancaria
      </div>

      <FormField label="Etiqueta">
        <Input
          value={form.label}
          onChange={(e) => update("label", e.target.value)}
          placeholder="Ej: Mamá en Colombia"
          autoFocus
        />
      </FormField>

      <FormField label="País">
        <Select value={form.country} onChange={(e) => update("country", e.target.value)}>
          {FIAT_ASSETS.filter((a) => a.enabled).map((a) => (
            <option key={a.country} value={a.country}>
              {a.flag} {a.name} ({a.currency})
            </option>
          ))}
        </Select>
      </FormField>

      <div className="grid grid-cols-2 gap-2">
        <FormField label="Nombre">
          <Input value={form.beneficiaryFirstName} onChange={(e) => update("beneficiaryFirstName", e.target.value)} />
        </FormField>
        <FormField label="Apellido">
          <Input value={form.beneficiaryLastName} onChange={(e) => update("beneficiaryLastName", e.target.value)} />
        </FormField>
      </div>

      <FormField label="Documento">
        <div className="flex gap-2">
          <Select value={form.documentType} onChange={(e) => update("documentType", e.target.value)} className="!w-32">
            <option value="CC">CC</option>
            <option value="CE">CE</option>
            <option value="DNI">DNI</option>
            <option value="RUT">RUT</option>
            <option value="CURP">CURP</option>
            <option value="PASSPORT">Pasaporte</option>
          </Select>
          <Input
            value={form.documentNumber}
            onChange={(e) => update("documentNumber", e.target.value)}
            placeholder="Número"
            className="flex-1"
          />
        </div>
      </FormField>

      <FormField label="Banco (código)">
        <Input
          value={form.bankCode}
          onChange={(e) => update("bankCode", e.target.value)}
          placeholder="Ej: 000050"
        />
      </FormField>

      <FormField label="Cuenta">
        <div className="flex gap-2">
          <Select value={form.accountType} onChange={(e) => update("accountType", e.target.value)} className="!w-32">
            <option value="CA">Ahorros</option>
            <option value="CC">Corriente</option>
            <option value="CLABE">CLABE</option>
            <option value="CHECKING">Checking</option>
            <option value="SAVINGS">Savings</option>
          </Select>
          <Input
            value={form.accountNumber}
            onChange={(e) => update("accountNumber", e.target.value)}
            placeholder="Número"
            className="flex-1"
          />
        </div>
      </FormField>

      {form.country === "US" && (
        <FormField label="Routing number" hint="9 dígitos">
          <Input value={form.routingNumber} onChange={(e) => update("routingNumber", e.target.value)} />
        </FormField>
      )}

      <FormField label="Email beneficiario (opcional)">
        <Input type="email" value={form.beneficiaryEmail} onChange={(e) => update("beneficiaryEmail", e.target.value)} />
      </FormField>

      {error && (
        <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-2">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-2">
        <Button variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button onClick={handleSave} loading={saving}>
          Guardar
        </Button>
      </div>
    </Card>
  );
}
