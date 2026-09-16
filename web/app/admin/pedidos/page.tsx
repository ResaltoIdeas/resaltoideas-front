import { getOrders } from "@/lib/db";
import { formatArs } from "@/lib/money";
import { Badge } from "@/components/ui/Badge";
import { OrderActions } from "@/components/admin/OrderActions";

export const metadata = { title: "Pedidos" };

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

export default async function OrdersPage() {
  const orders = await getOrders();

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Pedidos</h1>
      <p className="mt-2 text-sm text-muted">
        Si el comprador se equivocó el mail, corregilo y reenviá.
      </p>
      <div className="mt-8 overflow-x-auto rounded-xl border border-[var(--line)] bg-surface">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="bg-rose-wash text-left text-[13px] font-medium text-muted">
            <tr>
              <th className="px-4 py-3">Fecha</th>
              <th className="px-4 py-3">Producto</th>
              <th className="px-4 py-3">Comprador</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-t border-[var(--line)] align-top">
                <td className="px-4 py-3 text-muted">
                  {new Date(o.createdAt).toLocaleString("es-AR")}
                </td>
                <td className="px-4 py-3">{o.productTitle}</td>
                <td className="px-4 py-3">
                  <p className="font-medium">{o.buyerName}</p>
                  <p className="text-muted">{o.buyerEmail}</p>
                  {o.lastEmailError ? (
                    <p className="mt-1 text-xs text-danger">{o.lastEmailError}</p>
                  ) : null}
                </td>
                <td className="px-4 py-3">
                  <Badge tone={statusTone(o.status)}>{labels[o.status]}</Badge>
                </td>
                <td className="px-4 py-3 tabular-nums">{formatArs(o.totalArs)}</td>
                <td className="px-4 py-3">
                  <OrderActions order={o} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
