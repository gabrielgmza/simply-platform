// Mapping país (ISO 3166-1 alpha-2) → moneda local (ISO 4217)

const COUNTRY_TO_CURRENCY: Record<string, string> = {
  AR: "ARS",
  UY: "UYU",
  PY: "PYG",
  CL: "CLP",
  BR: "BRL",
  PE: "PEN",
  CO: "COP",
  MX: "MXN",
  EC: "USD",     // Ecuador usa USD
  VE: "USD",     // Venezuela usa USD/cripto en práctica
  BO: "BOB",
  US: "USD",
  CA: "CAD",
  GB: "GBP",
  EU: "EUR",
  ES: "EUR",
  IT: "EUR",
  FR: "EUR",
  DE: "EUR",
  PT: "EUR",
};

const CURRENCY_LABELS: Record<string, { name: string; flag?: string }> = {
  ARS: { name: "Peso argentino", flag: "🇦🇷" },
  UYU: { name: "Peso uruguayo", flag: "🇺🇾" },
  PYG: { name: "Guaraní", flag: "🇵🇾" },
  CLP: { name: "Peso chileno", flag: "🇨🇱" },
  BRL: { name: "Real brasileño", flag: "🇧🇷" },
  PEN: { name: "Sol peruano", flag: "🇵🇪" },
  COP: { name: "Peso colombiano", flag: "🇨🇴" },
  MXN: { name: "Peso mexicano", flag: "🇲🇽" },
  BOB: { name: "Boliviano", flag: "🇧🇴" },
  USD: { name: "Dólar estadounidense", flag: "🇺🇸" },
  EUR: { name: "Euro", flag: "🇪🇺" },
  GBP: { name: "Libra esterlina", flag: "🇬🇧" },
  CAD: { name: "Dólar canadiense", flag: "🇨🇦" },
};

export function currencyForCountry(countryCode: string | null | undefined): string {
  if (!countryCode) return "USD";
  return COUNTRY_TO_CURRENCY[countryCode.toUpperCase()] || "USD";
}

export function currencyInfo(code: string): { name: string; flag?: string } {
  return CURRENCY_LABELS[code] || { name: code };
}
