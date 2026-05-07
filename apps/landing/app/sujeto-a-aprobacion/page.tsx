import PageGeneric from '@/components/PageGeneric';
import { pages } from '@/lib/pages';

const data = pages.approvals;

export const metadata = { title: data.title };

export default function Page() {
  return <PageGeneric data={data} pageKey="approvals" />;
}
