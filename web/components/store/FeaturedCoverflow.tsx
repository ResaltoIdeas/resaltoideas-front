"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { ButtonLink } from "@/components/ui/Button";
import { CoverflowCarousel } from "@/components/ui/coverflow-carousel";
import type { ProductCoverflowSlide } from "@/lib/coverflow-slides";

export function FeaturedCoverflow({ slides }: { slides: ProductCoverflowSlide[] }) {
  const router = useRouter();
  const [selected, setSelected] = React.useState(0);
  const active = slides[selected];

  if (slides.length === 0) return null;

  return (
    <div>
      <CoverflowCarousel
        slides={slides}
        cardWidth="clamp(180px, 28vw, 320px)"
        loop={slides.length > 2}
        showCaption
        showNavigation
        label="Productos destacados"
        onSelectedChange={setSelected}
        onSlideActivate={(index) => {
          const href = slides[index]?.href;
          if (href) router.push(href);
        }}
      />
      {active?.href ? (
        <div className="mt-6 flex justify-center px-5">
          <ButtonLink href={active.href}>Ver producto</ButtonLink>
        </div>
      ) : null}
    </div>
  );
}
