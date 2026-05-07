import type { Metadata } from 'next';
import SimplyLanding from '@/components/SimplyLanding';

export const metadata: Metadata = {
  title: 'Política de Cookies',
  description: 'Cómo usamos cookies y tecnologías similares.',
  alternates: { canonical: '/cookies' },
  openGraph: { title: 'Política de Cookies | Simply', description: 'Cómo usamos cookies y tecnologías similares.', url: 'https://gosimply.xyz/cookies' },
};

export default function Page() {
  return <SimplyLanding initialPage="cookies" />;
}
