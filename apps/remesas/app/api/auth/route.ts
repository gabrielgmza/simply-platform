import { NextRequest, NextResponse } from "next/server";
import { corePost } from "@/lib/core";

export async function POST(req: NextRequest) {
  try {
    const { email, firstName, lastName } = await req.json();
    const data = await corePost("/identity/find-or-create", {
      email,
      firstName,
      lastName,
      source: "remesas",
    });
    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json({ message: e.message }, { status: 500 });
  }
}
