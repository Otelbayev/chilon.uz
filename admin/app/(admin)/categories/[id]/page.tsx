import CategoryForm from '@/components/CategoryForm';

export default function EditCategoryPage({ params }: { params: { id: string } }) {
  return <CategoryForm mode="edit" id={params.id} />;
}
