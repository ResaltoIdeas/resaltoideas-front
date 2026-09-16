import { getAllProducts } from "@/lib/db";
import { ProductList } from "@/components/admin/ProductList";
import { ButtonLink } from "@/components/ui/Button";

export const metadata = { title: "Productos" };

export default async function ProductsAdminPage() {
  const products = await getAllProducts();

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-display text-3xl font-bold">Productos</h1>
        <ButtonLink href="/admin/productos/nuevo">Nuevo producto</ButtonLink>
      </div>
      <p className="mt-2 text-sm text-muted">Preview y entregables van por separado.</p>
      <ProductList products={products} />
    </div>
  );
}
