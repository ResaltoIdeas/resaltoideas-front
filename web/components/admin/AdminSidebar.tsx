"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, Receipt, Settings } from "lucide-react";
import { Wordmark } from "@/components/ui/Wordmark";
import { logoutAction } from "@/lib/actions/auth";

const links = [
  { href: "/admin", label: "Inicio", icon: LayoutDashboard },
  { href: "/admin/productos", label: "Productos", icon: Package },
  { href: "/admin/pedidos", label: "Pedidos", icon: Receipt },
  { href: "/admin/contenido", label: "Contenido", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-full flex-col border-b border-[var(--line)] bg-surface p-5 md:min-h-screen md:w-64 md:border-b-0 md:border-r">
      <Wordmark size="sm" href="/admin" />
      <nav className="mt-8 flex flex-col gap-1">
        {links.map((l) => {
          const active =
            l.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(l.href);
          const Icon = l.icon;
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium ${
                active ? "bg-rose-wash text-ink" : "text-muted hover:bg-rose-wash hover:text-ink"
              }`}
            >
              <Icon size={18} strokeWidth={1.75} />
              {l.label}
            </Link>
          );
        })}
      </nav>
      <form action={logoutAction} className="mt-auto pt-6">
        <button type="submit" className="text-sm font-medium text-danger">
          Salir
        </button>
      </form>
    </aside>
  );
}
