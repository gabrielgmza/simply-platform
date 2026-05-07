import type { Metadata } from 'next';
import SimplyLanding from '@/components/SimplyLanding';

export const metadata: Metadata = {
  title: 'Diamond Black',
  description: 'Acceso por invitación: concierge 24/7, viajes de élite, cashback hasta 1.5% y hasta 60 cuotas.',
  alternates: { canonical: '/diamond-black' },
  openGraph: { title: 'Diamond Black | Simply', description: 'Acceso por invitación: concierge 24/7, viajes de élite, cashback hasta 1.5% y hasta 60 cuotas.', url: 'https://gosimply.xyz/diamond-black' },
};

export default function Page() {
  return <SimplyLanding initialPage="diamond" />;
}
