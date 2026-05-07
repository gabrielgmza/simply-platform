import type { Metadata } from 'next';
import SimplyLanding from '@/components/SimplyLanding';

export const metadata: Metadata = {
  title: 'Nosotros',
  description: 'Simply nace para rediseñar la relación entre personas, empresas y dinero.',
  alternates: { canonical: '/nosotros' },
  openGraph: { title: 'Nosotros | Simply', description: 'Simply nace para rediseñar la relación entre personas, empresas y dinero.', url: 'https://gosimply.xyz/nosotros' },
};

export default function Page() {
  return <SimplyLanding initialPage="about" />;
}
