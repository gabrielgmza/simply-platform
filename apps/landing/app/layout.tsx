import type { Metadata, Viewport } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { SITE_URL } from '@/lib/routes';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: 'Simply | Tu dinero, sin fricción', template: '%s | Simply' },
  description:
    'Simply: plataforma financiera AI-first para personas, empresas, cripto, tarjetas, inversiones, financiación y Diamond Black.',
  openGraph: {
    title: 'Simply | Tu dinero, sin fricción',
    description: 'Plataforma financiera AI-first para personas y empresas.',
    url: SITE_URL,
    siteName: 'Simply',
    locale: 'es_AR',
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: 'Simply | Tu dinero, sin fricción' },
  icons: { icon: '/favicon.png', apple: '/favicon.png' },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#000000',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <main>
          <Header />
          <div className="bg" />
          <div className="page-wrap">{children}</div>
          <Footer />
        </main>
      </body>
    </html>
  );
}
