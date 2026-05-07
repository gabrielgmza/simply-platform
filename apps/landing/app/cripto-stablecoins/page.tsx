import type { Metadata } from 'next';
import SimplyLanding from '@/components/SimplyLanding';

export const metadata: Metadata = {
  title: 'Cripto & Stablecoins',
  description: 'Stablecoins y cripto para operaciones reales, tesorería y pagos.',
  alternates: { canonical: '/cripto-stablecoins' },
  openGraph: { title: 'Cripto & Stablecoins | Simply', description: 'Stablecoins y cripto para operaciones reales, tesorería y pagos.', url: 'https://gosimply.xyz/cripto-stablecoins' },
};

export default function Page() {
  return <SimplyLanding initialPage="cryptoPage" />;
}
