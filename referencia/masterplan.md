# Masterplan — Resalto Ideas (Claude Code)

**Producto:** tienda propia de diseños digitales.  
**Fuentes:** [PRD.md](../../PRD.md) · [design-system.md](./design-system.md) · [stack.md](./stack.md) · 9 pantallas de [masterprompt-claude-design.md](./masterprompt-claude-design.md)  
**Legado (solo referencia de negocio):** `app-digitales/` — no copiar UI ni Drive.  
**Fecha:** 2026-08-25

Este documento es la spec de implementación. Claude Design no se ejecutó: las 9 pantallas del masterprompt **son** el prototipo acordado.

---

## 0. Cómo implementar

1. App Next.js en `app-digitales2/web/` (el “cerebro” `contexto/`, `planes/`, `salidas/` se queda al lado, no adentro de `web`).
2. Schema: archivo SQL de migración en `web/supabase/migrations/`. **Si el MCP de Supabase está conectado en la sesión, aplicar las tablas con las tools MCP** (no pedirle al usuario que las cree a mano en el dashboard). Si no hay MCP, correr las migraciones con Supabase CLI o pegar el SQL una vez.
3. Design system: tokens CSS + Tailwind theme. Fraunces + Plus Jakarta Sans (next/font/google). Iconos Lucide.
4. No migrar del legado: coaching, sponsors, portfolio, testimonios, branding JSON infinito, Google Drive.

**En esta sesión el MCP de Supabase no aparece como namespace.** Al codear: intentar MCP; si no está, usar el SQL de este plan.

---

## 1. Circuito a construir (orden)

```
Admin sube preview + entregables → publica
Visitante (IG) → ficha → checkout (nombre + email x2) → Mercado Pago
Webhook pagado → pedido paid → Resend con links firmados + aviso interno
Si el mail está mal → admin edita email y reenvía
```

Paridad con el legado: checkout MP, ticket/pedido, resend. Mejora: Storage propio, varios archivos, confirmar email, políticas, UI nueva.

---

## 2. Estructura de carpetas

```
app-digitales2/
├── contexto/ …          # cerebro, no tocar en el build de la app
├── salidas/             # este masterplan, DS, PRD links
└── web/                 # ← Next.js
    ├── app/
    │   ├── globals.css
    │   ├── layout.tsx                 # fuentes + tokens
    │   ├── (tienda)/
    │   │   ├── layout.tsx             # StoreShell (nav pública, footer)
    │   │   ├── page.tsx               # 1 Home
    │   │   ├── tienda/page.tsx        # 2 Catálogo
    │   │   ├── tienda/[slug]/page.tsx # 3 Ficha
    │   │   ├── comprar/[slug]/page.tsx# 4 Checkout
    │   │   ├── gracias/page.tsx       # 5 Post-pago
    │   │   ├── terminos/page.tsx
    │   │   ├── privacidad/page.tsx
    │   │   └── compra-entrega/page.tsx
    │   ├── login/page.tsx             # 6 Login (sin nav de tienda)
    │   ├── admin/
    │   │   ├── layout.tsx             # AdminShell (sidebar wordmark)
    │   │   ├── page.tsx               # 7 Inicio
    │   │   ├── productos/page.tsx     # lista (necesaria; no estaba en el prototipo)
    │   │   ├── productos/nuevo/page.tsx
    │   │   ├── productos/[id]/page.tsx# 8 Alta/edición
    │   │   ├── pedidos/page.tsx       # 9 Pedidos
    │   │   └── contenido/page.tsx     # 9 Contenido + políticas
    │   └── api/
    │       ├── checkout/route.ts
    │       ├── webhooks/mercadopago/route.ts
    │       └── download/[orderId]/[fileId]/route.ts
    ├── components/
    │   ├── ui/          # Button, Input, Badge, Alert, Wordmark
    │   ├── store/       # StoreNav, Footer, ProductCard, PreviewFrame,
    │   │                # IncludesList, InternationalNotice, CheckoutForm
    │   └── admin/       # AdminSidebar, Kpi, OrderRow, FileDropzone,
    │                    # EmailEditDialog
    ├── lib/
    │   ├── supabase/client.ts
    │   ├── supabase/server.ts
    │   ├── supabase/admin.ts          # service role (webhook, signed URLs)
    │   ├── mercadopago.ts
    │   ├── resend.ts
    │   ├── compress.ts                # sharp previews
    │   ├── money.ts                   # ARS
    │   └── auth.ts                    # requireAdmin()
    ├── emails/
    │   ├── purchase.tsx               # al comprador
    │   └── sale-notice.tsx            # a resaltoideas@gmail.com
    ├── supabase/
    │   ├── migrations/20260825_init.sql
    │   └── seed.sql                   # 3 productos demo (opcional)
    ├── public/
    └── .env.local                     # no commitear
```

