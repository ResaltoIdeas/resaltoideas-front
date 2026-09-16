import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, FileText, Lock } from "lucide-react";

import { getProductBySlug, getSettings } from "@/lib/db";
import { formatArs } from "@/lib/money";
import { CheckoutForm } from "@/components/store/CheckoutForm";
import { InternationalNotice } from "@/components/store/InternationalNotice";
import { PreviewFrame } from "@/components/store/ProductCard";
import { StoreContainer } from "@/components/store/StoreContainer";
import { Badge } from "@/components/ui/Badge";

type Props = { params: Promise<{ slug: string }> };

export const metadata = { title: "Checkout" };

export default async function CheckoutPage({ params }: Props) {
  const { slug } = await params;
  const [product, settings] = await Promise.all([
    getProductBySlug(slug),
    getSettings(),
  ]);
  if (!product || !product.published) notFound();

  const includes = product.files.filter((f) => f.kind === "deliverable");

  return (
    <StoreContainer className="pt-8 pb-6">
      <Link
        href={`/tienda/${product.slug}`}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-ink"
      >
        <ArrowLeft className="size-4" />
        Volver al producto
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
        <aside className="rounded-xl bg-surface p-5 shadow-rose">
          <PreviewFrame product={product} compact framed={false} />
          <p className="font-display mt-4 text-xl font-semibold leading-snug">
            {product.title}
          </p>
          <p className="mt-2 text-lg font-semibold tabular-nums">
            {formatArs(product.priceArs)}
          </p>
          <div className="mt-5 border-t border-[var(--line)] pt-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              Llega por email
            </p>
            <ul className="mt-2 space-y-2">
              {includes.map((file) => (
                <li key={file.id} className="flex items-center gap-2 text-sm">
                  <FileText className="size-4 shrink-0 text-rose-deep" />
                  <span>{file.displayName}</span>
                  <Lock className="ml-auto size-3.5 text-muted" />
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <div className="rounded-xl bg-surface p-5 shadow-rose sm:p-7">
          <Badge tone="mp">Mercado Pago</Badge>
          <h1 className="font-display mt-3 text-3xl font-bold">Completar compra</h1>
          <p className="mt-2 mb-6 text-sm text-muted">
            Un producto. Confirmá el email: ahí llegan los archivos.
          </p>
          <CheckoutForm product={product} />
          <div className="mt-6">
            <InternationalNotice settings={settings} />
          </div>
        </div>
      </div>
    </StoreContainer>
  );
}
