# Plan: Rediseño tienda pública con CoverflowCarousel

**Creado:** 2026-08-25
**Estado:** En progreso
**Pedido:** Rediseñar la interfaz web pública e integrar el componente CoverflowCarousel como galería de previews.

---

## Descripción General

### Qué Logra Este Plan

La home deja de ser un bloque de texto + grilla de 3 cards y pasa a sentirse **tienda-galería**: un coverflow 3D de previews reales, con título/precio debajo y click al producto. El catálogo, la ficha y el checkout se pulen al mismo idioma visual (estudio suave, rosa contenido, preview héroe). El admin no se toca.

### Por Qué Importa

El design system dice “tienda = galería” y el masterprompt pone la home como destino del link en bio. Hoy el preview es un recuadro plano en una grilla; el coverflow es el gesto visual que diferencia a Resalto de un catálogo genérico, sin cambiar checkout ni Mercado Pago.

---

## Estado Actual

### Estructura Existente Relevante

La app Next vive en `app-digitales2/web`. Ya hay TypeScript y Tailwind v4. `lucide-react` ya está en `package.json`.

- Componentes: `app-digitales2/web/components/ui` — sí es `/components/ui` relativo a la app.
- Estilos: `app-digitales2/web/app/globals.css` (`@import "tailwindcss"` + `@theme inline` con tokens Resalto).
- Alias: `@/*` → raíz de `web/` (`tsconfig.json`).
- No hay shadcn: no existe `components.json`, ni `lib/utils.ts` / `cn()`, ni tokens `foreground` / `background` / `muted-foreground` / `ring`.
- UI actual: componentes propios (`Button`, `Input`, `Alert`, `Badge`, `Wordmark`) con clases `text-muted`, `bg-surface`, `bg-rose`, etc.

Páginas públicas relevantes:

- Home: `app/(tienda)/page.tsx` — wordmark + copy + grilla de destacados
- Layout: `app/(tienda)/layout.tsx` — `max-w-[1120px]` envuelve todo (esto recorta el coverflow)
- Tienda: `app/(tienda)/tienda/page.tsx`
- Ficha: `app/(tienda)/tienda/[slug]/page.tsx`
- Checkout / gracias / nav / footer / `ProductCard`

No se corre `npx shadcn@latest init`. En Tailwind v4 reescribiría `globals.css` con tema zinc/slate y el token shadcn `muted` (superficie) chocaría con el `text-muted` de Resalto (`#8F6F7E`, color de texto). El componente se adapta a los tokens existentes.

### Brechas o Problemas que se Abordan

- Home texto-primero; el preview no es héroe.
- Layout con max-width recorta vecinos 3D.
- `getFeaturedProducts()` limita a 3 — poco para un anillo coverflow.
- Productos sin `publicUrl` de preview caen a un gradiente; el carrusel original exige `src`.
- El componente usa `animate-in fade-in` (plugin shadcn) y `cn()` — no existen.

---

## Cambios Propuestos

### Resumen de Cambios

- Agregar `clsx` + `tailwind-merge` y `cn()` sin inicializar shadcn.
- Integrar CoverflowCarousel adaptado a tokens Resalto (4/5, fallback gradient, click a producto).
- Home galería full-bleed; nav sticky; catálogo en grilla; ficha con coverflow si hay 2+ previews.
- Subir el límite de featured a 12, con fallback a publicados si hay menos de 4.

### Nuevos Archivos a Crear

| Ruta del Archivo | Propósito |
| ---------------- | --------- |
| `web/lib/utils.ts` | `cn()` con clsx + tailwind-merge |
| `web/components/ui/coverflow-carousel.tsx` | Componente adaptado (href, fallback, 4/5, tokens Resalto, click) |
| `web/components/ui/coverflow-carousel.demo.tsx` | Demo original, no ruteada |
| `web/components/store/FeaturedCoverflow.tsx` | Wrapper cliente: productos → slides, caption, CTA |
| `web/lib/coverflow-slides.ts` | Mapper `Product[]` → slides |

### Archivos a Modificar

