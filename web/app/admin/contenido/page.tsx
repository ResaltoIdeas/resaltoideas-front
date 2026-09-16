import { getLegal, getSettings } from "@/lib/db";
import { saveContentAction } from "@/lib/actions/admin";
import { PendingButton } from "@/components/admin/PendingButton";
import { Field, Input, Textarea } from "@/components/ui/Input";

export const metadata = { title: "Contenido" };

export default async function ContentPage() {
  const [settings, legal] = await Promise.all([getSettings(), getLegal()]);

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Contenido</h1>
      <p className="mt-2 mb-8 text-sm text-muted">
        Textos de la tienda y políticas. Simple, no settings infinitos.
      </p>
      <form action={saveContentAction} className="max-w-2xl space-y-5">
        <Field label="Nombre">
          <Input name="name" defaultValue={settings.name} />
        </Field>
        <Field label="Subtítulo">
          <Input name="tagline" defaultValue={settings.tagline} />
        </Field>
        <Field label="Título del home">
          <Input name="heroTitle" defaultValue={settings.heroTitle} />
        </Field>
        <Field label="Bajada del home">
          <Textarea name="heroSubtitle" defaultValue={settings.heroSubtitle} />
        </Field>
        <Field label="Email de contacto">
          <Input name="contactEmail" type="email" defaultValue={settings.contactEmail} />
        </Field>
        <Field label="Instagram (handle)">
          <Input name="instagramHandle" defaultValue={settings.instagramHandle} />
        </Field>
        <Field label="Instagram (URL)">
          <Input name="instagramUrl" defaultValue={settings.instagramUrl} />
        </Field>
        <Field label="Aviso internacional — título">
          <Input name="internationalTitle" defaultValue={settings.internationalTitle} />
        </Field>
        <Field label="Aviso internacional — texto">
          <Textarea name="internationalBody" defaultValue={settings.internationalBody} />
        </Field>
        {legal.map((page) => (
          <div key={page.slug} className="rounded-xl border border-[var(--line)] p-4">
            <p className="mb-3 text-sm font-semibold">{page.slug}</p>
            <Field label="Título">
              <Input name={`${page.slug}-title`} defaultValue={page.title} />
            </Field>
            <div className="mt-3">
              <Field label="Cuerpo">
                <Textarea name={`${page.slug}-body`} defaultValue={page.body} />
              </Field>
            </div>
          </div>
        ))}
        <PendingButton pendingLabel="Guardando…">Guardar contenido</PendingButton>
      </form>
    </div>
  );
}
