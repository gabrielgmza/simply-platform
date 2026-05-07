import type { Metadata } from 'next';
import SimplyLanding from '@/components/SimplyLanding';

export const metadata: Metadata = {
  title: 'Innovación',
  description: 'Fintech AI-first con infraestructura modular y diseño premium.',
  alternates: { canonical: '/innovacion' },
  openGraph: { title: 'Innovación | Simply', description: 'Fintech AI-first con infraestructura modular y diseño premium.', url: 'https://gosimply.xyz/innovacion' },
};

export default function Page() {
  return <SimplyLanding initialPage="innovation" />;
}
