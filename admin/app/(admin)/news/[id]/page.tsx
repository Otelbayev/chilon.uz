import NewsForm from '@/components/NewsForm';
export default function EditNewsPage({ params }: { params: { id: string } }) {
  return <NewsForm mode="edit" id={params.id} />;
}
