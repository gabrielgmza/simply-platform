import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://gosimply.xyz'),
  title: { default: 'Simply | Tu dinero, sin fricción.', template: '%s | Simply' },
  description: 'Una plataforma financiera AI-first para personas y empresas: pagos, tarjeta Visa, cripto, stablecoins, financiación, rewards, seguridad avanzada y operaciones inteligentes en un solo ecosistema.',
  applicationName: 'Simply',
  keywords: ['Simply', 'PaySur', 'fintech', 'Visa', 'cripto', 'stablecoins', 'pre-registro', 'Diamond Black', 'AI'],
  authors: [{ name: 'PaySur INC' }],
  creator: 'PaySur INC',
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    url: 'https://gosimply.xyz',
    siteName: 'Simply',
    title: 'Simply | Tu dinero, sin fricción.',
    description: 'Plataforma financiera AI-first para personas y empresas.',
  },
  twitter: { card: 'summary_large_image', title: 'Simply | Tu dinero, sin fricción.', description: 'Plataforma financiera AI-first.' },
  robots: { index: true, follow: true },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.png', type: 'image/png' },
    ],
    apple: [{ url: '/favicon.png' }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={inter.variable}>
      <body className="font-sans antialiased bg-black text-white">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
