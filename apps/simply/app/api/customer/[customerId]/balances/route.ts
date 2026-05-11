import { NextRequest, NextResponse } from "next/server";
const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "https://simply-backend-888610796336.southamerica-east1.run.app";

export async function GET(req: NextRequest, ctx: { params: Promise<{ customerId: string }> }) {
  const { customerId } = await ctx.params;
  const res = await fetch(`${BACKEND}/api/v1/customer/${encodeURIComponent(customerId)}/balances`, {
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });
  const text = await res.text();
  return new NextResponse(text, {
    status: res.status,
    headers: { "Content-Type": res.headers.get("Content-Type") || "application/json" },
  });
}
