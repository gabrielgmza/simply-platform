import type { Metadata } from 'next';
import SimplyLanding from '@/components/SimplyLanding';

export const metadata: Metadata = {
  title: 'Partners',
  description: 'Ecosistema abierto: bancos, PSPs, brokers, aseguradoras, cripto providers y ERPs.',
  alternates: { canonical: '/partners' },
  openGraph: { title: 'Partners | Simply', description: 'Ecosistema abierto: bancos, PSPs, brokers, aseguradoras, cripto providers y ERPs.', url: 'https://gosimply.xyz/partners' },
};

export default function Page() {
  return <SimplyLanding initialPage="partners" />;
}
