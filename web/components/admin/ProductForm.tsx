import { saveProductAction } from "@/lib/actions/admin";
import { PendingButton } from "@/components/admin/PendingButton";
import { Field, Input, Textarea } from "@/components/ui/Input";
import type { Product } from "@/lib/types";

export function ProductForm({ product }: { product?: Product }) {
  const previews = product?.files.filter((f) => f.kind === "preview") ?? [];
  const deliverables = product?.files.filter((f) => f.kind === "deliverable") ?? [];

  return (
    <form action={saveProductAction} className="max-w-2xl space-y-5">
      {product ? <input type="hidden" name="id" value={product.id} /> : null}
      <Field label="Título">
        <Input name="title" required defaultValue={product?.title} />
      </Field>
      <Field label="Descripción">
        <Textarea name="description" defaultValue={product?.description} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Precio (ARS)">
          <Input
            name="priceArs"
            type="number"
            min={0}
            required
            defaultValue={product?.priceArs ?? 0}
          />
        </Field>
        <Field label="Categoría">
          <Input name="category" defaultValue={product?.category} />
        </Field>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="featured" defaultChecked={product?.featured} />
        Destacado en home
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="published" defaultChecked={product?.published ?? true} />
        Publicado
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-dashed border-[var(--line)] bg-rose-wash/60 p-4">
          <p className="text-sm font-semibold">Zona A · Preview</p>
          <p className="mt-1 text-xs text-muted">
            Imagen para el catálogo. No es el archivo que se entrega.
          </p>
          {previews.length ? (
            <ul className="mt-3 space-y-2 text-sm">
              {previews.map((f) => (
                <li key={f.id} className="flex items-center gap-2">
                  <input type="checkbox" name="keepFileId" value={f.id} defaultChecked />
                  <span>{f.displayName}</span>
                </li>
              ))}
            </ul>
          ) : null}
          <input
            className="mt-3 block w-full text-sm"
            type="file"
            name="previewFiles"
            accept="image/*"
            multiple
          />
        </div>
        <div className="rounded-xl border border-dashed border-ok/40 bg-[#3d7a64]/6 p-4">
          <p className="text-sm font-semibold">Zona B · Entregables</p>
          <p className="mt-1 text-xs text-muted">
            AI, SVG, ZIP, PDF, PSD… lo que reciba el comprador.
          </p>
          {deliverables.length ? (
            <ul className="mt-3 space-y-2 text-sm">
              {deliverables.map((f) => (
                <li key={f.id} className="flex items-center gap-2">
                  <input type="checkbox" name="keepFileId" value={f.id} defaultChecked />
                  <span>{f.displayName}</span>
                </li>
              ))}
            </ul>
          ) : null}
          <input
            className="mt-3 block w-full text-sm"
            type="file"
            name="deliverableFiles"
            multiple
          />
        </div>
      </div>
      <PendingButton pendingLabel="Guardando…">Guardar</PendingButton>
    </form>
  );
}
