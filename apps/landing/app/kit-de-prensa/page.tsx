import type { Metadata } from 'next';
import SimplyLanding from '@/components/SimplyLanding';

export const metadata: Metadata = {
  title: 'Prensa / Media Kit',
  description: 'Recursos institucionales, boilerplate y contacto de prensa.',
  alternates: { canonical: '/kit-de-prensa' },
  openGraph: { title: 'Prensa / Media Kit | Simply', description: 'Recursos institucionales, boilerplate y contacto de prensa.', url: 'https://gosimply.xyz/kit-de-prensa' },
};

export default function Page() {
  return <SimplyLanding initialPage="press" />;
}
