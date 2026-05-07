import type { Metadata } from 'next';
import SimplyLanding from '@/components/SimplyLanding';

export const metadata: Metadata = {
  title: 'Estado del servicio',
  description: 'Estado informativo de módulos y disponibilidad.',
  alternates: { canonical: '/estado-del-servicio' },
  openGraph: { title: 'Estado del servicio | Simply', description: 'Estado informativo de módulos y disponibilidad.', url: 'https://gosimply.xyz/estado-del-servicio' },
};

export default function Page() {
  return <SimplyLanding initialPage="status" />;
}
