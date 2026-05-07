import type { Metadata } from 'next';
import SimplyLanding from '@/components/SimplyLanding';

export const metadata: Metadata = {
  title: 'Preguntas frecuentes',
  description: 'Respuestas rápidas sobre Simply, productos, condiciones y seguridad.',
  alternates: { canonical: '/faq' },
  openGraph: { title: 'Preguntas frecuentes | Simply', description: 'Respuestas rápidas sobre Simply, productos, condiciones y seguridad.', url: 'https://gosimply.xyz/faq' },
};

export default function Page() {
  return <SimplyLanding initialPage="faq" />;
}
