/**
 * Catálogo unificado de assets que el wizard puede usar como ORIGEN o DESTINO.
 * Reemplaza la lógica vieja de SOURCE_CURRENCIES + DESTINATIONS partidos.
 */

export type AssetKind = "fiat" | "crypto";

export type FiatAssetMeta = {
  kind: "fiat";
  /** ISO currency code (USD, ARS, ...) */
  currency: string;
  /** ISO country code (US, AR, ...) */
  country: string;
  /** Etiqueta humana */
  name: string;
  /** Bandera emoji */
  flag: string;
  /** Símbolo monetario */
  symbol?: string;
  /** Habilitado para envío Y recepción */
  enabled: boolean;
};

export type CryptoAssetMeta = {
  kind: "crypto";
  /** Símbolo (USDT, USDC, BTC, ...) */
  symbol: string;
  /** Nombre de la red (TRC20, ERC20, ...) */
  network: string;
  /** Etiqueta humana */
  name: string;
  /** Etiqueta de la red para UI */
  networkLabel: string;
  /** Velocidad de la red */
  speed: "fast" | "medium" | "slow";
  /** Costo aprox del envío en la red */
  feeHint: string;
  enabled: boolean;
};

export type AssetMeta = FiatAssetMeta | CryptoAssetMeta;

/** ID único: para fiat = "fiat-USD-US", para crypto = "crypto-USDT-TRC20" */
export function assetId(a: AssetMeta): string {
  if (a.kind === "fiat") return `fiat-${a.currency}-${a.country}`;
  return `crypto-${a.symbol}-${a.network}`;
}

/** Para mandar al backend transfer-engine */
export function toBackendAsset(a: AssetMeta) {
  if (a.kind === "fiat") {
    return { kind: "fiat", currency: a.currency, country: a.country };
  }
  return { kind: "crypto", symbol: a.symbol, network: a.network };
}

// ─────────────────────────────────────────────────────────────────
// Catálogo
// ─────────────────────────────────────────────────────────────────

export const FIAT_ASSETS: FiatAssetMeta[] = [
  { kind: "fiat", currency: "USD", country: "US", name: "Dólar estadounidense", flag: "🇺🇸", symbol: "$",  enabled: true },
  { kind: "fiat", currency: "ARS", country: "AR", name: "Peso argentino",       flag: "🇦🇷", symbol: "$",  enabled: true },
  { kind: "fiat", currency: "BRL", country: "BR", name: "Real brasileño",       flag: "🇧🇷", symbol: "R$", enabled: true },
  { kind: "fiat", currency: "CLP", country: "CL", name: "Peso chileno",         flag: "🇨🇱", symbol: "$",  enabled: true },
  { kind: "fiat", currency: "COP", country: "CO", name: "Peso colombiano",      flag: "🇨🇴", symbol: "$",  enabled: true },
  { kind: "fiat", currency: "MXN", country: "MX", name: "Peso mexicano",        flag: "🇲🇽", symbol: "$",  enabled: true },
  { kind: "fiat", currency: "PEN", country: "PE", name: "Sol peruano",          flag: "🇵🇪", symbol: "S/", enabled: true },
  { kind: "fiat", currency: "VES", country: "VE", name: "Bolívar venezolano",   flag: "🇻🇪", symbol: "Bs", enabled: true },
  { kind: "fiat", currency: "EUR", country: "EU", name: "Euro",                 flag: "🇪🇺", symbol: "€",  enabled: false },
  { kind: "fiat", currency: "CNY", country: "CN", name: "Yuan chino",           flag: "🇨🇳", symbol: "¥",  enabled: false },
];

export const CRYPTO_ASSETS: CryptoAssetMeta[] = [
  // USDT
  { kind: "crypto", symbol: "USDT", network: "TRC20",   name: "Tether USD",      networkLabel: "Tron (TRC20)",     speed: "fast",   feeHint: "≈ $1",   enabled: true },
  { kind: "crypto", symbol: "USDT", network: "ERC20",   name: "Tether USD",      networkLabel: "Ethereum (ERC20)", speed: "slow",   feeHint: "≈ $6",   enabled: true },
  { kind: "crypto", symbol: "USDT", network: "BEP20",   name: "Tether USD",      networkLabel: "BSC (BEP20)",      speed: "fast",   feeHint: "≈ $0.8", enabled: true },
  { kind: "crypto", symbol: "USDT", network: "POLYGON", name: "Tether USD",      networkLabel: "Polygon",          speed: "fast",   feeHint: "≈ $0.5", enabled: true },
  // USDC
  { kind: "crypto", symbol: "USDC", network: "ERC20",   name: "USD Coin",        networkLabel: "Ethereum (ERC20)", speed: "slow",   feeHint: "≈ $6",   enabled: true },
  { kind: "crypto", symbol: "USDC", network: "POLYGON", name: "USD Coin",        networkLabel: "Polygon",          speed: "fast",   feeHint: "≈ $0.5", enabled: true },
  { kind: "crypto", symbol: "USDC", network: "TRC20",   name: "USD Coin",        networkLabel: "Tron (TRC20)",     speed: "fast",   feeHint: "≈ $1",   enabled: true },
  // BTC
  { kind: "crypto", symbol: "BTC",  network: "BTC",     name: "Bitcoin",         networkLabel: "Bitcoin",          speed: "medium", feeHint: "≈ 0.0002 BTC", enabled: true },
];

export const ALL_ASSETS: AssetMeta[] = [...FIAT_ASSETS, ...CRYPTO_ASSETS];

// ─────────────────────────────────────────────────────────────────
// Validación de wallet por red
// ─────────────────────────────────────────────────────────────────

const ADDRESS_RULES: Record<string, { regex: RegExp; example: string }> = {
  TRC20:   { regex: /^T[1-9A-HJ-NP-Za-km-z]{33}$/,                            example: "T... (34 chars)" },
  ERC20:   { regex: /^0x[a-fA-F0-9]{40}$/,                                    example: "0x... (40 hex)" },
  POLYGON: { regex: /^0x[a-fA-F0-9]{40}$/,                                    example: "0x... (40 hex)" },
  BEP20:   { regex: /^0x[a-fA-F0-9]{40}$/,                                    example: "0x... (40 hex)" },
  BTC:     { regex: /^(bc1[a-z0-9]{6,87}|[13][a-km-zA-HJ-NP-Z1-9]{25,34})$/, example: "bc1... / 1... / 3..." },
};

export function validateAddress(address: string, network: string): { valid: boolean; reason?: string } {
  const t = (address || "").trim();
  if (!t) return { valid: false, reason: "Ingresá una dirección" };
  const rule = ADDRESS_RULES[network];
  if (!rule) return { valid: true };
  if (!rule.regex.test(t)) {
    return { valid: false, reason: `Formato inválido para ${network}. Esperado: ${rule.example}` };
  }
  return { valid: true };
}

/** Combinaciones que el backend NO soporta hoy (multi-hop pendiente) */
export function isCombinationSupported(source: AssetMeta, dest: AssetMeta): { ok: boolean; reason?: string } {
  // Misma cosa = no tiene sentido
  if (assetId(source) === assetId(dest)) {
    return { ok: false, reason: "Origen y destino son iguales" };
  }
  // Multi-hop crypto → fiat no-USD: no funciona aún
  if (source.kind === "crypto" && dest.kind === "fiat" && dest.currency !== "USD") {
    return {
      ok: false,
      reason: `${source.symbol} → ${dest.currency} estará disponible pronto. Por ahora podés vender ${source.symbol} a USD.`,
    };
  }
  return { ok: true };
}
