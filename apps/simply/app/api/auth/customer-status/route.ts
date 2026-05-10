import { NextRequest, NextResponse } from "next/server";

const BASE = process.env.CORE_API_URL ||
  "https://simply-backend-888610796336.southamerica-east1.run.app/api/v1";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ message: "id requerido" }, { status: 400 });
    }
    const res = await fetch(`${BASE}/identity/customers/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) {
      return NextResponse.json(
        { message: `Backend ${res.status}` },
        { status: res.status },
      );
    }
    const customer = await res.json();
    return NextResponse.json({
      id: customer.id,
      email: customer.email,
      profileStatus: customer.profileStatus,
      accountLevel: customer.accountLevel,
    });
  } catch (e: any) {
    return NextResponse.json(
      { message: e.message || "Error" },
      { status: 500 },
    );
  }
}
