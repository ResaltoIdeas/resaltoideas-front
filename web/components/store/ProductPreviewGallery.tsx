"use client";

import { CoverflowCarousel } from "@/components/ui/coverflow-carousel";
import { previewFilesToSlides } from "@/lib/coverflow-slides";
import type { Product } from "@/lib/types";

export function ProductPreviewGallery({ product }: { product: Product }) {
  const slides = previewFilesToSlides(product);
  if (slides.length < 2) return null;

  return (
    <CoverflowCarousel
      slides={slides}
      cardWidth="clamp(220px, 36vw, 380px)"
      loop={false}
      showNavigation
      showCaption={false}
      label={`Previews de ${product.title}`}
    />
  );
}
