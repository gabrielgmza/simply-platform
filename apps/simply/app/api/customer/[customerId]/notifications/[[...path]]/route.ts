import { NextRequest, NextResponse } from "next/server";
const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "https://simply-backend-888610796336.southamerica-east1.run.app";

async function proxy(req: NextRequest, params: { customerId: string; path?: string[] }) {
  const path = params.path?.join("/") || "";
  const url = new URL(req.url);
  const target = `${BACKEND}/api/v1/customer/${encodeURIComponent(params.customerId)}/notifications${path ? "/" + path : ""}${url.search}`;
  const body = req.method !== "GET" && req.method !== "HEAD" && req.method !== "DELETE" ? await req.text() : undefined;
  const res = await fetch(target, {
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

export async function GET(req: NextRequest, ctx: { params: Promise<{ customerId: string; path?: string[] }> }) {
  return proxy(req, await ctx.params);
}
export async function POST(req: NextRequest, ctx: { params: Promise<{ customerId: string; path?: string[] }> }) {
  return proxy(req, await ctx.params);
}
export async function PATCH(req: NextRequest, ctx: { params: Promise<{ customerId: string; path?: string[] }> }) {
  return proxy(req, await ctx.params);
}
export async function DELETE(req: NextRequest, ctx: { params: Promise<{ customerId: string; path?: string[] }> }) {
  return proxy(req, await ctx.params);
}
