import { ProductForm } from "@/components/admin/ProductForm";

export const metadata = { title: "Nuevo producto" };

export default function NewProductPage() {
  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Nuevo producto</h1>
      <p className="mt-2 mb-8 text-sm text-muted">
        Preview y archivos entregables son siempre distintos.
      </p>
      <ProductForm />
    </div>
  );
}
