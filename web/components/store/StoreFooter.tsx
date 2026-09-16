import Image from "next/image";
import Link from "next/link";
import type { SiteSettings } from "@/lib/types";

export function StoreFooter({ settings }: { settings: SiteSettings }) {
  return (
    <footer className="mt-16 border-t border-[var(--line)]">
      <div className="mx-auto flex max-w-[1120px] flex-col gap-4 px-5 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="inline-flex items-center gap-2">
          <Image
            src="/logo.png"
            alt=""
            width={24}
            height={24}
            className="rounded-md"
          />
          {settings.name} · {new Date().getFullYear()}
        </p>
        <nav className="flex flex-wrap gap-4">
          <a href={`mailto:${settings.contactEmail}`}>{settings.contactEmail}</a>
          <a href={settings.instagramUrl} target="_blank" rel="noreferrer">
            {settings.instagramHandle}
          </a>
          <Link href="/terminos">Términos</Link>
          <Link href="/privacidad">Privacidad</Link>
          <Link href="/compra-entrega">Compra y entrega</Link>
        </nav>
      </div>
    </footer>
  );
}
