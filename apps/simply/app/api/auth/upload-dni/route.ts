import { NextRequest, NextResponse } from "next/server";

const BASE = process.env.CORE_API_URL ||
  "https://simply-backend-888610796336.southamerica-east1.run.app/api/v1";

// El payload puede ser pesado (foto base64), aumentamos límites
export const maxDuration = 60;
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customerId, ...payload } = body;

    if (!customerId) {
      return NextResponse.json(
        { message: "customerId requerido" },
        { status: 400 },
      );
    }
    if (!payload.imageBase64 || !payload.side || !payload.mimeType) {
      return NextResponse.json(
        { message: "Faltan campos: imageBase64, side, mimeType" },
        { status: 400 },
      );
    }

    const res = await fetch(
      `${BASE}/identity/customers/${customerId}/dni-side`,
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
      { message: e.message || "Error subiendo documento" },
      { status: 500 },
    );
  }
}
