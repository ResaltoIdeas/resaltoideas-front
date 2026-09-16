const MP_API = "https://api.mercadopago.com";

function token() {
  const t = process.env.MP_ACCESS_TOKEN;
  if (!t) throw new Error("Falta MP_ACCESS_TOKEN");
  return t;
}

export async function mpFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${MP_API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token()}`,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  const data = (await res.json().catch(() => ({}))) as T & {
    message?: string;
    error?: string;
  };
  if (!res.ok) {
    throw new Error(data.message || data.error || `Mercado Pago ${res.status}`);
  }
  return data;
}

export async function createMpPreference(input: {
  orderId: string;
  title: string;
  priceArs: number;
  buyerName: string;
  buyerEmail: string;
}) {
  const site = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(
    /\/$/,
    "",
  );
  const body = {
    items: [
      {
        title: input.title,
        quantity: 1,
        unit_price: input.priceArs,
        currency_id: "ARS",
      },
    ],
    payer: { name: input.buyerName, email: input.buyerEmail },
    metadata: {
      order_id: input.orderId,
      buyer_email: input.buyerEmail,
    },
    external_reference: input.orderId,
    back_urls: {
      success: `${site}/gracias?order=${input.orderId}`,
      failure: `${site}/gracias?order=${input.orderId}&mp=failure`,
      pending: `${site}/gracias?order=${input.orderId}&pending=1`,
    },
    auto_return: "approved" as const,
    ...(site.includes("localhost")
      ? {}
      : { notification_url: `${site}/api/webhooks/mercadopago` }),
  };

  const pref = await mpFetch<{
    id: string;
    init_point?: string;
    sandbox_init_point?: string;
  }>("/checkout/preferences", {
    method: "POST",
    body: JSON.stringify(body),
  });

  return {
    preferenceId: pref.id,
    initPoint: pref.init_point || pref.sandbox_init_point || "",
  };
}

export async function getMpPayment(paymentId: string) {
  return mpFetch<{
    id: number;
    status: string;
    metadata?: { order_id?: string; buyer_email?: string };
    external_reference?: string;
    payer?: { email?: string };
  }>(`/v1/payments/${encodeURIComponent(paymentId)}`);
}
