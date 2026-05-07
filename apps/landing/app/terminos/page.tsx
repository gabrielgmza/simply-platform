import type { Metadata } from 'next';
import SimplyLanding from '@/components/SimplyLanding';

export const metadata: Metadata = {
  title: 'Términos y Condiciones',
  description: 'Términos de uso del sitio, productos y servicios Simply.',
  alternates: { canonical: '/terminos' },
  openGraph: { title: 'Términos y Condiciones | Simply', description: 'Términos de uso del sitio, productos y servicios Simply.', url: 'https://gosimply.xyz/terminos' },
};

export default function Page() {
  return <SimplyLanding initialPage="terms" />;
}
