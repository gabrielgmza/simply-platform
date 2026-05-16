import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  // Vercel inyecta estos headers automáticamente en producción
  const country =
    req.headers.get("x-vercel-ip-country") ||
    req.headers.get("cf-ipcountry") ||
    null;
  const city = req.headers.get("x-vercel-ip-city") || null;
  const region = req.headers.get("x-vercel-ip-country-region") || null;

  return NextResponse.json({
    country,
    city: city ? decodeURIComponent(city) : null,
    region,
    source: "vercel-headers",
  });
}

// POST: recibe lat/lng del cliente (GPS) y reverse-geocoding via header (si Vercel lo permite)
// O simplemente confiamos en el browser de momento y devolvemos lo de Vercel
export async function POST(req: NextRequest) {
  // Para reverse geocoding real necesitaríamos una API externa
  // Por ahora devolvemos lo mismo que GET
  return GET(req);
}