---

## 3. Schema de base de datos (Postgres / Supabase)

Convenciones: `snake_case`, UUID PK, `created_at`/`updated_at`, índice en cada FK, RLS.

### 3.1 Enums y tablas

```sql
create extension if not exists "pgcrypto";

create type public.file_kind as enum ('preview', 'deliverable');
create type public.order_status as enum (
  'pending',
  'paid',
  'delivered',
  'email_failed',
  'cancelled'
);

-- Un admin = fila en auth.users. Este perfil marca el rol.
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  role text not null default 'admin' check (role = 'admin'),
  created_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null default '',
  price_ars integer not null check (price_ars >= 0),
  category text,
  featured boolean not null default false,
  published boolean not null default false,
  sales_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index products_published_idx on public.products (published);
create index products_featured_idx on public.products (featured) where featured = true;

create table public.product_files (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  kind public.file_kind not null,
  storage_bucket text not null,
  storage_path text not null,
  display_name text not null,
  mime_type text,
  size_bytes bigint,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index product_files_product_id_idx on public.product_files (product_id);
create index product_files_kind_idx on public.product_files (product_id, kind);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products (id) on delete set null,
  product_title text not null,
  buyer_name text not null,
  buyer_email text not null,
  total_ars integer not null,
  status public.order_status not null default 'pending',
  mp_preference_id text,
  mp_payment_id text unique,
  mp_status text,
  delivered_at timestamptz,
  last_email_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index orders_status_idx on public.orders (status);
create index orders_buyer_email_idx on public.orders (buyer_email);
create index orders_created_at_idx on public.orders (created_at desc);
create index orders_mp_preference_id_idx on public.orders (mp_preference_id);

-- Textos de tienda (home, aviso internacional, contacto)
create table public.site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- Políticas
create table public.legal_pages (
  slug text primary key check (slug in ('terminos', 'privacidad', 'compra-entrega')),
  title text not null,
  body text not null default '',
  updated_at timestamptz not null default now()
);
```

### 3.2 Trigger updated_at

```sql
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger products_touch before update on public.products
  for each row execute function public.touch_updated_at();
create trigger orders_touch before update on public.orders
  for each row execute function public.touch_updated_at();
```

### 3.3 RLS

```sql
alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.product_files enable row level security;
alter table public.orders enable row level security;
alter table public.site_settings enable row level security;
alter table public.legal_pages enable row level security;

create or replace function public.is_admin()
returns boolean language sql stable security definer as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  );
$$;

-- Productos: el mundo ve publicados; admin ve todo
create policy products_public_read on public.products
  for select using (published = true or public.is_admin());
create policy products_admin_write on public.products
  for all using (public.is_admin()) with check (public.is_admin());

-- Files: metadatos de preview públicos; entregables solo admin
-- (el binario se sirve por signed URL, no por select anónimo del path privado)
create policy files_preview_read on public.product_files
  for select using (
    kind = 'preview'
    and exists (
      select 1 from public.products pr
      where pr.id = product_id and (pr.published = true or public.is_admin())
    )
  );
create policy files_admin_all on public.product_files
  for all using (public.is_admin()) with check (public.is_admin());

-- Settings y legales: lectura pública, escritura admin
create policy settings_read on public.site_settings for select using (true);
create policy settings_admin on public.site_settings
  for all using (public.is_admin()) with check (public.is_admin());
create policy legal_read on public.legal_pages for select using (true);
create policy legal_admin on public.legal_pages
  for all using (public.is_admin()) with check (public.is_admin());

-- Pedidos: solo admin (el webhook usa service role y bypasea RLS)
create policy orders_admin on public.orders
  for all using (public.is_admin()) with check (public.is_admin());

create policy profiles_self on public.profiles
  for select using (auth.uid() = id);
```

