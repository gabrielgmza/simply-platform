import { NextRequest, NextResponse } from "next/server";

const BASE = process.env.CORE_API_URL ||
  "https://simply-backend-888610796336.southamerica-east1.run.app/api/v1";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const cantidad = searchParams.get("cantidad") || "3";
    const res = await fetch(
      `${BASE}/identity-verification/liveness/challenges?cantidad=${cantidad}`,
      { cache: "no-store" },
    );
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (e: any) {
    return NextResponse.json(
      { message: e.message || "Error obteniendo desafíos" },
      { status: 500 },
    );
  }
}
