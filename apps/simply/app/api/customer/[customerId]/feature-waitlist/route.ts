import { NextRequest, NextResponse } from "next/server";
const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "https://simply-backend-888610796336.southamerica-east1.run.app";

async function proxy(req: NextRequest, customerId: string) {
  const body = req.method !== "GET" ? await req.text() : undefined;
  const res = await fetch(`${BACKEND}/api/v1/customer/${encodeURIComponent(customerId)}/feature-waitlist`, {
    method: req.method,
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

export async function GET(req: NextRequest, ctx: { params: Promise<{ customerId: string }> }) {
  const { customerId } = await ctx.params;
  return proxy(req, customerId);
}
export async function POST(req: NextRequest, ctx: { params: Promise<{ customerId: string }> }) {
  const { customerId } = await ctx.params;
  return proxy(req, customerId);
}
