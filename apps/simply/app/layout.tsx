import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AuthLayoutShell from '@/components/layout/AuthLayoutShell';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://app.gosimply.xyz'),
  title: { default: 'Simply — Movimiento de dinero global', template: '%s | Simply' },
  description: 'Envía dinero, cripto y FX a más de 7 países. Una sola plataforma.',
  applicationName: 'Simply',
  icons: {
    icon: [
      { url: '/assets/favicon-simply-dark.svg', type: 'image/svg+xml' },
      { url: '/favicon.png', type: 'image/png' },
    ],
    apple: [{ url: '/assets/favicon-simply-dark.svg', type: 'image/svg+xml' }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={inter.variable}>
      <body className="font-sans antialiased bg-black text-white">
        {/* Background gradiente igual landing */}
        <div
          aria-hidden
          className="fixed inset-0 pointer-events-none -z-0 bg-[radial-gradient(circle_at_75%_8%,rgba(45,127,249,0.28),transparent_25%),radial-gradient(circle_at_15%_38%,rgba(45,127,249,0.13),transparent_22%),linear-gradient(180deg,#000,#030303)]"
        />

        <div className="relative z-10 min-h-screen flex flex-col">
          <Header />
          <main className="flex-1 pt-24 md:pt-28 px-6 pb-16">
            <AuthLayoutShell>{children}</AuthLayoutShell>
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
