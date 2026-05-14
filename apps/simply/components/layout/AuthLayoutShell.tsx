'use client';

import { usePathname } from 'next/navigation';
import { useSession } from '@simply/ui';

/**
 * Decide el ancho del container según contexto:
 * - Logueado en /dashboard, /cuenta, /destinatario, etc → max-w-2xl en mobile, max-w-4xl en md+
 * - Login/registro/landing → max-w-md (compacto)
 */
export default function AuthLayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '';
  const { session, loaded } = useSession();
  const isAuthenticated = loaded && !!session;

  // Rutas autenticadas que necesitan más ancho
  const isWideRoute =
    isAuthenticated &&
    (pathname.startsWith('/dashboard') ||
      pathname.startsWith('/cuenta') ||
      pathname.startsWith('/destinatario') ||
      pathname.startsWith('/recibir') ||
      pathname.startsWith('/inversiones'));

  const containerClass = isWideRoute
    ? 'max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto w-full'
    : 'max-w-md mx-auto';

  return <div className={containerClass}>{children}</div>;
}
