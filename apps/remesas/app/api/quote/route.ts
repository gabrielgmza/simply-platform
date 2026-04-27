import { NextRequest, NextResponse } from "next/server";
import { corePost } from "@/lib/core";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = await corePost("/remesas/quote", body);
    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json({ message: e.message }, { status: 500 });
  }
}
