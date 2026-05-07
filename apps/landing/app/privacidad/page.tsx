import type { Metadata } from 'next';
import SimplyLanding from '@/components/SimplyLanding';

export const metadata: Metadata = {
  title: 'Política de Privacidad',
  description: 'Cómo recopilamos, usamos y protegemos tu información.',
  alternates: { canonical: '/privacidad' },
  openGraph: { title: 'Política de Privacidad | Simply', description: 'Cómo recopilamos, usamos y protegemos tu información.', url: 'https://gosimply.xyz/privacidad' },
};

export default function Page() {
  return <SimplyLanding initialPage="privacy" />;
}
