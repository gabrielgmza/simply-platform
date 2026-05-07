import type { Metadata } from 'next';
import SimplyLanding from '@/components/SimplyLanding';

export const metadata: Metadata = {
  title: 'Cumplimiento',
  description: 'KYC, KYB, AML, prevención de fraude y trazabilidad.',
  alternates: { canonical: '/cumplimiento' },
  openGraph: { title: 'Cumplimiento | Simply', description: 'KYC, KYB, AML, prevención de fraude y trazabilidad.', url: 'https://gosimply.xyz/cumplimiento' },
};

export default function Page() {
  return <SimplyLanding initialPage="compliance" />;
}
