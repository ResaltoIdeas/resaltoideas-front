"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";

import { formatArs } from "@/lib/money";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import type { Product } from "@/lib/types";

export function ProductList({ products }: { products: Product[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter((product) => {
      const haystack = [product.title, product.category, product.slug, product.description]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [products, query]);

  return (
    <div>
      <div className="relative mt-6 max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscar por título, categoría o slug"
          className="pl-9"
          aria-label="Buscar productos"
        />
      </div>
      <div className="mt-6 overflow-hidden rounded-xl border border-[var(--line)] bg-surface">
        <table className="w-full text-sm">
          <thead className="bg-rose-wash text-left text-[13px] font-medium text-muted">
            <tr>
              <th className="px-4 py-3">Título</th>
              <th className="px-4 py-3">Precio</th>
              <th className="px-4 py-3">Estado</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-muted">
                  No hay productos que coincidan.
                </td>
              </tr>
            ) : (
              filtered.map((product) => (
                <tr key={product.id} className="border-t border-[var(--line)]">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/productos/${product.id}`}
                      className="font-medium hover:text-rose-deep"
                    >
                      {product.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3 tabular-nums">{formatArs(product.priceArs)}</td>
                  <td className="px-4 py-3">
                    <Badge tone={product.published ? "ok" : "muted"}>
                      {product.published ? "Publicado" : "Oculto"}
                    </Badge>
                    {product.featured ? (
                      <span className="ml-2">
                        <Badge tone="rose">Destacado</Badge>
                      </span>
                    ) : null}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
