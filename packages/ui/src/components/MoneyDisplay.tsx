interface MoneyDisplayProps {
  amount: number;
  currency: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  highlight?: boolean;
}

const SIZE_MAP = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-xl font-semibold",
  xl: "text-2xl font-semibold",
};

export function MoneyDisplay({ amount, currency, size = "md", className = "", highlight = false }: MoneyDisplayProps) {
  const formatted = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

  const colorClass = highlight ? "text-accent-400" : "";

  return (
    <span className={`${SIZE_MAP[size]} ${colorClass} ${className}`}>
      {formatted}
    </span>
  );
}
