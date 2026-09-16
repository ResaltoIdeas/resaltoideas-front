import type { CoverflowSlide } from "@/components/ui/coverflow-carousel";
import { formatArs } from "@/lib/money";
import type { Product } from "@/lib/types";

export type ProductCoverflowSlide = CoverflowSlide & { href: string };

export function productsToCoverflowSlides(products: Product[]): ProductCoverflowSlide[] {
  return products.map((product) => {
    const preview = product.files.find((file) => file.kind === "preview" && file.publicUrl);
    return {
      src: preview?.publicUrl ?? undefined,
      alt: product.title,
      title: product.title,
      subtitle: formatArs(product.priceArs),
      href: `/tienda/${product.slug}`,
      tone: product.previewTone,
    };
  });
}

export function previewFilesToSlides(product: Product): CoverflowSlide[] {
  const previews = product.files.filter((file) => file.kind === "preview");
  return previews.map((file, index) => ({
    src: file.publicUrl ?? undefined,
    alt: `${product.title} — preview ${index + 1}`,
    title: product.title,
    tone: product.previewTone,
  }));
}
