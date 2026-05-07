import type { Metadata } from 'next';
import SimplyLanding from '@/components/SimplyLanding';

export const metadata: Metadata = {
  title: 'Contacto',
  description: 'Consultas comerciales, soporte, prensa, alianzas o privacidad.',
  alternates: { canonical: '/contacto' },
  openGraph: { title: 'Contacto | Simply', description: 'Consultas comerciales, soporte, prensa, alianzas o privacidad.', url: 'https://gosimply.xyz/contacto' },
};

export default function Page() {
  return <SimplyLanding initialPage="contact" />;
}
