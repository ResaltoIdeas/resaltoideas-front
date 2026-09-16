import type { SiteSettings } from "@/lib/types";

export function InternationalNotice({ settings }: { settings: SiteSettings }) {
  return (
    <aside className="rounded-xl border border-[var(--line)] bg-surface px-4 py-3 text-sm">
      <p className="font-semibold text-ink">{settings.internationalTitle}</p>
      <p className="mt-1 text-muted">{settings.internationalBody}</p>
      <a
        className="mt-2 inline-block font-semibold text-rose-deep"
        href={`mailto:${settings.contactEmail}?subject=${encodeURIComponent("Consulta de compra internacional / otro medio de pago")}`}
      >
        Escribir a {settings.contactEmail}
      </a>
    </aside>
  );
}
