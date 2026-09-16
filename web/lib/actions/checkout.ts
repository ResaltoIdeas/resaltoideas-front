"use server";

import { redirect } from "next/navigation";
import { addOrder, getProductBySlug, newId, updateOrder } from "@/lib/db";
import { createMpPreference } from "@/lib/mercadopago";

export async function checkoutAction(_: unknown, formData: FormData) {
  const slug = String(formData.get("slug") ?? "");
  const buyerName = String(formData.get("buyerName") ?? "").trim();
  const buyerEmail = String(formData.get("buyerEmail") ?? "")
    .trim()
    .toLowerCase();
  const buyerEmailConfirm = String(formData.get("buyerEmailConfirm") ?? "")
    .trim()
    .toLowerCase();

  if (!buyerName || !buyerEmail || !buyerEmailConfirm) {
    return { error: "Completá nombre y los dos emails." };
  }
  if (buyerEmail !== buyerEmailConfirm) {
    return {
      error: "Los emails no coinciden. Revisalos, es donde llega el archivo.",
    };
  }

  const product = await getProductBySlug(slug);
  if (!product || !product.published) {
    return { error: "Ese producto no está disponible." };
  }

  const orderId = newId();
  await addOrder({
    id: orderId,
    productId: product.id,
    productTitle: product.title,
    buyerName,
    buyerEmail,
    totalArs: product.priceArs,
    status: "pending",
    createdAt: new Date().toISOString(),
    lastEmailError: null,
  });

  let initPoint = "";
  try {
    const pref = await createMpPreference({
      orderId,
      title: product.title,
      priceArs: product.priceArs,
      buyerName,
      buyerEmail,
    });
    await updateOrder(orderId, { mpPreferenceId: pref.preferenceId });
    if (!pref.initPoint) {
      return { error: "Mercado Pago no devolvió el link de pago." };
    }
    initPoint = pref.initPoint;
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "No se pudo iniciar el pago.";
    return { error: message };
  }

  redirect(initPoint);
}
