-- Resalto Ideas — schema inicial
create extension if not exists "pgcrypto";

do $$ begin
  create type public.file_kind as enum ('preview', 'deliverable');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.order_status as enum (
    'pending',
    'paid',
    'delivered',
    'email_failed',
    'cancelled'
  );
exception when duplicate_object then null;
end $$;

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null default '',
  price_ars integer not null check (price_ars >= 0),
  category text,
  featured boolean not null default false,
  published boolean not null default false,
  preview_tone text not null default 'from-[#f6bfd2] to-[#e78cab]',
  sales_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_published_idx on public.products (published);
create index if not exists products_featured_idx on public.products (featured) where featured = true;

create table if not exists public.product_files (
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

create index if not exists product_files_product_id_idx on public.product_files (product_id);

create table if not exists public.orders (
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

create index if not exists orders_status_idx on public.orders (status);
create index if not exists orders_buyer_email_idx on public.orders (buyer_email);
create index if not exists orders_created_at_idx on public.orders (created_at desc);
create index if not exists orders_mp_preference_id_idx on public.orders (mp_preference_id);

create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.legal_pages (
  slug text primary key check (slug in ('terminos', 'privacidad', 'compra-entrega')),
  title text not null,
  body text not null default '',
  updated_at timestamptz not null default now()
);

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_touch on public.products;
create trigger products_touch before update on public.products
  for each row execute function public.touch_updated_at();

drop trigger if exists orders_touch on public.orders;
create trigger orders_touch before update on public.orders
  for each row execute function public.touch_updated_at();

alter table public.products enable row level security;
alter table public.product_files enable row level security;
alter table public.orders enable row level security;
alter table public.site_settings enable row level security;
alter table public.legal_pages enable row level security;

drop policy if exists products_public_read on public.products;
create policy products_public_read on public.products
  for select using (published = true);

drop policy if exists files_preview_read on public.product_files;
create policy files_preview_read on public.product_files
  for select using (
    kind = 'preview'
    and exists (
      select 1 from public.products pr
      where pr.id = product_id and pr.published = true
    )
  );

drop policy if exists settings_read on public.site_settings;
create policy settings_read on public.site_settings for select using (true);

drop policy if exists legal_read on public.legal_pages;
create policy legal_read on public.legal_pages for select using (true);

-- Escrituras: service role (Next.js server) bypasea RLS.

insert into public.site_settings (key, value) values
  ('store', '{
    "name":"Resalto Ideas",
    "tagline":"Tienda de productos digitales",
    "heroTitle":"Diseños que pagás y te llegan al mail.",
    "heroSubtitle":"Preview en la tienda. Archivos editables después de Mercado Pago.",
    "contactEmail":"resaltoideas@gmail.com",
    "instagramUrl":"https://instagram.com/resaltoideas",
    "instagramHandle":"@resaltoideas",
    "internationalTitle":"¿Comprás desde el exterior?",
    "internationalBody":"Escribinos a resaltoideas@gmail.com y coordinamos el pago."
  }'::jsonb)
on conflict (key) do nothing;

insert into public.legal_pages (slug, title, body) values
  ('terminos', 'Términos y condiciones', 'Al comprar un producto digital de Resalto Ideas aceptás estas condiciones. El archivo se entrega por email luego del pago con Mercado Pago.'),
  ('privacidad', 'Privacidad', 'Usamos tu nombre y email solo para cobrar, entregarte los archivos y responder consultas. Contacto: resaltoideas@gmail.com.'),
  ('compra-entrega', 'Compra y entrega digital', 'Producto digital de entrega inmediata por email. Revisá que el correo esté bien escrito.')
on conflict (slug) do nothing;

insert into public.products (id, slug, title, description, price_ars, category, featured, published, preview_tone)
values
  ('11111111-1111-1111-1111-111111111111', 'pack-logos-cafeteria-lo-de-marta', 'Pack logos cafetería Lo de Marta', 'Isotipo y variaciones para cafetería de barrio. Archivos editables listos para imprimir y redes.', 18500, 'logos', true, true, 'from-[#f3d0c4] to-[#e78cab]'),
  ('22222222-2222-2222-2222-222222222222', 'stickers-verano-palermo', 'Stickers vectorizados Verano Palermo', 'Cinco stickers de verano, trazo limpio, para stories y merch.', 9900, 'stickers', true, true, 'from-[#f6bfd2] to-[#c9a227]'),
  ('33333333-3333-3333-3333-333333333333', 'plantillas-stories-estudio-floral', 'Plantillas Stories — estudio floral', 'Plantillas editables para Instagram Stories, paleta floral, más PDF de uso.', 12400, 'plantillas', true, true, 'from-[#e6f2e8] to-[#f6bfd2]')
on conflict (id) do nothing;
