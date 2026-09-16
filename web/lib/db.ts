import { supabaseAdmin, publicPreviewUrl } from "@/lib/supabase/admin";
import type {
  LegalPage,
  Order,
  OrderStatus,
  Product,
  ProductFile,
  SiteSettings,
} from "@/lib/types";

const DEFAULT_SETTINGS: SiteSettings = {
  name: "Resalto Ideas",
  tagline: "Tienda de productos digitales",
  heroTitle: "Diseños que pagás y te llegan al mail.",
  heroSubtitle: "Preview en la tienda. Archivos editables después de Mercado Pago.",
  contactEmail: "resaltoideas@gmail.com",
  instagramUrl: "https://instagram.com/resaltoideas",
  instagramHandle: "@resaltoideas",
  internationalTitle: "¿Comprás desde el exterior?",
  internationalBody: "Escribinos a resaltoideas@gmail.com y coordinamos el pago.",
};

export async function isSchemaReady() {
  try {
    const { error } = await supabaseAdmin()
      .from("products")
      .select("id")
      .limit(1);
    return !error;
  } catch {
    return false;
  }
}

function mapFile(row: Record<string, unknown>): ProductFile {
  const kind = row.kind as ProductFile["kind"];
  const storagePath = String(row.storage_path ?? "");
  return {
    id: String(row.id),
    kind,
    displayName: String(row.display_name ?? ""),
    storagePath,
    storageBucket: String(row.storage_bucket ?? ""),
    mimeType: row.mime_type ? String(row.mime_type) : null,
    publicUrl:
      kind === "preview" ? publicPreviewUrl(storagePath) : null,
  };
}

function mapProduct(
  row: Record<string, unknown>,
  files: ProductFile[],
): Product {
  return {
    id: String(row.id),
    slug: String(row.slug),
    title: String(row.title),
    description: String(row.description ?? ""),
    priceArs: Number(row.price_ars ?? 0),
    category: String(row.category ?? ""),
    featured: Boolean(row.featured),
    published: Boolean(row.published),
    previewTone: String(row.preview_tone ?? "from-[#f6bfd2] to-[#e78cab]"),
    files,
    createdAt: String(row.created_at ?? ""),
  };
}

function mapOrder(row: Record<string, unknown>): Order {
  return {
    id: String(row.id),
    productId: String(row.product_id ?? ""),
    productTitle: String(row.product_title),
    buyerName: String(row.buyer_name),
    buyerEmail: String(row.buyer_email),
    totalArs: Number(row.total_ars ?? 0),
    status: row.status as OrderStatus,
    createdAt: String(row.created_at ?? ""),
    lastEmailError: row.last_email_error ? String(row.last_email_error) : null,
    mpPreferenceId: row.mp_preference_id ? String(row.mp_preference_id) : null,
    mpPaymentId: row.mp_payment_id ? String(row.mp_payment_id) : null,
  };
}

async function filesForProducts(productIds: string[]) {
  if (!productIds.length) return new Map<string, ProductFile[]>();
  const { data, error } = await supabaseAdmin()
    .from("product_files")
    .select("*")
    .in("product_id", productIds)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  const map = new Map<string, ProductFile[]>();
  for (const row of data ?? []) {
    const pid = String(row.product_id);
    const list = map.get(pid) ?? [];
    list.push(mapFile(row));
    map.set(pid, list);
  }
  return map;
}

export async function getSettings(): Promise<SiteSettings> {
  const { data, error } = await supabaseAdmin()
    .from("site_settings")
    .select("value")
    .eq("key", "store")
    .maybeSingle();
  if (error) {
    console.error(error.message);
    return DEFAULT_SETTINGS;
  }
  return { ...DEFAULT_SETTINGS, ...(data?.value as Partial<SiteSettings> | undefined) };
}

export async function getLegal(): Promise<LegalPage[]> {
  const { data, error } = await supabaseAdmin()
    .from("legal_pages")
    .select("*")
    .order("slug");
  if (error) {
    console.error(error.message);
    return [];
  }
  return (data ?? []) as LegalPage[];
}

export async function getLegalBySlug(slug: string) {
  const { data, error } = await supabaseAdmin()
    .from("legal_pages")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return (data as LegalPage | null) ?? undefined;
}

async function withFiles(rows: Record<string, unknown>[]): Promise<Product[]> {
  const files = await filesForProducts(rows.map((r) => String(r.id)));
  return rows.map((r) => mapProduct(r, files.get(String(r.id)) ?? []));
}

export async function getPublishedProducts(): Promise<Product[]> {
  const { data, error } = await supabaseAdmin()
    .from("products")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });
  if (error) {
    console.error(error.message);
    return [];
  }
  return withFiles((data ?? []) as Record<string, unknown>[]);
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const { data, error } = await supabaseAdmin()
    .from("products")
    .select("*")
    .eq("published", true)
    .eq("featured", true)
    .order("created_at", { ascending: false })
    .limit(12);
  if (error) {
    console.error(error.message);
    return [];
  }
  return withFiles((data ?? []) as Record<string, unknown>[]);
}

export async function getProductBySlug(slug: string) {
  const { data, error } = await supabaseAdmin()
    .from("products")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) {
    console.error(error.message);
    return undefined;
  }
  if (!data) return undefined;
  const [product] = await withFiles([data as Record<string, unknown>]);
  return product;
}

