import type { Metadata } from 'next';
import SimplyLanding from '@/components/SimplyLanding';

export const metadata: Metadata = {
  title: 'Trabajá con nosotros',
  description: 'Buscamos builders para construir una fintech AI-first global.',
  alternates: { canonical: '/trabaja-con-nosotros' },
  openGraph: { title: 'Trabajá con nosotros | Simply', description: 'Buscamos builders para construir una fintech AI-first global.', url: 'https://gosimply.xyz/trabaja-con-nosotros' },
};

export default function Page() {
  return <SimplyLanding initialPage="careers" />;
}
