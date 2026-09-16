import { getPublishedProducts } from "@/lib/db";
import { ProductCard } from "@/components/store/ProductCard";
import { StoreContainer } from "@/components/store/StoreContainer";

export const metadata = { title: "Tienda" };

export default async function StorePage() {
  const products = await getPublishedProducts();

  return (
    <StoreContainer className="pt-12">
      <header className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-medium text-rose-deep">Catálogo</p>
        <h1 className="font-display mt-2 text-4xl font-bold">Tienda</h1>
        <p className="mt-3 text-muted">
          Elegí el diseño, pagá con Mercado Pago y recibís los archivos en tu email.
        </p>
      </header>
      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </div>
    </StoreContainer>
  );
}