Service role (Route Handler del webhook, generación de signed URLs, insert de order): **nunca** en el cliente.

### 3.4 Storage

| Bucket | Público | Contenido |
|--------|---------|-----------|
| `previews` | sí | JPG/WebP/PNG de catálogo y ficha. Path: `{product_id}/{filename}` |
| `deliverables` | no | AI, SVG, PSD, ZIP, PDF, etc. Path: `{product_id}/{filename}` |

Políticas storage:

- `previews`: `select` anónimo; `insert/update/delete` admin.
- `deliverables`: ningún `select` anónimo; admin write; lectura de bytes **solo** via signed URL creada con service role en `/api/download/...` (validar que el `order` esté `paid` o `delivered` — para el mail usamos token firmado de corta vida, ver §5).

Al subir preview: pasar por `sharp` (lado mayor 1600px, quality ~80, webp o jpeg). Entregable imagen: opcional. ZIP/AI/PSD/PDF: no comprimir.

Límite sugerido UI: preview 5 MB c/u; entregable 80 MB c/u (avisar en el dropzone).

### 3.5 Seed de settings y legales

```sql
insert into public.site_settings (key, value) values
  ('brand', '{"name":"Resalto Ideas","tagline":"Tienda de productos digitales"}'),
  ('home', '{"heroTitle":"Diseños que pagás y te llegan al mail.","heroSubtitle":"Preview en la tienda. Archivos editables después de Mercado Pago."}'),
  ('contact', '{"email":"resaltoideas@gmail.com","instagram":"https://instagram.com/resaltoideas"}'),
  ('internationalNotice', '{"title":"¿Comprás desde el exterior?","body":"Escribinos a resaltoideas@gmail.com y coordinamos el pago."}');

insert into public.legal_pages (slug, title, body) values
  ('terminos', 'Términos y condiciones', ''),
  ('privacidad', 'Privacidad', ''),
  ('compra-entrega', 'Compra y entrega digital', 'Producto digital de entrega inmediata por email. Revisá que el correo esté bien escrito.');
```

Admin: crear el usuario en Supabase Auth (email del dueño) y una fila en `profiles`. No hay signup público.

---

## 4. Páginas (mapeo prototipo → rutas)

| # | Prototipo | Ruta | Job |
|---|-----------|------|-----|
| 1 | Home | `/` | Wordmark, hero, 3 featured |
| 2 | Tienda | `/tienda` | Grid publicados |
| 3 | Ficha | `/tienda/[slug]` | Preview grande, qué incluye, Comprar |
| 4 | Checkout | `/comprar/[slug]` | Nombre, email, confirmar email, MP |
| 5 | Gracias | `/gracias?order=` | Revisá tu email |
| 6 | Login | `/login` | Solo admin, wordmark hero |
| 7 | Admin inicio | `/admin` | KPIs, necesitan atención |
| 8 | Admin producto | `/admin/productos/nuevo` · `/admin/productos/[id]` | Dos dropzones |
| 9 | Pedidos + contenido | `/admin/pedidos` · `/admin/contenido` | Reenviar / editar email; textos y políticas |

**Páginas extra (mismo layout, no inflan el MVP):**

