import { getMpPayment } from "@/lib/mercadopago";
import { deliverOrder } from "@/lib/deliver";
import { getOrderById, getOrderByPaymentId, updateOrder } from "@/lib/db";

export async function fulfillMpPayment(paymentId: string) {
  const existing = await getOrderByPaymentId(paymentId);
  if (existing?.status === "delivered") {
    return { ok: true, already: true };
  }
  if (existing?.status === "paid" || existing?.status === "email_failed") {
    await deliverOrder(existing.id);
    return { ok: true, already: true };
  }

  const payment = await getMpPayment(paymentId);
  const orderId = String(
    payment.metadata?.order_id || payment.external_reference || "",
  );
  if (!orderId) return { ok: false, ignored: true };

  const order = await getOrderById(orderId);
  if (!order) return { ok: false, ignored: true };

  const status = String(payment.status || "");

  if (status === "approved") {
    await updateOrder(orderId, {
      status: "paid",
      mpPaymentId: String(payment.id),
    });
    await deliverOrder(orderId);
    return { ok: true, paid: true };
  }

  if (status === "rejected" || status === "cancelled") {
    await updateOrder(orderId, {
      status: "cancelled",
      mpPaymentId: String(payment.id),
    });
    return { ok: true, cancelled: true };
  }

  await updateOrder(orderId, { mpPaymentId: String(payment.id) });
  return { ok: true, pending: true, status };
}
