import Link from "next/link";
import { formatArs } from "@/lib/money";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/types";

function PreviewVisual({
  product,
  large,
  framed = true,
  compact,
}: {
  product: Product;
  large?: boolean;
  framed?: boolean;
  compact?: boolean;
}) {
  const src = product.files.find((f) => f.kind === "preview" && f.publicUrl)?.publicUrl;
  const box = compact
    ? "aspect-[4/5] max-h-[280px] w-full"
    : large
      ? "aspect-[4/5] min-h-[360px]"
      : "aspect-[4/5]";
  const frame = framed
    ? "rounded-2xl border border-[var(--line)] shadow-rose"
    : "";
  if (src) {
    return (
      <div className={cn("relative overflow-hidden", box, frame)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt="" className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]" />
        <span className="absolute bottom-4 left-4 rounded-lg bg-white/85 px-3 py-1.5 text-xs font-medium">
          Preview
        </span>
      </div>
    );
  }
  return (
    <div
      className={cn(
        "flex items-end bg-gradient-to-br p-5",
        product.previewTone,
        box,
        frame,
      )}
    >
      <span className="rounded-lg bg-white/85 px-3 py-1.5 text-sm font-medium">
        Preview · no es el archivo editable
      </span>
    </div>
  );
}

export function ProductCard({
  product,
  index = 0,
}: {
  product: Product;
  index?: number;
}) {
  return (
    <Link
      href={`/tienda/${product.slug}`}
      className="catalog-card group block overflow-hidden rounded-xl bg-surface shadow-rose"
      style={{ animationDelay: `${index * 90}ms` }}
    >
      <PreviewVisual product={product} framed={false} />
      <div className="p-4">
        <h3 className="font-display text-lg font-semibold leading-snug group-hover:text-rose-deep">
          {product.title}
        </h3>
        <p className="mt-2 text-sm font-semibold tabular-nums">{formatArs(product.priceArs)}</p>
      </div>
    </Link>
  );
}

export function PreviewFrame({
  product,
  large,
  compact,
  framed = true,
}: {
  product: Product;
  large?: boolean;
  compact?: boolean;
  framed?: boolean;
}) {
  return (
    <PreviewVisual
      product={product}
      large={large}
      compact={compact}
      framed={framed}
    />
  );
}
