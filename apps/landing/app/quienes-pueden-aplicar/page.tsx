import type { Metadata } from 'next';
import SimplyLanding from '@/components/SimplyLanding';

export const metadata: Metadata = {
  title: 'Quiénes pueden aplicar',
  description: 'Quiénes pueden aplicar a los productos Simply.',
  alternates: { canonical: '/quienes-pueden-aplicar' },
  openGraph: { title: 'Quiénes pueden aplicar | Simply', description: 'Quiénes pueden aplicar a los productos Simply.', url: 'https://gosimply.xyz/quienes-pueden-aplicar' },
};

export default function Page() {
  return <SimplyLanding initialPage="applicants" />;
}
