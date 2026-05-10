import { NextRequest, NextResponse } from "next/server";

const BASE = process.env.CORE_API_URL ||
  "https://simply-backend-888610796336.southamerica-east1.run.app/api/v1";

export async function POST(req: NextRequest) {
  try {
    const { phoneCountryCode, phone } = await req.json();
    if (!phoneCountryCode || !phone) {
      return NextResponse.json(
        { message: "phoneCountryCode y phone requeridos" },
        { status: 400 },
      );
    }
    const res = await fetch(`${BASE}/identity/check-phone`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phoneCountryCode, phone }),
      cache: "no-store",
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (e: any) {
    return NextResponse.json(
      { message: e.message || "Error" },
      { status: 500 },
    );
  }
}
