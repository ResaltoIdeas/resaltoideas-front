import { notFound } from "next/navigation";
import { getProductById } from "@/lib/db";
import { ProductForm } from "@/components/admin/ProductForm";

type Props = { params: Promise<{ id: string }> };

export const metadata = { title: "Editar producto" };

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) notFound();

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Editar producto</h1>
      <p className="mt-2 mb-8 text-sm text-muted">{product.title}</p>
      <ProductForm product={product} />
    </div>
  );
}
