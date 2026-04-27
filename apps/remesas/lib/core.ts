const BASE = process.env.CORE_API_URL ||
  "https://simply-backend-888610796336.southamerica-east1.run.app/api/v1";

export async function coreGet<T = any>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Core GET ${path}: ${res.status}`);
  return res.json();
}

export async function corePost<T = any>(path: string, body: any): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Core POST ${path}: ${res.status} ${txt}`);
  }
  return res.json();
}
