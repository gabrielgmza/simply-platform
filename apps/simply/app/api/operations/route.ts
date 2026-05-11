import { NextRequest, NextResponse } from "next/server";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL || "https://simply-backend-888610796336.southamerica-east1.run.app";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const target = `${BACKEND}/api/v1/operations${url.search}`;
  const res = await fetch(target, {
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });
  const text = await res.text();
  return new NextResponse(text, {
    status: res.status,
    headers: { "Content-Type": res.headers.get("Content-Type") || "application/json" },
  });
}
