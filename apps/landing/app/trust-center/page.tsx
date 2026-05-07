import type { Metadata } from 'next';
import SimplyLanding from '@/components/SimplyLanding';

export const metadata: Metadata = {
  title: 'Trust Center',
  description: 'KYC/KYB, monitoreo, prevención de fraude, roles y proveedores regulados.',
  alternates: { canonical: '/trust-center' },
  openGraph: { title: 'Trust Center | Simply', description: 'KYC/KYB, monitoreo, prevención de fraude, roles y proveedores regulados.', url: 'https://gosimply.xyz/trust-center' },
};

export default function Page() {
  return <SimplyLanding initialPage="securityPage" />;
}
