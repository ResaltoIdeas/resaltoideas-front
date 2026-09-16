# Plan: Catálogo paginado + destacados en coverflow

**Creado:** 2026-08-25
**Estado:** Borrador
**Pedido:** Carrusel de productos destacados elegidos en admin, y debajo un catálogo paginado (20) para que el listado no pese.

---

## Descripción General

### Qué Logra Este Plan

La home queda como galería + catálogo liviano: el coverflow 3D muestra **solo** los productos marcados como destacados; debajo, un título y una grilla de publicados **de a 20**, con páginas. `/tienda` usa la misma paginación. Elegir destacados sigue siendo el checkbox del admin, con copy más claro.

### Por Qué Importa

Hoy `getPublishedProducts()` trae **todos** los publicados y **todos** sus archivos en un solo request. Con pocos ítems no se nota; cuando el catálogo crezca, la home y `/tienda` se vuelven pesadas. El carrusel ya existe y no debe cargar el catálogo entero: solo featured (tope 12). Paginar a 20 mantiene previews chicos y queries acotadas.

---

## Estado Actual

### Estructura Existente Relevante

La app Next está en `app-digitales2/web`. **TypeScript, Tailwind v4 y `lucide-react` ya están.** `clsx` + `tailwind-merge` + `cn()` en `web/lib/utils.ts` también.

| Pieza | Estado |
| ----- | ------ |
| `web/components/ui/` | Existe (ruta default de shadcn relativa a `web/`). No hace falta crearla. |
| `web/app/globals.css` | Tokens Resalto. No hay tema shadcn (`foreground` / `muted-foreground`). |
| `coverflow-carousel.tsx` | Ya integrado y **adaptado** (4/5, `href`, fallback gradient, tokens Resalto, click). No volver a pegar el snippet genérico ni el demo de álbumes Unsplash como catálogo. |
| `FeaturedCoverflow` + `productsToCoverflowSlides` | Home ya arma slides desde `getFeaturedProducts()`. |
| Flag `featured` | Columna boolean + índice parcial en `web/supabase/migrations/20260825_init.sql`. Admin: checkbox “Destacado en home”. |
| `getFeaturedProducts()` | `published + featured`, `limit(12)`, con archivos. |
| `getPublishedProducts()` | **Sin paginar:** todos los publicados + `withFiles` (preview y entregables). |
| Home [`app/(tienda)/page.tsx`](app-digitales2/web/app/(tienda)/page.tsx) | Copy centrado + coverflow destacados. **No hay grilla debajo.** |
| `/tienda` | Grilla completa, sin páginas. |

**No se corre `npx shadcn@latest init`.** Chocaría `--color-muted` (texto `#8F6F7E`) con `bg-muted` de shadcn. El coverflow ya usa tokens Resalto.

Si en otro repo no hubiera este stack: Next + TS, Tailwind, `npx shadcn@latest init` → `components/ui` + `lib/utils.ts`. Acá no aplica. `lucide-react` no se reinstala.

### Brechas o Problemas que se Abordan

- Home no muestra el catálogo debajo del carrusel (solo CTA “Ver tienda”).
- `/tienda` y cualquier listado futuro cargan el catálogo entero.
- `withFiles` pide todos los `product_files` de esos IDs, incluidos entregables que la card no necesita.
- El checkbox de admin no explica que alimenta el carrusel.
- El snippet pegado en el pedido es un segundo copy del componente: **no reemplazar** el archivo actual ni publicar `coverflow-carousel.demo.tsx` como ruta.

---

## Cambios Propuestos

### Resumen de Cambios

- Reutilizar el CoverflowCarousel actual. Cero Unsplash como productos de Resalto.
- Home: destacados (coverflow) + bloque “Catálogo” + grilla paginada (20).
- `/tienda`: la misma grilla paginada (no duplicar lógica de fetch).
- `getPublishedProductsPage({ page, pageSize })` con `count` + `range`.
- En el listado, cargar solo archivos `kind = preview`.
- Copy admin: el destacado aparece en el carrusel del inicio (máx. 12 por el query).

### Nuevos Archivos a Crear

| Ruta del Archivo | Propósito |
| ---------------- | --------- |
| `web/lib/catalog.ts` | `PAGE_SIZE = 20`, `parsePage(searchParam)`, tipo `{ products, page, pageCount, total }`. |
| `web/components/store/CatalogGrid.tsx` | Grilla de `ProductCard` (server OK). |
| `web/components/store/CatalogPagination.tsx` | Links Anterior / Siguiente / páginas. Query `?page=`. |

### Archivos a Modificar