| Ruta del Archivo | Cambios |
| ---------------- | ------- |
| `web/package.json` | `clsx`, `tailwind-merge` |
| `web/app/globals.css` | keyframes `cf-fade` |
| `web/app/(tienda)/layout.tsx` | full-bleed main; nav/footer centrados |
| `web/app/(tienda)/page.tsx` | hero coverflow + copy corto + CTA |
| `web/lib/db.ts` | `getFeaturedProducts` `limit(12)` |
| `web/components/store/StoreNav.tsx` | nav más galería (sticky) |
| `web/components/store/ProductCard.tsx` | card más galería |
| `web/app/(tienda)/tienda/page.tsx` | encabezado + grilla alineada |
| `web/app/(tienda)/tienda/[slug]/page.tsx` | coverflow si hay 2+ previews |
| Páginas públicas restantes | container `max-w-[1120px]` porque el layout ya no lo hace |

### Archivos a Eliminar (si aplica)

Ninguno. El demo de álbumes no se monta en `app/`.

---

## Decisiones de Diseño

### Decisiones Clave Tomadas

1. **Coverflow solo en home (y ficha si hay 2+ previews).** El catálogo sigue en grilla.
2. **No inicializar shadcn.** Adaptar clases a tokens Resalto.
3. **No publicar `demo.tsx` como ruta.** Unsplash solo en el archivo demo.
4. **Datos reales.** Slides = featured (si hay menos de 4, todos los publicados).
5. **Click:** carta no centrada → `goTo`; carta centrada o CTA → `/tienda/[slug]`.
6. **Aspecto 4/5.** Altura del stage: `calc(var(--cf-card) * 5 / 4)`.
7. **Full-bleed** para el coverflow; el resto de páginas se centran.
8. **Admin, login, webhooks, checkout logic: fuera de alcance.**
9. **Nav sticky.** En home se quita el Wordmark duplicado del body.

### Alternativas Consideradas

- Inicializar shadcn CLI: rechazado porque `--color-muted` ya es texto `#8F6F7E`.
- Coverflow en el catálogo: rechazado, no escala a “ver todo”.
- Unsplash como previews de producto: rechazado, no son diseños de Resalto.

### Preguntas Abiertas (si las hay)

Ninguna bloqueante.

---

## Tareas Paso a Paso

Ver implementación en el código de `app-digitales2/web`. Resumen:

1. Persistencia de este plan.
2. `cn()` + CSS `cf-fade`.
3. Coverflow + demo + mapper + wrapper.
4. Featured limit 12 + fallback.
5. Layout full-bleed + home galería.
6. Nav, catálogo, ficha.
7. Lint/build y verificación en browser.

---

## Conexiones y Dependencias

### Archivos que Referencian Esta Área

- Design system: `salidas/design-system.md`
- Masterprompt home: `salidas/masterprompt-claude-design.md`
- `Product.files[].publicUrl` solo en kind `preview` (`lib/db.ts`)

### Actualizaciones Necesarias para Consistencia

Ningún comando Claude ni el admin. Solo UX pública.

### Impacto en Flujos de Trabajo Existentes

Checkout / Mercado Pago / Resend no se tocan. El plan habilita `/implementar`.

---

## Lista de Validación

- [ ] Plan en `planes/2026-08-25-redesign-tienda-coverflow.md`
- [ ] `cn()` existe; no hay `components.json` ni tema shadcn
- [ ] Coverflow en `components/ui`; demo no ruteada
- [ ] Home: anillo 3D, caption, CTA, click a ficha
- [ ] Layout no recorta las cartas laterales
- [ ] `/tienda` grilla usable; ficha/checkout/gracias coherentes
- [ ] Admin intacto
- [ ] Lint/build OK; verificado desktop y mobile

---

## Criterios de Éxito

1. Un visitante del link en bio ve previews en coverflow, no un muro de texto.
2. El componente vive en `components/ui` y usa tokens Resalto, no zinc/shadcn.
3. Comprar sigue siendo: ficha → checkout email → Mercado Pago.

---

## Notas

- `lucide-react` ya está; no reinstalar salvo que falte al instalar.
- No usar fotos Unsplash como si fueran productos de Camila.
- Si más adelante se quiere shadcn “de verdad”, habría que renombrar `text-muted` de la app a `text-muted-foreground` antes de `shadcn init`.
