const API = process.env.NEXT_PUBLIC_PAYSUR_CORE_URL || "https://simply-backend-888610796336.southamerica-east1.run.app";

export type TextSize = "small" | "normal" | "large" | "xlarge";

export interface CustomerPreferences {
  customerId: string;
  sessionTimeoutMinutes: number;
  textSize: TextSize;
  highContrast: boolean;
  reducedMotion: boolean;
}

export async function getPreferences(customerId: string): Promise<CustomerPreferences> {
  const r = await fetch(`${API}/api/v1/customer/${customerId}/preferences`);
  if (!r.ok) throw new Error("Error cargando preferencias");
  return r.json();
}

export async function updatePreferences(
  customerId: string,
  patch: Partial<Pick<CustomerPreferences, "sessionTimeoutMinutes" | "textSize" | "highContrast" | "reducedMotion">>,
): Promise<CustomerPreferences> {
  const r = await fetch(`${API}/api/v1/customer/${customerId}/preferences`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
  if (!r.ok) throw new Error("Error guardando preferencias");
  return r.json();
}
