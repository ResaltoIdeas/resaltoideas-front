import { getFeaturedProducts, getSettings } from "@/lib/db";
import { FeaturedCoverflow } from "@/components/store/FeaturedCoverflow";
import { StoreContainer } from "@/components/store/StoreContainer";
import { ButtonLink } from "@/components/ui/Button";
import { productsToCoverflowSlides } from "@/lib/coverflow-slides";

export default async function HomePage() {
  const [settings, featured] = await Promise.all([
    getSettings(),
    getFeaturedProducts(),
  ]);
  const slides = productsToCoverflowSlides(featured);

  return (
    <div>
      <StoreContainer className="pt-12">
        <section className="mx-auto max-w-2xl text-center">
          <h1 className="font-display text-4xl font-bold leading-tight sm:text-[44px]">
            {settings.heroTitle}
          </h1>
          <p className="mt-4 text-lg text-muted">{settings.heroSubtitle}</p>
          <div className="mt-8 flex justify-center">
            <ButtonLink href="/tienda">Ver tienda</ButtonLink>
          </div>
        </section>
      </StoreContainer>

      {slides.length > 0 ? (
        <section className="pt-12">
          <StoreContainer>
            <p className="text-center text-sm font-medium text-rose-deep">Galería</p>
            <h2 className="font-display mt-2 text-center text-2xl font-semibold">
              Destacados
            </h2>
          </StoreContainer>
          <div className="pt-1">
            <FeaturedCoverflow slides={slides} />
          </div>
        </section>
      ) : (
        <StoreContainer className="pt-14 text-center">
          <p className="text-muted">Pronto hay diseños destacados.</p>
        </StoreContainer>
      )}
    </div>
  );
}
