import { NextRequest, NextResponse } from "next/server";
import { corePost } from "@/lib/core";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { message: "Email requerido" },
        { status: 400 },
      );
    }
    const data = await corePost("/email-otp/send", { email });
    return NextResponse.json(data);
  } catch (e: any) {
    // Extraer status del backend si existe (ej: 429 cooldown)
    const match = e.message?.match(/Core POST .*: (\d+) (.*)/);
    if (match) {
      const status = parseInt(match[1], 10);
      try {
        const body = JSON.parse(match[2]);
        return NextResponse.json(body, { status });
      } catch {
        return NextResponse.json({ message: match[2] }, { status });
      }
    }
    return NextResponse.json(
      { message: e.message || "Error enviando código" },
      { status: 500 },
    );
  }
}
