import {
  getOrderById,
  getProductById,
  signedDeliverableUrl,
  updateOrder,
} from "@/lib/db";

export async function deliverOrder(orderId: string, opts?: { force?: boolean }) {
  const order = await getOrderById(orderId);
  if (!order) return { ok: false as const, error: "Pedido no encontrado" };
  if (order.status === "delivered" && !opts?.force) {
    return { ok: true as const, already: true };
  }

  const product = order.productId
    ? await getProductById(order.productId)
    : undefined;
  const files = (product?.files ?? []).filter((f) => f.kind === "deliverable");

  const links: { name: string; url: string }[] = [];
  for (const file of files) {
    if (!file.storagePath) continue;
    const url = await signedDeliverableUrl(file.storagePath);
    links.push({ name: file.displayName, url });
  }

  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    await updateOrder(orderId, {
      status: "email_failed",
      lastEmailError:
        "Pago ok. Falta configurar Resend para enviar el mail con los archivos.",
    });
    return { ok: true as const, emailed: false };
  }

  const configuredFrom =
    process.env.RESEND_FROM || process.env.RESEND_FROM_EMAIL || "";
  const gmailLike = /@(gmail|googlemail|hotmail|outlook|yahoo)\./i.test(
    configuredFrom,
  );
  const from = gmailLike || !configuredFrom
    ? "Resalto Ideas <onboarding@resend.dev>"
    : configuredFrom.includes("<")
      ? configuredFrom
      : `Resalto Ideas <${configuredFrom}>`;
  const html = `
    <p>Hola ${escapeHtml(order.buyerName)},</p>
    <p>Gracias por tu compra de <strong>${escapeHtml(order.productTitle)}</strong>.</p>
    <p>Descargá tus archivos:</p>
    <ul>
      ${links
        .map(
          (l) =>
            `<li><a href="${escapeHtml(l.url)}">${escapeHtml(l.name)}</a></li>`,
        )
        .join("")}
    </ul>
    <p>Si no ves los botones, revisá spam.</p>
  `;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [order.buyerEmail],
      reply_to: "resaltoideas@gmail.com",
      subject: `Tu compra: ${order.productTitle}`,
      html,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    await updateOrder(orderId, {
      status: "email_failed",
      lastEmailError: text.slice(0, 280),
    });
    return { ok: true as const, emailed: false };
  }

  await updateOrder(orderId, {
    status: "delivered",
    lastEmailError: null,
  });
  return { ok: true as const, emailed: true };
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
