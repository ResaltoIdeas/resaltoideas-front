"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { deliverOrder } from "@/lib/deliver";
import {
  getLegal,
  getProductById,
  getSettings,
  newId,
  removeStorageObject,
  replaceProductFiles,
  slugify,
  updateLegal,
  updateOrder,
  updateSettings,
  uploadProductObject,
  upsertProduct,
} from "@/lib/db";
import type { LegalPage, SiteSettings } from "@/lib/types";

async function guard() {
  const session = await requireAdmin();
  if (!session) throw new Error("No autorizado");
}

function safeFileName(name: string) {
  return name.replace(/[^\w.\-áéíóúñ]+/gi, "_").slice(0, 80) || "archivo";
}

export async function saveProductAction(formData: FormData) {
  await guard();
  const id = String(formData.get("id") || newId());
  const existing = await getProductById(id);
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const priceArs = Number(formData.get("priceArs") ?? 0);
  const category = String(formData.get("category") ?? "").trim();
  const featured = formData.get("featured") === "on";
  const published = formData.get("published") === "on";
  if (!title || Number.isNaN(priceArs)) return;

  const keepIds = new Set(formData.getAll("keepFileId").map(String));
  const kept = (existing?.files ?? []).filter((f) => keepIds.has(f.id));
  const removed = (existing?.files ?? []).filter((f) => !keepIds.has(f.id));

  for (const file of removed) {
    if (file.storagePath && file.storageBucket) {
      await removeStorageObject(file.storageBucket, file.storagePath);
    }
  }

  const newFiles: Array<{
    id: string;
    kind: "preview" | "deliverable";
    storageBucket: string;
    storagePath: string;
    displayName: string;
    mimeType?: string | null;
    sizeBytes?: number | null;
    sortOrder: number;
  }> = kept.map((f, index) => ({
    id: f.id,
    kind: f.kind,
    storageBucket: f.storageBucket || (f.kind === "preview" ? "previews" : "deliverables"),
    storagePath: f.storagePath || "",
    displayName: f.displayName,
    mimeType: f.mimeType,
    sortOrder: index,
  }));

  const previewUploads = formData.getAll("previewFiles").filter((v): v is File => v instanceof File && v.size > 0);
  const deliverableUploads = formData
    .getAll("deliverableFiles")
    .filter((v): v is File => v instanceof File && v.size > 0);

  for (const file of previewUploads) {
    const fileId = newId();
    const path = `${id}/preview/${fileId}-${safeFileName(file.name)}`;
    const bytes = Buffer.from(await file.arrayBuffer());
    await uploadProductObject({
      bucket: "previews",
      path,
      bytes,
      contentType: file.type || "image/jpeg",
    });
    newFiles.push({
      id: fileId,
      kind: "preview",
      storageBucket: "previews",
      storagePath: path,
      displayName: file.name,
      mimeType: file.type,
      sizeBytes: file.size,
      sortOrder: newFiles.length,
    });
  }

  for (const file of deliverableUploads) {
    const fileId = newId();
    const path = `${id}/deliverable/${fileId}-${safeFileName(file.name)}`;
    const bytes = Buffer.from(await file.arrayBuffer());
    await uploadProductObject({
      bucket: "deliverables",
      path,
      bytes,
      contentType: file.type || "application/octet-stream",
    });
    newFiles.push({
      id: fileId,
      kind: "deliverable",
      storageBucket: "deliverables",
      storagePath: path,
      displayName: file.name,
      mimeType: file.type,
      sizeBytes: file.size,
      sortOrder: newFiles.length,
    });
  }

  await upsertProduct({
    id,
    slug: existing?.slug || slugify(title) || id,
    title,
    description,
    priceArs,
    category,
    featured,
    published,
    previewTone: existing?.previewTone ?? "from-[#f6bfd2] to-[#e78cab]",
    files: [],
    createdAt: existing?.createdAt ?? new Date().toISOString(),
  });
  await replaceProductFiles(id, newFiles.filter((f) => f.storagePath));

  revalidatePath("/");
  revalidatePath("/tienda");
  revalidatePath("/admin");
  revalidatePath("/admin/productos");
  redirect(`/admin/productos/${id}?notice=${existing ? "saved" : "created"}`);
}

export async function resendOrderAction(orderId: string) {
  await guard();
  const result = await deliverOrder(orderId, { force: true });
  revalidatePath("/admin");
  revalidatePath("/admin/pedidos");
  if (!result.ok) {
    redirect("/admin/pedidos?notice=resent-error");
  }
  if ("emailed" in result && result.emailed === false) {
    redirect("/admin/pedidos?notice=resent-queued");
  }
  redirect("/admin/pedidos?notice=resent");
}

export async function updateOrderEmailAction(formData: FormData) {
  await guard();
  const orderId = String(formData.get("orderId") ?? "");
  const buyerEmail = String(formData.get("buyerEmail") ?? "")
    .trim()
    .toLowerCase();
  if (!orderId || !buyerEmail) return;
  await updateOrder(orderId, { buyerEmail });
  const result = await deliverOrder(orderId, { force: true });
  revalidatePath("/admin");
  revalidatePath("/admin/pedidos");
  if (!result.ok) {
    redirect("/admin/pedidos?notice=resent-error");
  }
  if ("emailed" in result && result.emailed === false) {
    redirect("/admin/pedidos?notice=resent-queued");
  }
  redirect("/admin/pedidos?notice=email");
}

export async function saveContentAction(formData: FormData) {
  await guard();
  const current = await getSettings();
  const settings: SiteSettings = {
    ...current,
    name: String(formData.get("name") ?? current.name),
    tagline: String(formData.get("tagline") ?? current.tagline),
    heroTitle: String(formData.get("heroTitle") ?? current.heroTitle),
    heroSubtitle: String(formData.get("heroSubtitle") ?? current.heroSubtitle),
    contactEmail: String(formData.get("contactEmail") ?? current.contactEmail),
    instagramHandle: String(
      formData.get("instagramHandle") ?? current.instagramHandle,
    ),
    instagramUrl: String(formData.get("instagramUrl") ?? current.instagramUrl),
    internationalTitle: String(
      formData.get("internationalTitle") ?? current.internationalTitle,
    ),
    internationalBody: String(
      formData.get("internationalBody") ?? current.internationalBody,
    ),
  };
  await updateSettings(settings);

  const legal: LegalPage[] = (await getLegal()).map((page) => ({
    ...page,
    title: String(formData.get(`${page.slug}-title`) ?? page.title),
    body: String(formData.get(`${page.slug}-body`) ?? page.body),
  }));
  await updateLegal(legal);
  revalidatePath("/");
  revalidatePath("/terminos");
  revalidatePath("/privacidad");
  revalidatePath("/compra-entrega");
  revalidatePath("/admin/contenido");
  redirect("/admin/contenido?notice=content");
}
