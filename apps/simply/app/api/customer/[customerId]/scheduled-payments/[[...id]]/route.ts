import { NextRequest, NextResponse } from "next/server";
const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "https://simply-backend-888610796336.southamerica-east1.run.app";

async function proxy(req: NextRequest, customerId: string, id?: string[]) {
  const tail = id?.join("/") || "";
  const target = `${BACKEND}/api/v1/customer/${encodeURIComponent(customerId)}/scheduled-payments${tail ? "/" + tail : ""}`;
  const body = req.method !== "GET" && req.method !== "DELETE" ? await req.text() : undefined;
  const res = await fetch(target, {
    method: req.method,
    headers: { "Content-Type": "application/json" },
    body,
    cache: "no-store",
  });
  const text = await res.text();
  return new NextResponse(text, { status: res.status, headers: { "Content-Type": "application/json" } });
}

export async function GET(req: NextRequest, ctx: { params: Promise<{ customerId: string; id?: string[] }> }) {
  const p = await ctx.params;
  return proxy(req, p.customerId, p.id);
}
export async function POST(req: NextRequest, ctx: { params: Promise<{ customerId: string; id?: string[] }> }) {
  const p = await ctx.params;
  return proxy(req, p.customerId, p.id);
}
export async function PATCH(req: NextRequest, ctx: { params: Promise<{ customerId: string; id?: string[] }> }) {
  const p = await ctx.params;
  return proxy(req, p.customerId, p.id);
}
export async function DELETE(req: NextRequest, ctx: { params: Promise<{ customerId: string; id?: string[] }> }) {
  const p = await ctx.params;
  return proxy(req, p.customerId, p.id);
}
