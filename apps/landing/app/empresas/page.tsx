import type { Metadata } from 'next';
import SimplyLanding from '@/components/SimplyLanding';

export const metadata: Metadata = {
  title: 'Empresas',
  description: 'Pagos masivos, gastos inteligentes, multi-divisa, stablecoins, factoring y RBF en una sola plataforma.',
  alternates: { canonical: '/empresas' },
  openGraph: { title: 'Empresas | Simply', description: 'Pagos masivos, gastos inteligentes, multi-divisa, stablecoins, factoring y RBF en una sola plataforma.', url: 'https://gosimply.xyz/empresas' },
};

export default function Page() {
  return <SimplyLanding initialPage="business" />;
}
