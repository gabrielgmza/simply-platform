import { NextRequest, NextResponse } from "next/server";
import { corePost } from "@/lib/core";

export async function POST(req: NextRequest) {
  try {
    const { email, code } = await req.json();
    if (!email || !code) {
      return NextResponse.json(
        { message: "Email y código requeridos" },
        { status: 400 },
      );
    }
    const data = await corePost("/email-otp/verify", { email, code });
    return NextResponse.json(data);
  } catch (e: any) {
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
      { message: e.message || "Error verificando código" },
      { status: 500 },
    );
  }
}
