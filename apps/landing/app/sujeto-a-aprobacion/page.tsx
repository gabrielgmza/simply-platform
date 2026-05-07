import type { Metadata } from 'next';
import SimplyLanding from '@/components/SimplyLanding';

export const metadata: Metadata = {
  title: 'Sujeto a aprobación',
  description: 'Productos sujetos a aprobación, regulación y proveedores.',
  alternates: { canonical: '/sujeto-a-aprobacion' },
  openGraph: { title: 'Sujeto a aprobación | Simply', description: 'Productos sujetos a aprobación, regulación y proveedores.', url: 'https://gosimply.xyz/sujeto-a-aprobacion' },
};

export default function Page() {
  return <SimplyLanding initialPage="approvals" />;
}