| Ruta del Archivo | Cambios |
| ---------------- | ------- |
| `web/lib/db.ts` | Agregar `getPublishedProductsPage`. Opcional: `filesForProducts(ids, { kind: "preview" })` para listados. Dejar `getPublishedProducts` si algo interno lo usa; si no, que la página pase por el page helper. |
| `web/app/(tienda)/page.tsx` | Leer `searchParams.page`. Debajo del coverflow: título Catálogo + grid + paginación. CTA “Ver tienda” puede quedar o bajar a ancla `#catalogo`. |
| `web/app/(tienda)/tienda/page.tsx` | Mismo fetch paginado. Dejar de llamar `getPublishedProducts()`. |
| `web/components/admin/ProductForm.tsx` | Texto del checkbox: que se entiende “carrusel del inicio”, tope práctico 12. |
| `web/components/ui/coverflow-carousel.tsx` | No reescribir con el paste. Solo tocar si falta algo mínimo para destacados (hoy ya alcanza). |

### Archivos a Eliminar (si aplica)

Ninguno. El demo Unsplash no se rutea (ya es así).

---

## Decisiones de Diseño

### Decisiones Clave Tomadas

1. **No reinstalar ni reemplazar el coverflow.** Ya está en `components/ui`, con `cn`, Lucide y datos reales. El paste genérico usa `bg-muted` / `animate-in` que esta app no tiene.
2. **Destacados = checkbox `featured` + publicados.** Sin tabla nueva. El carrusel llama `getFeaturedProducts()` (máx. 12). Si no hay ninguno, empty state actual; el catálogo paginado igual se muestra.
3. **Página = 20 productos publicados**, orden `created_at` desc. Los destacados **también** salen en el catálogo (el carrusel es highlight, no un filtro que los saca de la grilla).
4. **Paginación por `?page=`** (1-indexed). Página inválida → clamp a 1..pageCount. Home y `/tienda` independientes (cada una con su `page`).
5. **Listado liviano:** para la grilla, solo filas de `product_files` con `kind = 'preview'`. Ficha y checkout siguen trayendo todos los archivos.
6. **UI de páginas simple:** “Anterior” / “Siguiente” + “Página X de Y”. Si hay muchas páginas, mostrar un rango corto (actual ± 2), no 200 botones.
7. **Unsplash no entra al catálogo.** Previews de Supabase o gradiente `previewTone`.
8. **Admin, checkout, MP, Resend: fuera de alcance**, salvo el copy del checkbox featured.

### Alternativas Consideradas

- Infinite scroll: más JS y peor para “no pesar”; se rechaza a favor de `range` en Postgres.
- Coverflow con todo el catálogo: pesado y malo para 50+ ítems; se rechaza.
- Paginación solo en `/tienda` y home sin grilla: el pedido pide catálogo **debajo** del carrusel.
- `shadcn init` + pegar el demo: rompería tokens Resalto y mostraría álbumes fake.

### Preguntas Abiertas (si las hay)

Ninguna bloqueante. Tamaño de página fijo en 20 (ajustable en `PAGE_SIZE`).

---

## Tareas Paso a Paso

### Paso 1: Persistencia de este plan

Este archivo ya es el artefacto. Al implementar, marcar **Estado: En progreso** y al terminar **Implementado**.

**Archivos afectados:**

- `app-digitales2/planes/2026-08-25-catalogo-destacados.md`

---

### Paso 2: Query paginada (el trabajo pesado de verdad)

En `web/lib/db.ts`:

```ts
const CATALOG_PAGE_SIZE = 20;

export async function getPublishedProductsPage(page: number, pageSize = CATALOG_PAGE_SIZE) {
  const safePage = Math.max(1, page);
  const from = (safePage - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await supabaseAdmin()
    .from("products")
    .select("*", { count: "exact" })
    .eq("published", true)
    .order("created_at", { ascending: false })
    .range(from, to);

  // total = count ?? 0
  // pageCount = Math.max(1, Math.ceil(total / pageSize))
  // withPreviewFiles(rows) — solo kind preview
}
```

Extender `filesForProducts` con filtro opcional `kind?: FileKind` (`.eq("kind", "preview")` en listados).

En `web/lib/catalog.ts`: `parsePage(value: string | undefined): number` (NaN → 1).

**Acciones:**

- No traer entregables en el listado.
- Si `page` > `pageCount` y hay productos, usar `pageCount` (o redirigir); si total = 0, grilla vacía.

**Archivos afectados:**

- `web/lib/db.ts`
- `web/lib/catalog.ts`

---

### Paso 3: UI de catálogo reutilizable

`CatalogGrid`: `products.map` → `ProductCard` (animación `index` solo en la página actual, 0..19).

`CatalogPagination`:

