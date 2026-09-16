import Link from "next/link";
import { getOrders } from "@/lib/db";
import { formatArs } from "@/lib/money";
import { Badge } from "@/components/ui/Badge";

export const metadata = { title: "Admin" };

function statusTone(status: string) {
  if (status === "delivered") return "ok" as const;
  if (status === "email_failed") return "danger" as const;
  if (status === "paid") return "warn" as const;
  return "muted" as const;
}

const labels: Record<string, string> = {
  pending: "Pendiente",
  paid: "Pagado",
  delivered: "Entregado",
  email_failed: "Error de mail",
  cancelled: "Cancelado",
};

export default async function AdminHome() {
  const orders = await getOrders();
  const today = new Date().toISOString().slice(0, 10);
  const todayOrders = orders.filter((o) => o.createdAt.startsWith(today));
  const sales = todayOrders
    .filter((o) => o.status !== "cancelled" && o.status !== "pending")
    .reduce((s, o) => s + o.totalArs, 0);
  const paid = todayOrders.filter((o) => o.status === "paid" || o.status === "delivered").length;
  const attention = orders.filter((o) => o.status === "email_failed");

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Hoy</h1>
      <p className="mt-1 text-sm text-muted">Resumen operativo, no un dashboard de marketing.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Kpi label="Ventas del día" value={formatArs(sales)} />
        <Kpi label="Pedidos pagados" value={String(paid)} />
        <Kpi label="Reenvíos pendientes" value={String(attention.length)} />
      </div>
      <section className="mt-10">
        <h2 className="font-display text-xl font-semibold">Necesitan atención</h2>
        <div className="mt-4 divide-y divide-[var(--line)] rounded-xl border border-[var(--line)] bg-surface">
          {attention.length === 0 ? (
            <p className="p-4 text-sm text-muted">Nada pendiente.</p>
          ) : (
            attention.map((o) => (
              <div key={o.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
                <div>
                  <p className="font-medium">{o.buyerName}</p>
                  <p className="text-sm text-muted">
                    {o.buyerEmail} · {o.productTitle}
                  </p>
                </div>
                <Badge tone={statusTone(o.status)}>{labels[o.status]}</Badge>
              </div>
            ))
          )}
        </div>
        <Link
          href="/admin/pedidos"
          className="mt-4 inline-block text-sm font-semibold text-rose-deep"
        >
          Ver pedidos
        </Link>
      </section>
    </div>
  );
}

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[var(--line)] bg-surface p-4 shadow-rose">
      <p className="text-xs font-medium text-muted">{label}</p>
      <p className="mt-2 font-display text-2xl font-semibold">{value}</p>
    </div>
  );
}
