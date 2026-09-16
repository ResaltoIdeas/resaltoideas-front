import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, FileText, Mail } from "lucide-react";

import { getProductBySlug, getSettings } from "@/lib/db";
import { formatArs } from "@/lib/money";
import { PreviewFrame } from "@/components/store/ProductCard";
import { ProductPreviewGallery } from "@/components/store/ProductPreviewGallery";
import { InternationalNotice } from "@/components/store/InternationalNotice";
import { StoreContainer } from "@/components/store/StoreContainer";
import { ButtonLink } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  return { title: product?.title ?? "Producto" };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const [product, settings] = await Promise.all([
    getProductBySlug(slug),
    getSettings(),
  ]);
  if (!product || !product.published) notFound();

  const includes = product.files.filter((f) => f.kind === "deliverable");
  const previewCount = product.files.filter((f) => f.kind === "preview").length;

  return (
    <StoreContainer className="pt-8 pb-6">
      <Link
        href="/tienda"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-ink"
      >
        <ArrowLeft className="size-4" />
        Tienda
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-start">
        <div className="rounded-[20px] bg-surface p-3 shadow-rose sm:p-4">
          {previewCount > 1 ? (
            <ProductPreviewGallery product={product} />
          ) : (
            <PreviewFrame product={product} large framed={false} />
          )}
          <p className="mt-3 px-1 text-xs text-muted">
            Esto es el preview. Los archivos editables llegan por email después del pago.
          </p>
        </div>

        <div className="lg:sticky lg:top-24">
          <div className="flex flex-wrap items-center gap-2">
            {product.featured ? <Badge tone="rose">Destacado</Badge> : null}
            {product.category ? <Badge tone="muted">{product.category}</Badge> : null}
          </div>
          <h1 className="font-display mt-3 text-4xl font-bold leading-tight">
            {product.title}
          </h1>
          <p className="mt-4 text-3xl font-semibold tabular-nums">
            {formatArs(product.priceArs)}
          </p>
          <p className="mt-4 text-muted leading-relaxed">{product.description}</p>

          <div className="mt-8 rounded-xl border border-[var(--line)] bg-rose-wash/70 p-5">
            <h2 className="text-sm font-semibold">Qué incluye</h2>
            <ul className="mt-3 space-y-2">
              {includes.map((file) => (
                <li key={file.id} className="flex items-center gap-2 text-sm text-ink">
                  <FileText className="size-4 shrink-0 text-rose-deep" />
                  {file.displayName}
                </li>
              ))}
            </ul>
            <p className="mt-3 flex items-start gap-2 text-xs text-muted">
              <Mail className="mt-0.5 size-3.5 shrink-0" />
              Se envían al email que confirmes en el checkout. No se descargan acá.
            </p>
          </div>

          <ButtonLink href={`/comprar/${product.slug}`} className="mt-8 w-full">
            Comprar
          </ButtonLink>
          <p className="mt-3 text-center text-xs text-muted">
            Un producto. Pago con Mercado Pago. Sin cuenta y sin carrito.
          </p>

          <div className="mt-8">
            <InternationalNotice settings={settings} />
          </div>
        </div>
      </div>
    </StoreContainer>
  );
}
