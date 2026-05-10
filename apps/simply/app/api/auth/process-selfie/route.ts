import { NextRequest, NextResponse } from "next/server";

const BASE = process.env.CORE_API_URL ||
  "https://simply-backend-888610796336.southamerica-east1.run.app/api/v1";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { customerId, ...payload } = await req.json();
    if (!customerId || !payload.gcsPath || !payload.mimeType) {
      return NextResponse.json(
        { message: "Faltan campos: gcsPath, mimeType" },
        { status: 400 },
      );
    }
    const res = await fetch(
      `${BASE}/identity/customers/${customerId}/process-uploaded-selfie`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        cache: "no-store",
      },
    );
    const text = await res.text();
    let data: any;
    try { data = JSON.parse(text); } catch { data = { message: text }; }
    return NextResponse.json(data, { status: res.status });
  } catch (e: any) {
    return NextResponse.json(
      { message: e.message || "Error procesando selfie" },
      { status: 500 },
    );
  }
}