export async function getAllProducts(): Promise<Product[]> {
  const { data, error } = await supabaseAdmin()
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    console.error(error.message);
    return [];
  }
  return withFiles((data ?? []) as Record<string, unknown>[]);
}

export async function getProductById(id: string) {
  const { data, error } = await supabaseAdmin()
    .from("products")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) {
    console.error(error.message);
    return undefined;
  }
  if (!data) return undefined;
  const [product] = await withFiles([data as Record<string, unknown>]);
  return product;
}

export async function upsertProduct(product: Product) {
  const { error } = await supabaseAdmin().from("products").upsert({
    id: product.id,
    slug: product.slug,
    title: product.title,
    description: product.description,
    price_ars: product.priceArs,
    category: product.category || null,
    featured: product.featured,
    published: product.published,
    preview_tone: product.previewTone,
  });
  if (error) throw error;
}

export async function replaceProductFiles(
  productId: string,
  files: Array<{
    id: string;
    kind: "preview" | "deliverable";
    storageBucket: string;
    storagePath: string;
    displayName: string;
    mimeType?: string | null;
    sizeBytes?: number | null;
    sortOrder: number;
  }>,
) {
  const db = supabaseAdmin();
  const { error: delErr } = await db
    .from("product_files")
    .delete()
    .eq("product_id", productId);
  if (delErr) throw delErr;
  if (!files.length) return;
  const { error } = await db.from("product_files").insert(
    files.map((f) => ({
      id: f.id,
      product_id: productId,
      kind: f.kind,
      storage_bucket: f.storageBucket,
      storage_path: f.storagePath,
      display_name: f.displayName,
      mime_type: f.mimeType ?? null,
      size_bytes: f.sizeBytes ?? null,
      sort_order: f.sortOrder,
    })),
  );
  if (error) throw error;
}

export async function getOrders(): Promise<Order[]> {
  const { data, error } = await supabaseAdmin()
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    console.error(error.message);
    return [];
  }
  return (data ?? []).map((row) => mapOrder(row as Record<string, unknown>));
}

export async function getOrderById(id: string) {
  const { data, error } = await supabaseAdmin()
    .from("orders")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data ? mapOrder(data as Record<string, unknown>) : undefined;
}

export async function addOrder(order: Order) {
  const { error } = await supabaseAdmin().from("orders").insert({
    id: order.id,
    product_id: order.productId || null,
    product_title: order.productTitle,
    buyer_name: order.buyerName,
    buyer_email: order.buyerEmail,
    total_ars: order.totalArs,
    status: order.status,
    mp_preference_id: order.mpPreferenceId ?? null,
    mp_payment_id: order.mpPaymentId ?? null,
    last_email_error: order.lastEmailError,
  });
  if (error) throw error;
}

export async function updateOrder(id: string, patch: Partial<Order>) {
  const row: Record<string, unknown> = {};
  if (patch.buyerEmail !== undefined) row.buyer_email = patch.buyerEmail;
  if (patch.status !== undefined) row.status = patch.status;
  if (patch.lastEmailError !== undefined) row.last_email_error = patch.lastEmailError;
  if (patch.mpPreferenceId !== undefined) row.mp_preference_id = patch.mpPreferenceId;
  if (patch.mpPaymentId !== undefined) row.mp_payment_id = patch.mpPaymentId;
  if (patch.status === "delivered") row.delivered_at = new Date().toISOString();
  const { data, error } = await supabaseAdmin()
    .from("orders")
    .update(row)
    .eq("id", id)
    .select("*")
    .maybeSingle();
  if (error) throw error;
  return data ? mapOrder(data as Record<string, unknown>) : null;
}

export async function getOrderByPaymentId(paymentId: string) {
  const { data, error } = await supabaseAdmin()
    .from("orders")
    .select("*")
    .eq("mp_payment_id", paymentId)
    .maybeSingle();
  if (error) throw error;
  return data ? mapOrder(data as Record<string, unknown>) : undefined;
}

export async function updateSettings(settings: SiteSettings) {
  const { error } = await supabaseAdmin().from("site_settings").upsert({
    key: "store",
    value: settings,
    updated_at: new Date().toISOString(),
  });
  if (error) throw error;
}

export async function updateLegal(pages: LegalPage[]) {
  const db = supabaseAdmin();
  for (const page of pages) {
    const { error } = await db.from("legal_pages").upsert({
      slug: page.slug,
      title: page.title,
      body: page.body,
      updated_at: new Date().toISOString(),
    });
    if (error) throw error;
  }
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function newId() {
  return crypto.randomUUID();
}

export async function signedDeliverableUrl(path: string, expiresIn = 60 * 60 * 24 * 7) {
  const { data, error } = await supabaseAdmin()
    .storage.from("deliverables")
    .createSignedUrl(path, expiresIn);
  if (error) throw error;
  return data.signedUrl;
}

export async function uploadProductObject(opts: {
  bucket: "previews" | "deliverables";
  path: string;
  bytes: Buffer;
  contentType: string;
}) {
  const { error } = await supabaseAdmin()
    .storage.from(opts.bucket)
    .upload(opts.path, opts.bytes, {
      contentType: opts.contentType,
      upsert: true,
    });
  if (error) throw error;
}

export async function removeStorageObject(bucket: string, path: string) {
  if (!path) return;
  await supabaseAdmin().storage.from(bucket).remove([path]);
}
