/**
 * Catálogo de destinos posibles.
 * Cada destino sabe cómo construir su Asset y los campos que pide.
 *
 * Cuando el motor sume cripto/SEPA/etc, sumás aquí.
 */

export type DestinationCategory = "bank_latam" | "bank_us" | "crypto" | "bank_eu";

export interface DestinationOption {
  id: string;                       // 'bank_co', 'crypto_usdt_trc20', etc.
  category: DestinationCategory;
  label: string;                    // "Colombia · Banco · COP"
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

  // USA
  { id: "bank_us", category: "bank_us", label: "EE.UU. · Banco · USD (Zelle/ACH)", flag: "🇺🇸",
    asset: { kind: "fiat", currency: "USD", country: "US" }, enabled: true },

  // Crypto (próximamente, esperando confirmación de Vita)
  { id: "crypto_usdt_trc20", category: "crypto", label: "USDT · TRON (TRC20)",
    asset: { kind: "crypto", symbol: "USDT", network: "TRC20" }, enabled: false },
  { id: "crypto_usdt_erc20", category: "crypto", label: "USDT · Ethereum (ERC20)",
    asset: { kind: "crypto", symbol: "USDT", network: "ERC20" }, enabled: false },
  { id: "crypto_usdc", category: "crypto", label: "USDC · Ethereum",
    asset: { kind: "crypto", symbol: "USDC", network: "ERC20" }, enabled: false },
  { id: "crypto_btc", category: "crypto", label: "Bitcoin · BTC",
    asset: { kind: "crypto", symbol: "BTC", network: "BTC" }, enabled: false },
];

export const SOURCE_CURRENCIES = [
  { code: "USD", name: "Dólar (USD)" },
  { code: "USDT", name: "USDT (TRON)", crypto: true, network: "TRC20" },
  { code: "USDC", name: "USDC", crypto: true, network: "ERC20" },
  { code: "CLP", name: "Peso chileno" },
  { code: "COP", name: "Peso colombiano" },
];
