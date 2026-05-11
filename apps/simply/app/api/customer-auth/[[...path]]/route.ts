import { NextRequest, NextResponse } from "next/server";

const BACKEND =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "https://simply-backend-888610796336.southamerica-east1.run.app/api/v1";

type Ctx = { params: Promise<{ path?: string[] }> };

export async function GET(req: NextRequest, ctx: Ctx) {
  const { path } = await ctx.params;
  return proxy(req, path || []);
}
export async function POST(req: NextRequest, ctx: Ctx) {
  const { path } = await ctx.params;
  return proxy(req, path || []);
}
export async function DELETE(req: NextRequest, ctx: Ctx) {
  const { path } = await ctx.params;
  return proxy(req, path || []);
}

async function proxy(req: NextRequest, path: string[]) {
  const search = req.nextUrl.searchParams.toString();
  const subPath = path.length ? "/" + path.join("/") : "";
  const url = BACKEND + "/customer-auth" + subPath + (search ? "?" + search : "");

  const init: RequestInit = {
    method: req.method,
    headers: {
      "Content-Type": "application/json",
      // Forward UA y IP para que el backend etiquete el device
      "user-agent": req.headers.get("user-agent") || "",
      "x-forwarded-for": req.headers.get("x-forwarded-for") || "",
    },
  };

  if (req.method !== "GET" && req.method !== "DELETE") {
    init.body = await req.text();
  }

  const res = await fetch(url, init);
  const text = await res.text();
  return new NextResponse(text, {
    status: res.status,
    headers: { "Content-Type": "application/json" },
  });
}
