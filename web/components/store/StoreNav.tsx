"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Wordmark } from "@/components/ui/Wordmark";
import { cn } from "@/lib/utils";

export function StoreNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1120px] items-center justify-between gap-4 px-5 py-3 sm:px-6">
        <Wordmark size="sm" subtitle={false} />
        <nav className="flex items-center gap-5 text-sm font-medium">
          <Link
            href="/"
            className={cn(
              "hover:text-ink",
              pathname === "/" ? "text-ink" : "text-muted",
            )}
          >
            Inicio
          </Link>
          <Link
            href="/tienda"
            className={cn(
              "hover:text-ink",
              pathname.startsWith("/tienda") || pathname.startsWith("/comprar")
                ? "text-ink"
                : "text-muted",
            )}
          >
            Tienda
          </Link>
        </nav>
      </div>
    </header>
  );
}
