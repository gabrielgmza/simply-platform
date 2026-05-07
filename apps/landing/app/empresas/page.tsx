import PageGeneric from '@/components/PageGeneric';
import BusinessForm from '@/components/BusinessForm';
import { pages } from '@/lib/pages';

const data = pages.business;

export const metadata = { title: data.title };

export default function Page() {
  return (
    <PageGeneric data={data} pageKey="business">
      <BusinessForm />
    </PageGeneric>
  );
}
