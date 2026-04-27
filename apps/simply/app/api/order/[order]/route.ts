import { NextRequest, NextResponse } from "next/server";
import { coreGet } from "@/lib/core";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ order: string }> }
) {
  try {
    const { order } = await params;
    const data = await coreGet(`/transfer-engine/order/${order}`);
    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json({ message: e.message }, { status: 500 });
  }
}
