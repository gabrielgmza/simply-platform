import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Simply Remesas — Envíos a LatAm",
  description: "Enviá dinero a Chile, Colombia, México, Venezuela o Perú al mejor precio.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <div className="min-h-screen flex flex-col">
          <header className="px-6 py-5 border-b border-white/5">
            <div className="max-w-md mx-auto flex items-center justify-between">
              <a href="/" className="text-xl font-semibold tracking-tight">
                Simply <span className="text-accent-400">Remesas</span>
              </a>
              <a href="/historial" className="text-sm text-white/60 hover:text-white">
                Historial
              </a>
            </div>
          </header>
          <main className="flex-1 px-6 py-8">
            <div className="max-w-md mx-auto">{children}</div>
          </main>
          <footer className="px-6 py-6 border-t border-white/5 text-center text-xs text-white/40">
            Simply by PaySur · Procesado por Vita Wallet
          </footer>
        </div>
      </body>
    </html>
  );
}