- `/admin/productos` — lista para no editar a ciegas
- `/terminos` `/privacidad` `/compra-entrega` — leen `legal_pages`

Login **no** va en la nav pública.

---

## 5. Lógica de backend

### 5.1 Checkout `POST /api/checkout`

Body: `{ slug, buyerName, buyerEmail, buyerEmailConfirm }`.

- Validar emails iguales; normalizar lowercase/trim.
- Producto `published`.
- Insert `orders` `pending` (service role).
- Crear preference MP: `external_reference = order.id`, `back_urls.success = {SITE}/gracias?order={id}`, notification_url webhook.
- Responder `{ initPoint }` y redirigir en el cliente.

### 5.2 Webhook `POST /api/webhooks/mercadopago`

- Verificar firma (`MP_WEBHOOK_SECRET`) si está configurada.
- Idempotencia: si `mp_payment_id` ya existe, 200 y salir.
- Si pago aprobado: `status = paid`, guardar ids MP.
- Llamar `deliverOrder(orderId)`: signed URLs de **todos** los `deliverable` (expiración 7 días), email Resend al buyer, email aviso a `resaltoideas@gmail.com`, `status = delivered` o `email_failed` si Resend falla.
- Responder 200 siempre que el payload se haya entendido (evitar retries eternos); el estado queda en `orders`.

### 5.3 Descarga `GET /api/download/[orderId]/[fileId]?token=`

No exponer paths de Storage. Token HMAC o signed JWT (`orderId+fileId+exp`) emitido al mandar el mail. Validar orden paid/delivered y file.kind = deliverable. Redirect a signed URL de 60s o stream.

### 5.4 Admin

- `requireAdmin()` en layout `/admin`.
- Reenviar: regenera token + Resend; no cobra de nuevo.
- Editar email: update `buyer_email` + reenviar (el caso gmial.com).
- Upload: cliente pide signed upload al bucket correcto según dropzone; el server escribe `product_files`.

### 5.5 Emails

- Comprador: gracias + botón por cada archivo (display_name) + nota de spam.
- Interno: producto, total ARS, email, link a `/admin/pedidos`.
- From: Resend. Reply-to: `resaltoideas@gmail.com`.

---

## 6. Componentes frontend

### UI (design system)

- `Wordmark` — Fraunces “Resalto Ideas” + subtítulo
- `Button` — primary Rose / secondary Line / danger
- `Input`, `Textarea`
- `Badge` — publicado / oculto / featured / MP / estados de pedido
- `Alert` — ok / warn / danger
- `Page` — fondo Rose wash + mist

### Tienda

- `StoreNav` — Inicio, Tienda (sin Admin)
- `StoreFooter` — email, Instagram, políticas
- `ProductCard`
- `PreviewFrame`
- `IncludesList` — nombres, no URLs
- `InternationalNotice`
- `CheckoutForm` — confirmación de email

### Admin

- `AdminSidebar` — wordmark hero; Inicio, Productos, Pedidos, Contenido
- `KpiRow`
- `AttentionList`
- `ProductForm` + `FileDropzone` (prop `kind`: preview | deliverable)
- `OrdersTable` / `OrderRow`
- `EmailEditDialog`
- `ContentForm` + editor de `legal_pages`

Copy: español rioplatense. Precios: `ARS 18.500` (punto de miles).

---

## 7. Fuera de alcance (no codear)

Carrito, cuenta de comprador, reembolsos in-app, Stripe/PayPal, multi-admin, cupones, watermark automático, Drive, módulos extra del legado.

---

## 8. Criterio de “listo para producción”

- Publicar producto con preview + 2 entregables, sin Drive.
- Pagar en sandbox MP y recibir el mail con links que descargan.
- Email mal escrito: se corrige en pedidos y el reenvío llega.
- `/login` no está en la nav. RLS: anónimo no lista `deliverables`.
- Home y ficha se ven bien en viewport 390px (Instagram).
