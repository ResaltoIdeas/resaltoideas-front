export type FileKind = "preview" | "deliverable";

export type OrderStatus =
  | "pending"
  | "paid"
  | "delivered"
  | "email_failed"
  | "cancelled";

export type ProductFile = {
  id: string;
  kind: FileKind;
  displayName: string;
  storagePath: string | null;
  storageBucket?: string | null;
  mimeType?: string | null;
  publicUrl?: string | null;
};

export type Product = {
  id: string;
  slug: string;
  title: string;
  description: string;
  priceArs: number;
  category: string;
  featured: boolean;
  published: boolean;
  previewTone: string;
  files: ProductFile[];
  createdAt: string;
};

export type Order = {
  id: string;
  productId: string;
  productTitle: string;
  buyerName: string;
  buyerEmail: string;
  totalArs: number;
  status: OrderStatus;
  createdAt: string;
  lastEmailError: string | null;
  mpPreferenceId?: string | null;
  mpPaymentId?: string | null;
};

export type SiteSettings = {
  name: string;
  tagline: string;
  heroTitle: string;
  heroSubtitle: string;
  contactEmail: string;
  instagramUrl: string;
  instagramHandle: string;
  internationalTitle: string;
  internationalBody: string;
};

export type LegalPage = {
  slug: "terminos" | "privacidad" | "compra-entrega";
  title: string;
  body: string;
};
