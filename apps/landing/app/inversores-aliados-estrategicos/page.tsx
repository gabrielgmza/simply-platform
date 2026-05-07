import type { Metadata } from 'next';
import SimplyLanding from '@/components/SimplyLanding';

export const metadata: Metadata = {
  title: 'Inversores y aliados estratégicos',
  description: 'Tesis de inversión, verticales y modelo de expansión de Simply.',
  alternates: { canonical: '/inversores-aliados-estrategicos' },
  openGraph: { title: 'Inversores y aliados estratégicos | Simply', description: 'Tesis de inversión, verticales y modelo de expansión de Simply.', url: 'https://gosimply.xyz/inversores-aliados-estrategicos' },
};

export default function Page() {
  return <SimplyLanding initialPage="investors" />;
}
