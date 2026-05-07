import PageGeneric from '@/components/PageGeneric';
import { pages } from '@/lib/pages';

const data = pages.status;

export const metadata = { title: data.title };

export default function Page() {
  return <PageGeneric data={data} pageKey="status" />;
}
