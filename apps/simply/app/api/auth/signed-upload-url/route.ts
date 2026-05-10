import { NextRequest, NextResponse } from "next/server";

const BASE = process.env.CORE_API_URL ||
  "https://simply-backend-888610796336.southamerica-east1.run.app/api/v1";

export async function POST(req: NextRequest) {
  try {
    const { customerId, kind, mimeType } = await req.json();
    if (!customerId || !kind || !mimeType) {
      return NextResponse.json({ message: "Faltan campos" }, { status: 400 });
    }
    const res = await fetch(
      `${BASE}/identity/customers/${customerId}/signed-upload-url`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind, mimeType }),
        cache: "no-store",
      },
    );
    const text = await res.text();
    let data: any;
    try { data = JSON.parse(text); } catch { data = { message: text }; }
    return NextResponse.json(data, { status: res.status });
  } catch (e: any) {
    return NextResponse.json(
      { message: e.message || "Error obteniendo URL" },
      { status: 500 },
    );
  }
}
