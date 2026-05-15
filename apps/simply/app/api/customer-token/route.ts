import { NextRequest, NextResponse } from "next/server";
const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "https://simply-backend-888610796336.southamerica-east1.run.app";

async function proxy(req: NextRequest, path: string) {
  const body = await req.text();
  const res = await fetch(`${BACKEND}/api/v1/customer-token/${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    cache: "no-store",
  });
  const text = await res.text();
  return new NextResponse(text, {
    status: res.status,
    headers: { "Content-Type": res.headers.get("Content-Type") || "application/json" },
  });
}

export async function POST(req: NextRequest) {
  // Single endpoint /api/customer-token con body { action, ... }
  // O usar subrutas. Acá soporto solo short-lived.
  const url = new URL(req.url);
  return new NextResponse("Use /api/customer-token/short-lived", { status: 404 });
}
