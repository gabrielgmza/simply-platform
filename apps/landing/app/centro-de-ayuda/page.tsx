import type { Metadata } from 'next';
import SimplyLanding from '@/components/SimplyLanding';

export const metadata: Metadata = {
  title: 'Centro de ayuda',
  description: 'Soporte claro por email y autoservicio.',
  alternates: { canonical: '/centro-de-ayuda' },
  openGraph: { title: 'Centro de ayuda | Simply', description: 'Soporte claro por email y autoservicio.', url: 'https://gosimply.xyz/centro-de-ayuda' },
};

export default function Page() {
  return <SimplyLanding initialPage="help" />;
}
