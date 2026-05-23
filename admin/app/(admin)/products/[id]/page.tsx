import ProductForm from '@/components/ProductForm';
export default function EditProductPage({ params }: { params: { id: string } }) {
  return <ProductForm mode="edit" id={params.id} />;
}
