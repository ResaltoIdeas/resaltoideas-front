# Design system — Resalto Ideas

Fuente de verdad visual de la tienda. Producto: [PRD.md](../../PRD.md).
Marca: **Resalto Ideas**. Subtítulo: **Tienda de productos digitales**.
Dominio: resaltoideas.com.ar

---

## Tono visual

**Estudio suave** — profesional moderno, operativo-calmo.

La tienda se siente taller de diseño, no SaaS ni juguetería rosa. El preview es el héroe (galería). El admin es el mismo idioma con más densidad: tablas, formularios, estados de pedido.

- Superficies claras, mucho aire en público, densidad media en panel.
- Rosa pastel como acento de marca y CTA, no como relleno de toda la pantalla.
- Un CTA por vista. Copy en español rioplatense neutro (vos OK en microcopy).
- Sin dark mode por defecto, sin emojis en UI, sin look “AI purple”, sin cream+terracota editorial, sin neón, sin cards decorativas vacías.

---

## Paleta (hex)

| Token | Hex | Uso |
|-------|-----|-----|
| Ink | `#4A2F3A` | Texto, wordmark |
| Muted | `#8F6F7E` | Secundario, placeholders, meta |
| Rose | `#E78CAB` | Marca, CTA primario, links de acento |
| Rose deep | `#C45D82` | Hover / pressed del CTA |
| Rose light | `#F6BFD2` | Chips, hover suave, ilustración |
| Rose wash | `#FFF5F9` | Fondo de página |
| Rose mist | `rgba(231, 140, 171, 0.20)` | Halo / highlight de fondo |
| Line | `rgba(231, 140, 171, 0.28)` | Bordes |
| Surface | `#FFFFFF` | Cards, paneles, inputs |
| Ok | `#3D7A64` | Pago aprobado, publicado, éxito (no usar rosa) |
| Warn | `#C9A227` | Pendiente, “revisar email” |
| Danger | `#D96B91` | Error de form, oculto / fallido |
| MP | `#009EE3` | Solo badge “Mercado Pago”, nunca marca |

Fondo de app: `Rose wash` + dos radiales suaves (mist) como en la tienda actual, sin foto stock.

Contraste: texto Ink sobre Surface o Wash. CTA: texto blanco sobre Rose. No poner texto Muted sobre Rose light.

---

## Tipografía (máximo 2)

| Rol | Familia | Pesos | Uso |
|-----|---------|-------|-----|
| Display | **Fraunces** | 600, 700 | Wordmark, H1, título de producto |
| UI | **Plus Jakarta Sans** | 400, 500, 600 | Nav, body, botones, tablas, checkout, admin |

Escala sugerida (desktop):

- Wordmark: Fraunces 700, ~28–32px sidebar / ~40–48px login
- H1: Fraunces 700, 36–44px (tienda) / 28px (admin)
- H2: Fraunces 600, 24px
- Body: Jakarta 400, 16px / line-height 1.5
- UI compacta (tablas, labels): Jakarta 500, 13–14px
- Precio: Jakarta 600, tabular nums si está disponible

Carga: Google Fonts. Fallback: `Georgia, serif` (Fraunces) y `system-ui, sans-serif` (Jakarta).

---

## Forma, sombra, iconos, espacio

- Radios: **8px** botones e inputs · **12px** paneles/cards · **16px** frame de preview.
- Sombra única: `0 16px 48px rgba(231, 140, 171, 0.14)`. Nada de sombras apiladas.
- Iconos: línea, 1.75–2px, tipo **Lucide**. No iconos rellenos de marca.
- Grid: 8px. Container tienda ~1120–1200px. Desktop-first 1440px, mobile usable (el tráfico es Instagram).
- Botón primario: fondo Rose, hover Rose deep, radio 8px, Jakarta 600.
- Botón secundario: Surface, borde Line, texto Ink.
- Badge publicado: Ok. Badge oculto: Muted. Featured: Rose light + texto Ink.

---

## Componentes reutilizables (para prototipo y código)

- Wordmark Resalto Ideas (Fraunces) + subtítulo
- Nav pública: Tienda · (sin link Admin)
- Card de producto: preview 4:5 o 1:1, título, precio ARS
- Frame de preview (galería en ficha)
- Lista “Qué incluye” (nombres de archivo, no el archivo)
- CTA Sun/Rose “Pagar con Mercado Pago”
- Aviso internacional (email, no checkout)
- Input + label; par email / confirmar email
- Badge de canal/pago MP
- Sidebar admin (mismo wordmark)
- Row de pedido (email, estado, acciones Reenviar / Editar email)
- Dropzone: Preview vs Entregables (dos zonas, no mezclar)
- Alertas: Ok / Warn / Danger

---

## Referencias de estética (inspiración, no copiar)

1. **Glossier** — commerce suave, rosa contenido, producto héroe, un CTA, mobile impecable. Tomar: calma y foco en la imagen. No copiar: universo beauty ni packing.
2. **Flodesk** — femenino-profesional, diseño, aire, nada infantil. Tomar: seriedad con paleta cálida. No copiar: marketing de email ni ilustraciones propias.
3. **Lemon Squeezy** — productos digitales, ficha clara, pagar y listo. Tomar: jerarquía de compra simple. No copiar: lima/verde de su marca ni dark snippets.

Anti-referencias: Creative Market (ruido de marketplace), Canva (playful saturado), Gumroad genérico (sin marca), el admin slate actual de `app-digitales`.

---

## Admin vs tienda

Misma paleta y tipo. La tienda no muestra el panel. El login no está en la nav pública. En sidebar el wordmark es señal hero, no un logo de 16px.