- Props: `page`, `pageCount`, `basePath` (`"/"` o `"/tienda"`).
- Links `<Link href={`${basePath}?page=${n}`}>` ; página 1 puede ser `basePath` sin query.
- Si `pageCount <= 1`, no renderizar controles.
- Estilo: botones secondary / texto ink, radio 8px, no emojis.

**Archivos afectados:**

- `web/components/store/CatalogGrid.tsx`
- `web/components/store/CatalogPagination.tsx`

---

### Paso 4: Home = destacados + catálogo paginado

`page.tsx` recibe `searchParams: Promise<{ page?: string }>`.

Orden visual (ya hay copy arriba; no mover el hero):

1. Hero (título / subtítulo / CTA). El CTA “Ver tienda” puede apuntar a `/tienda` o a `#catalogo` en la misma página; **preferir `#catalogo`** en home y dejar `/tienda` en la nav.
2. Coverflow de `getFeaturedProducts()` (sin cambios de datos).
3. `<section id="catalogo">` con eyebrow “Catálogo”, H2 tipo “Todos los diseños”, bajada corta (un renglón).
4. `CatalogGrid` + `CatalogPagination` con `basePath="/"`.

Fetch en paralelo: settings, featured, página de publicados.

**Archivos afectados:**

- `web/app/(tienda)/page.tsx`

---

### Paso 5: `/tienda` paginada

Misma sección de grilla. Header actual de `/tienda` se queda. `searchParams.page`. `basePath="/tienda"`.

**Archivos afectados:**

- `web/app/(tienda)/tienda/page.tsx`

---

### Paso 6: Admin — elegir destacados (ya existe, aclarar)

En `ProductForm`, reemplazar “Destacado en home” por algo como:

> Mostrar en el carrusel del inicio. Máximo práctico: 12 (los más nuevos si hay de más).

No hace falta validar el tope en servidor en este plan (el query ya corta en 12). Opcional: hint si ya hay 12 featured al guardar — **no** en el MVP de este plan.

**Archivos afectados:**

- `web/components/admin/ProductForm.tsx`

---

### Paso 7: No tocar el paste de 21st.dev

- No overwrite de `coverflow-carousel.tsx` con `aspect-square` / `bg-muted` / `ring-ring`.
- No ruta `/demo`.
- No `npm install lucide-react` de nuevo.

---

### Paso 8: Verificación

- Lint en `web/`.
- Home: carrusel solo featured; catálogo 20; `?page=2` cambia la grilla, no el carrusel.
- Producto oculto no sale en grilla ni carrusel.
- Featured sigue en la grilla.
- `/tienda?page=2` idem.
- Admin: marcar/desmarcar featured → aparece/desaparece del coverflow (sin redeploy).
- Con 0 productos: empty states, sin paginación.
- No cargar 100 productos en el HTML de home.

---

## Conexiones y Dependencias

### Archivos que Referencian Esta Área

- Home y `/tienda` → `getPublishedProducts` / `getFeaturedProducts`.
- `ProductCard` → `files` preview `publicUrl`.
- Admin `saveProductAction` ya persiste `featured`.
- Plan previo: `planes/2026-08-25-redesign-tienda-coverflow.md` (coverflow ya hecho).

### Actualizaciones Necesarias para Consistencia

Ningún cambio de schema. El índice `products_featured_idx` ya está.

### Impacto en Flujos de Trabajo Existentes

Checkout y ficha iguales. La home deja de ser “solo vitrina + ir a tienda”: el catálogo vive también en `/`. La nav “Tienda” sigue siendo el catálogo completo paginado.

---

## Lista de Validación

- [ ] Plan en `planes/2026-08-25-catalogo-destacados.md`
- [ ] Coverflow **no** reescrito con el snippet Unsplash
- [ ] Destacados = checkbox admin → carrusel home (máx. 12)
- [ ] Debajo: título Catálogo + grilla
- [ ] Como máximo 20 productos por request de listado
- [ ] `/tienda` también paginada
- [ ] Solo previews en el fetch de grilla
- [ ] `?page=` funciona y no rompe el carrusel
- [ ] Lint OK

---

## Criterios de Éxito

1. Camila marca “destacado” en un producto publicado y ese preview entra al coverflow del inicio.
2. Debajo se listan los publicados de a 20, con páginas, sin bajar el catálogo entero.
3. El sistema no pinta 50+ cards ni 50+ entregables en home/`/tienda`.

---

## Notas

- `PAGE_SIZE` en un solo constante por si más adelante pasan a 12 o 24.
- Si el catálogo sigue chico (< 20), no se muestran controles de página: correcto.
- Prefetch de Next en links de paginación está bien; no hace falta infinite.
- Ejecutar con `/implementar app-digitales2/planes/2026-08-25-catalogo-destacados.md`.
