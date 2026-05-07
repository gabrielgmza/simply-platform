import type { Metadata } from 'next';
import SimplyLanding from '@/components/SimplyLanding';

export const metadata: Metadata = {
  title: 'Personas',
  description: 'Tarjeta Visa, QR, fondos comunes con rentabilidad diaria, cashback hasta 1% y financiación hasta 48 cuotas.',
  alternates: { canonical: '/personas' },
  openGraph: { title: 'Personas | Simply', description: 'Tarjeta Visa, QR, fondos comunes con rentabilidad diaria, cashback hasta 1% y financiación hasta 48 cuotas.', url: 'https://gosimply.xyz/personas' },
};

export default function Page() {
  return <SimplyLanding initialPage="people" />;
}
