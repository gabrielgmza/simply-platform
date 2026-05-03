/**
 * Catálogo de destinos posibles.
 * Cada destino sabe cómo construir su Asset y los campos que pide.
 */

export type DestinationCategory = "bank_latam" | "bank_us" | "crypto" | "bank_eu";

export interface DestinationOption {
  id: string;
  category: DestinationCategory;
  label: string;
  flag?: string;
  asset:
    | { kind: "fiat"; currency: string; country: string }
    | { kind: "crypto"; symbol: string; network: string };
  /** habilitado en producción (false = "próximamente") */
  enabled: boolean;
}

export const DESTINATIONS: DestinationOption[] = [
  // LatAm
  { id: "bank_cl", category: "bank_latam", label: "Chile · Banco · CLP",      flag: "🇨🇱",
    asset: { kind: "fiat", currency: "CLP", country: "CL" }, enabled: true },
  { id: "bank_co", category: "bank_latam", label: "Colombia · Banco · COP",   flag: "🇨🇴",
    asset: { kind: "fiat", currency: "COP", country: "CO" }, enabled: true },
  { id: "bank_mx", category: "bank_latam", label: "México · Banco · MXN",     flag: "🇲🇽",
    asset: { kind: "fiat", currency: "MXN", country: "MX" }, enabled: true },
  { id: "bank_pe", category: "bank_latam", label: "Perú · Banco · PEN",       flag: "🇵🇪",
    asset: { kind: "fiat", currency: "PEN", country: "PE" }, enabled: true },
  { id: "bank_ve", category: "bank_latam", label: "Venezuela · Banco · VES",  flag: "🇻🇪",
    asset: { kind: "fiat", currency: "VES", country: "VE" }, enabled: true },
  { id: "bank_ar", category: "bank_latam", label: "Argentina · Banco · ARS",  flag: "🇦🇷",
    asset: { kind: "fiat", currency: "ARS", country: "AR" }, enabled: true },
  { id: "bank_br", category: "bank_latam", label: "Brasil · Pix · BRL",       flag: "🇧🇷",
    asset: { kind: "fiat", currency: "BRL", country: "BR" }, enabled: true },

  // USA
  { id: "bank_us", category: "bank_us", label: "EE.UU. · Banco · USD (Zelle/ACH)", flag: "🇺🇸",
    asset: { kind: "fiat", currency: "USD", country: "US" }, enabled: true },

  // ───────── Crypto (HABILITADO) ─────────

  // Stablecoins (más usadas)
  { id: "crypto_usdt_trc20", category: "crypto", label: "USDT · TRON (TRC20)",
    asset: { kind: "crypto", symbol: "USDT", network: "TRC20" }, enabled: true },
  { id: "crypto_usdt_erc20", category: "crypto", label: "USDT · Ethereum (ERC20)",
    asset: { kind: "crypto", symbol: "USDT", network: "ERC20" }, enabled: true },
  { id: "crypto_usdt_bep20", category: "crypto", label: "USDT · BNB Smart Chain (BEP20)",
    asset: { kind: "crypto", symbol: "USDT", network: "BEP20" }, enabled: true },
  { id: "crypto_usdc_erc20", category: "crypto", label: "USDC · Ethereum (ERC20)",
    asset: { kind: "crypto", symbol: "USDC", network: "ERC20" }, enabled: true },
  { id: "crypto_usdc_polygon", category: "crypto", label: "USDC · Polygon",
    asset: { kind: "crypto", symbol: "USDC", network: "POLYGON" }, enabled: true },

  // L1 nativas
  { id: "crypto_btc", category: "crypto", label: "Bitcoin · BTC",
    asset: { kind: "crypto", symbol: "BTC", network: "BTC" }, enabled: true },
  { id: "crypto_eth", category: "crypto", label: "Ethereum · ETH",
    asset: { kind: "crypto", symbol: "ETH", network: "ERC20" }, enabled: true },
  { id: "crypto_sol", category: "crypto", label: "Solana · SOL",
    asset: { kind: "crypto", symbol: "SOL", network: "SOL" }, enabled: true },
  { id: "crypto_bnb", category: "crypto", label: "BNB · BNB Smart Chain",
    asset: { kind: "crypto", symbol: "BNB", network: "BEP20" }, enabled: true },
  { id: "crypto_matic", category: "crypto", label: "MATIC · Polygon",
    asset: { kind: "crypto", symbol: "MATIC", network: "POLYGON" }, enabled: true },
];

export const SOURCE_CURRENCIES = [
  // Fiat
  { code: "USD", name: "Dólar (USD)" },
  { code: "ARS", name: "Peso argentino (ARS)" },
  { code: "BRL", name: "Real brasileño (BRL)" },
  { code: "CLP", name: "Peso chileno (CLP)" },
  { code: "COP", name: "Peso colombiano (COP)" },
  { code: "MXN", name: "Peso mexicano (MXN)" },
  // Cripto
  { code: "USDT", name: "USDT (TRON)", crypto: true, network: "TRC20" },
  { code: "USDC", name: "USDC (Ethereum)", crypto: true, network: "ERC20" },
  { code: "BTC", name: "Bitcoin (BTC)", crypto: true, network: "BTC" },
  { code: "ETH", name: "Ethereum (ETH)", crypto: true, network: "ERC20" },
];

// ─────────────────────────────────────────────────────────────────
// Validación de wallet address por red
// Robado y mejorado del simply-crypto v17 (validateCryptoAddress)
// ─────────────────────────────────────────────────────────────────

/**
 * Reglas (intencionalmente conservadoras: solo bloqueamos formato grosero,
 * no chequeamos checksums; el backend hará la validación final).
 */
const ADDRESS_RULES: Record<string, { regex: RegExp; example: string }> = {
  // Tron: 34 chars, empieza con T
  TRC20:   { regex: /^T[1-9A-HJ-NP-Za-km-z]{33}$/, example: "TXYZab...aBcDef (34 chars, empieza con T)" },
  // EVM (Ethereum, Polygon, BSC, etc.): 0x + 40 hex
  ERC20:   { regex: /^0x[a-fA-F0-9]{40}$/, example: "0x...40 hex chars" },
  POLYGON: { regex: /^0x[a-fA-F0-9]{40}$/, example: "0x...40 hex chars" },
  BEP20:   { regex: /^0x[a-fA-F0-9]{40}$/, example: "0x...40 hex chars" },
  // Bitcoin: legacy 1, P2SH 3, bech32 bc1
  BTC:     { regex: /^(bc1[a-z0-9]{6,87}|[13][a-km-zA-HJ-NP-Z1-9]{25,34})$/, example: "bc1... / 1... / 3..." },
  // Solana: base58, 32-44 chars
  SOL:     { regex: /^[1-9A-HJ-NP-Za-km-z]{32,44}$/, example: "Base58, 32-44 chars" },
};

export function validateCryptoAddress(address: string, network: string): { valid: boolean; reason?: string } {
  const trimmed = (address || "").trim();
  if (!trimmed) return { valid: false, reason: "La dirección está vacía" };

  const rule = ADDRESS_RULES[network];
  if (!rule) return { valid: true }; // red desconocida: dejamos pasar, backend valida

  if (!rule.regex.test(trimmed)) {
    return { valid: false, reason: `Formato inválido para ${network}. Esperado: ${rule.example}` };
  }
  return { valid: true };
}
