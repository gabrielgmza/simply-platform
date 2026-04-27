export function formatMoney(amount: number, currency: string): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export const COUNTRIES = [
  { code: "CL", name: "Chile",     flag: "🇨🇱", currency: "CLP" },
  { code: "CO", name: "Colombia",  flag: "🇨🇴", currency: "COP" },
  { code: "MX", name: "México",    flag: "🇲🇽", currency: "MXN" },
  { code: "VE", name: "Venezuela", flag: "🇻🇪", currency: "VES" },
  { code: "PE", name: "Perú",      flag: "🇵🇪", currency: "PEN" },
];

export const SOURCE_CURRENCIES = [
  { code: "USD", name: "Dólar estadounidense", symbol: "US$" },
  { code: "CLP", name: "Peso chileno",         symbol: "CLP$" },
  { code: "COP", name: "Peso colombiano",      symbol: "COP$" },
];
