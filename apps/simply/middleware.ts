import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware Next.js: ejecuta server-side antes de cualquier render.
 * 
 * Limitación: la sesión vive en localStorage (no en cookie), entonces
 * acá no podemos chequear profileStatus. El gate real lo hace useKycGate
 * en cada página protegida.
 *
 * Por ahora este middleware solo agrega headers de seguridad y deja el
 * gate real al cliente. Si más adelante migramos sesión a cookie httpOnly,
 * acá podríamos hacer el chequeo completo.
 */
export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Headers de seguridad básicos
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - assets/
     */
    "/((?!_next/static|_next/image|favicon.ico|assets/).*)",
  ],
};
