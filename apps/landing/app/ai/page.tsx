import type { Metadata } from 'next';
import SimplyLanding from '@/components/SimplyLanding';

export const metadata: Metadata = {
  title: 'AI financiera',
  description: 'AI para riesgo, fraude, soporte, asesoría y automatización con límites responsables.',
  alternates: { canonical: '/ai' },
  openGraph: { title: 'AI financiera | Simply', description: 'AI para riesgo, fraude, soporte, asesoría y automatización con límites responsables.', url: 'https://gosimply.xyz/ai' },
};

export default function Page() {
  return <SimplyLanding initialPage="ai" />;
}
