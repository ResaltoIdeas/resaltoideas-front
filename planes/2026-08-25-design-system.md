# Plan: Design system + masterprompt de prototipo — Resalto Ideas

**Creado:** 2026-08-25
**Estado:** Implementado
**Pedido:** Definir el design system de Resalto Ideas (paleta, tipografía, tono, referencias) y el masterprompt listo para Claude Design, a partir del PRD.

---

## Descripción General

### Qué Logra Este Plan

Deja documentado y cerrado el lenguaje visual de la tienda (colores hex, 2 fuentes, tono, tokens, componentes y 3 referencias) más un masterprompt pegable en Claude Design con las pantallas del MVP ya elegidas. No se implementa la app: se producen entregables de diseño en `salidas/` para que el prototipo y, después, el código Next.js no improvisen estética.

### Por Qué Importa

El PRD pide un rewrite de UX/UI que se sienta fresco y de marca de diseño, conservando los rosas actuales. Sin este sistema, el prototipo y el código van a divergir (el admin viejo ya es slate/gris y la tienda es rosa). El masterprompt traduce el MVP a pantallas concretas — Instagram → preview → pagar — que es el flujo real del negocio.

---

## Estado Actual

### Estructura Existente Relevante

| Ruta | Qué hay |
|------|---------|
| `/PRD.md` | Brief de producto (fuente de verdad de features y flujos) |
| `app-digitales/cliente/src/styles.css` | Paleta actual (`#e78cab`, `#fff5f9`, `#4a2f3a`, etc.) y un admin en gris `#f8f9fc` que hay que unificar |
| `app-digitales/cliente/src/content/branding.js` | Nombre, tagline, copy, logo imgur, email de contacto |
| `.cursorrules` | Tono “operativo-calmo, profesional moderno”, rosa pastel, wordmark hero, stack Next/Vercel/Supabase/Resend |
| `app-digitales2/contexto/info-negocio.md` | Resumen de marca y checkout sin carrito |
| `app-digitales2/salidas/` | Vacío — acá van los entregables |
| `app-digitales2/referencia/` | Vacío |
| `app-digitales2/.claude/skills/ui-design-system/` | Skill de tokens; no usarla para regenerar la paleta (rompería los tonos pedidos) |

### Brechas o Problemas que se Abordan

- Tipografía no definida (hoy system-ui).
- Paleta incompleta para admin (éxito, aviso, MP) y el panel se ve de otro producto.
- No hay documento de design system ni prompt de prototipo.
- El `.cursorrules` tiene el bloque de Design System a medias (“Elegilas y reemplaza esto”).

---

## Cambios Propuestos

### Resumen de Cambios

- Publicar el design system completo en `salidas/` (y una copia estable en `referencia/`).
- Publicar el masterprompt de Claude Design con 9 pantallas del MVP y datos de demo.
- Actualizar `PRD.md` (tipografía y tono ya no “a definir”).
- Completar el bloque visual en `.cursorrules`.
- Mencionar los entregables en `CLAUDE.md` y `contexto/proyectos.md`.

### Nuevos Archivos a Crear

| Ruta del Archivo | Propósito |
| ---------------- | --------- |
| `app-digitales2/salidas/design-system.md` | Sistema visual: tono, paleta hex, tipo, tokens, componentes, anti-patrones |
| `app-digitales2/referencia/design-system.md` | Copia estable para sesiones futuras (`/iniciar`) |
| `app-digitales2/salidas/masterprompt-claude-design.md` | Prompt listo para pegar en Claude Design (9 pantallas + por qué esas) |

### Archivos a Modificar

| Ruta del Archivo | Cambios |
| ---------------- | ------- |
| `PRD.md` | En §9, reemplazar “Tipografía: a definir…” por Fraunces + Plus Jakarta Sans y enlace al design system |
| `.cursorrules` | Rellenar paleta hex, tipografía y tono; no borrar el resto del brief |
| `app-digitales2/CLAUDE.md` | En estructura de `salidas/`, mencionar design system y masterprompt |
| `app-digitales2/contexto/proyectos.md` | Nota de que el DS está documentado |

### Archivos a Eliminar (si aplica)

Ninguno.

---

## Decisiones de Diseño

### Decisiones Clave Tomadas

1. **Misma familia de color, paleta cerrada:** se conservan `#E78CAB`, `#F6BFD2`, `#FFF5F9`, `#4A2F3A`, `#8F6F7E`. Se agregan solo tokens que faltan (hover más profundo, éxito no-rosa, aviso, acento Mercado Pago). El admin deja de ser slate: misma marca que la tienda.

2. **Dos fuentes:** **Fraunces** (600/700) para wordmark y títulos; **Plus Jakarta Sans** (400/500/600) para UI, tablas, checkout y admin. Fraunces da “estudio de diseño” sin caer en editorial cream+terracota. Jakarta aguanta densidad de panel y mobile de Instagram.

3. **Tono: estudio suave, no candy.** Rosa como acento y fondo lavado, no saturación de juguete. Tienda = galería (preview grande, poca UI). Admin = operativo (densidad media). Sin dark mode, sin emojis en UI, sin look AI purple.

4. **Sin carrito en el prototipo.** Checkout de un producto. Wordmark “Resalto Ideas” grande en login y sidebar. Subtítulo: “Tienda de productos digitales”. Login de admin no aparece en la nav pública.

5. **9 pantallas, no más.** Cubren el circuito del PRD. Se excluyen legales extra, lista de productos admin y settings infinitos (se cubren con una pantalla de contenido).

6. **Masterprompt en el mismo plan.** El `.cursorrules` lo pide inmediatamente después del DS; `/implementar` debe dejarlo escrito, no solo el DS.

### Alternativas Consideradas

- **Outfit + Source Sans 3 (todo sans):** más “SaaS”, menos marca de diseño. Rechazado.
- **Cormorant + Nunito:** empuja editorial cream. Rechazado.
- **Generar paleta con `design_token_generator.py` desde `#e78cab`:** cambia los hex que el usuario pidió conservar. Rechazado.
- **Incluir carrito o cuenta de comprador en el prototipo:** contradice el PRD. Rechazado.
- **12+ pantallas (cada legal, lista + form, branding aparte):** diluye el flujo Instagram → pagar. Rechazado.

### Preguntas Abiertas (si las hay)

Ninguna bloqueante. El logo actual (`https://i.imgur.com/rhg2CUZ.png`) se usa si entra bien al lado del wordmark; si no, solo tipografía Fraunces “Resalto Ideas”.

---

## Tareas Paso a Paso

Ejecutá estas tareas en orden durante la implementación.

### Paso 1: Escribir el design system

Crear `app-digitales2/salidas/design-system.md` con **exactamente** el contenido de la sección “Especificación: design-system.md” al final de este plan (copiar verbatim, no reescribir ni “mejorar” hex/fuentes).

**Acciones:**

- Crear el archivo con el contenido verbatim.
- Copiar el mismo archivo a `app-digitales2/referencia/design-system.md`.

**Archivos afectados:**

- `app-digitales2/salidas/design-system.md`
- `app-digitales2/referencia/design-system.md`

---

### Paso 2: Escribir el masterprompt de Claude Design

Crear `app-digitales2/salidas/masterprompt-claude-design.md` con **exactamente** el contenido de la sección “Especificación: masterprompt-claude-design.md” al final de este plan.

Incluir al inicio del archivo (antes del prompt pegable) un bloque corto “Por qué estas 9 pantallas y no otras” — también verbatim en esa especificación.

**Acciones:**

- Crear el archivo completo.
- Verificar que el prompt nombre las 9 pantallas, el design system, datos de demo en español Argentina y prototype links.

**Archivos afectados:**

- `app-digitales2/salidas/masterprompt-claude-design.md`

---

### Paso 3: Actualizar el PRD

En `PRD.md`, sección 9 “Decisiones ya tomadas”, reemplazar la línea de tipografía:

**Antes:** `- Tipografía: a definir en el design system (nueva).`

**Después:**

```
- Tipografía: Fraunces 600/700 (marca y títulos) + Plus Jakarta Sans 400/500/600 (UI). Detalle en `app-digitales2/salidas/design-system.md`.
- Tono visual: estudio suave, profesional moderno, operativo-calmo. Rosa pastel de acento; tienda tipo galería, admin densidad media.
```

**Archivos afectados:**

- `PRD.md`

---

### Paso 4: Completar el bloque visual en `.cursorrules`

En `.cursorrules`, reemplazar el hueco de Design System / Tipografía por los tokens cerrados (hex + fuentes), sin borrar el resto del archivo (stack, migración, Drive → Supabase, panel oculto).

**Reemplazar** el tramo que hoy dice:

```
DESIGN SYSTEM (obligatorio)
Tono: operativo-calmo, profesional moderno. color principal rosa pastel.



Tipografía:
Elegilas y reemplaza esto.
```

**Por:**

```
DESIGN SYSTEM (obligatorio)
Tono: estudio suave, profesional moderno, operativo-calmo. Rosa pastel de acento. Tienda = galería. Admin = densidad media. Sin dark mode, sin emojis en UI, sin look AI purple.

Colores hex:
- Ink #4A2F3A
- Muted #8F6F7E
- Rose #E78CAB (marca / CTA)
- Rose deep #C45D82 (hover / pressed)
- Rose light #F6BFD2
- Rose wash #FFF5F9 (fondo)
- Rose mist rgba(231, 140, 171, 0.20)
- Line rgba(231, 140, 171, 0.28)
- Surface #FFFFFF
- Ok #3D7A64
- Warn #C9A227
- Danger #D96B91
- MP #009EE3 (solo badge Mercado Pago)

Tipografía:
- Fraunces 600/700 — wordmark y títulos
- Plus Jakarta Sans 400/500/600 — UI, tablas, checkout, admin
Radios: 8px botones / 12px paneles / 16px frames de preview.
Sombra única: 0 16px 48px rgba(231, 140, 171, 0.14).
Iconos línea tipo Lucide.
```

Corregir en el mismo archivo el typo de marca “Reslto Ideas” → “Resalto Ideas” si sigue apareciendo.

**Archivos afectados:**

- `.cursorrules`

---

### Paso 5: Actualizar referencias del workspace

En `app-digitales2/CLAUDE.md`, en la tabla o párrafo de `salidas/`, agregar que ahí viven el design system y el masterprompt de prototipo.

En `app-digitales2/contexto/proyectos.md`, en la fila de Resalto Ideas, agregar: “Design system y masterprompt en `salidas/`.”

**Archivos afectados:**

- `app-digitales2/CLAUDE.md`
- `app-digitales2/contexto/proyectos.md`

---

### Paso 6: Validar

**Acciones:**

- Confirmar que los hex del DS coinciden con los de `.cursorrules` y con los históricos `#e78cab` / `#fff5f9` / `#4a2f3a`.
- Confirmar máximo 2 familias tipográficas.
- Confirmar 9 pantallas en el masterprompt, sin carrito ni cuenta de comprador.
- Confirmar wordmark “Resalto Ideas” + subtítulo “Tienda de productos digitales”.
- No ejecutar Claude Design ni escribir código de la app en este plan.

**Archivos afectados:**

- (solo lectura de lo creado)

---

## Conexiones y Dependencias

### Archivos que Referencian Esta Área

- `.cursorrules` — siguiente paso después de este plan: prototipo Claude Design, después stack/masterplan de código
- `PRD.md` — pantallas y features del MVP
- `app-digitales/cliente/src/styles.css` — origen de la paleta; no se modifica en este plan

### Actualizaciones Necesarias para Consistencia

- PRD §9, `.cursorrules`, `CLAUDE.md`, `proyectos.md` (pasos 3–5)

### Impacto en Flujos de Trabajo Existentes

- `/iniciar` pasará a ver el DS en `referencia/` y `salidas/`.
- `/implementar` de planes futuros de UI debe leer `salidas/design-system.md` antes de codear.
- No cambia `/crear-plan` ni la estructura de comandos.

---

## Lista de Validación

- [x] Existe `app-digitales2/salidas/design-system.md` con paleta hex, 2 fuentes, tono y 3 referencias
- [x] Existe `app-digitales2/referencia/design-system.md` idéntico
- [x] Existe `app-digitales2/salidas/masterprompt-claude-design.md` pegable, con 9 pantallas y justificación
- [x] PRD actualizado (tipografía y tono)
- [x] `.cursorrules` con tokens, sin el placeholder “Elegilas y reemplaza esto”
- [x] `CLAUDE.md` menciona los entregables de `salidas/`
- [x] No se tocó código de `app-digitales/` ni se creó la app Next en este plan
- [x] Paleta conserva `#E78CAB` / `#FFF5F9` / `#4A2F3A`

---

## Criterios de Éxito

La implementación está completa cuando:

1. Un diseñador o Claude Design puede prototipar sin preguntar colores, fuentes ni pantallas.
2. Las 9 pantallas cubren el circuito del PRD (ver → pagar → email; admin: producto, pedido, contenido) y nada de post-MVP.
3. El workspace apunta al DS como fuente visual (PRD + `.cursorrules` + `referencia/`).

---

## Notas

- Este plan **no** pega el prompt en Claude Design; solo deja el archivo. El usuario lo pega cuando quiera.
- El siguiente plan natural (`/crear-plan stack` o masterplan de código) debe esperar al prototipo, o usar estas 9 pantallas como lista de frontend si se salta el prototipo.
- Demo: productos de diseño gráfico (no ebooks genéricos), precios ARS, copy rioplatense.

---

## Especificación: design-system.md

Copiar verbatim a `salidas/design-system.md` y `referencia/design-system.md`:

```markdown
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
```

---

## Especificación: masterprompt-claude-design.md

Copiar verbatim. La primera parte es para humanos; desde “PEGAR DESDE ACÁ” es el prompt.

```markdown
# Masterprompt — Claude Design · Resalto Ideas

## Por qué estas 9 pantallas (y no otras)

El MVP es un solo circuito: ver el diseño → pagar uno → recibir archivos. El admin publica sin Drive y arregla el email mal tipeado.

| # | Pantalla | Por qué está |
|---|---------|----------------|
| 1 | Home | Destino del link en bio; marca + destacados |
| 2 | Tienda | Quien no viene de un post ve todo el catálogo |
| 3 | Ficha | Pantalla más importante: preview ≠ entregable |
| 4 | Checkout | Un producto, confirmar email (error #1) |
| 5 | Gracias | Cierra el loop (“revisá tu email”) |
| 6 | Login | Panel oculto; wordmark hero |
| 7 | Admin inicio | Ventas y pedidos que necesitan reenvío |
| 8 | Admin producto | Upload preview vs archivos (reemplazo de Drive) |
| 9 | Admin pedidos + contenido | Reenviar/corregir email y editar textos/políticas |

**No se prototipan:** carrito, cuenta de comprador, reembolsos, pagos internacionales (solo aviso), legales como 3 URLs distintas (en 9 hay un editor de políticas), lista admin de productos (el form es el diseño nuevo). Tres legales públicas serían el mismo layout.

---

PEGAR DESDE ACÁ
---

Diseñá el prototipo de interfaz (web app desktop-first, 1440px, con adaptación mobile razonable) de:

Producto: Resalto Ideas
Qué es: Tienda propia de diseños gráficos digitales en Argentina (vectores, imágenes editables, packs). No es un marketplace ni un SaaS.
Promesa: Ves el preview → pagás con Mercado Pago → te llegan los archivos al email. Sin cuenta. Sin carrito. Sin Google Drive.
Marca: Resalto Ideas debe ser señal hero en login y sidebar (wordmark legible, Fraunces), no un logo minúsculo. Subtítulo: “Tienda de productos digitales”.
Dominio de referencia: resaltoideas.com.ar. Contacto: resaltoideas@gmail.com.

DESIGN SYSTEM (obligatorio)
Tono: estudio suave, profesional moderno, operativo-calmo. Densidad baja en tienda (galería), media en admin. Sin look AI purple, sin cream+terracota editorial, sin neón, sin dark mode, sin emojis en UI, sin cards decorativas vacías.

Colores hex:
- Ink #4A2F3A
- Muted #8F6F7E
- Rose #E78CAB (CTA primario / marca)
- Rose deep #C45D82
- Rose light #F6BFD2
- Rose wash #FFF5F9 (fondo)
- Rose mist rgba(231, 140, 171, 0.20)
- Line rgba(231, 140, 171, 0.28)
- Surface #FFFFFF
- Ok #3D7A64
- Warn #C9A227
- Danger #D96B91
- MP #009EE3 (solo indicador Mercado Pago)

Tipografía:
- Fraunces 600/700 para marca y títulos
- Plus Jakarta Sans 400/500/600 para UI, tablas, checkout, chat no hay
Radios 8px botones / 12px paneles / 16px preview. Sombra única 0 16px 48px rgba(231, 140, 171, 0.14). Iconos línea tipo Lucide.

Referencias de calidad (inspiración, no copiar): Glossier (commerce suave), Flodesk (femenino-profesional), Lemon Squeezy (producto digital + pagar).

DATOS DE DEMO (español Argentina)
Tienda: Resalto Ideas — Buenos Aires
Admin: Camila (dueña)
Productos ejemplo (preview visible; archivos reales NO se muestran en claro):
- “Pack logos cafetería Lo de Marta” — ARS 18.500 — featured — incluye 3 archivos (AI, SVG, PNG) — preview de isotipo en rosa/crema
- “Stickers vectorizados Verano Palermo” — ARS 9.900 — 5 SVGs en un ZIP
- “Plantillas Stories — estudio floral” — ARS 12.400 — PSD editable + PDF guía
Aviso internacional: “¿Comprás desde el exterior? Escribinos a resaltoideas@gmail.com”

FLUJO VISUAL A DEMOSTRAR
1) Home o post → ficha con preview grande
2) Qué incluye (nombres de archivo, no descargables)
3) Checkout: nombre, email, confirmar email, CTA Rose “Pagar con Mercado Pago”
4) Gracias: “Revisá tu email”
5) Admin: subir preview y entregables en zonas distintas
6) Pedido: cambiar email del comprador y reenviar

PANTALLAS A DISEÑAR (exactamente estas 9, high-fidelity, consistentes)

1) Home
- Fondo Rose wash + mist sutil (no foto stock).
- Wordmark grande + subtítulo.
- Hero corto: diseño que se paga y llega al mail.
- 3 destacados (cards de producto).
- Nav: Inicio, Tienda. Sin “Admin”.
- Footer: email, Instagram @resaltoideas, links a políticas (placeholder).

2) Tienda
- Grid de productos: preview, título, precio ARS.
- Filtro mínimo o ninguno (catálogo chico). CTA “Ver” a ficha.

3) Ficha de producto (pantalla más importante)
- Preview grande (Pack Lo de Marta).
- Precio, descripción breve, lista “Qué incluye”.
- CTA Rose “Comprar”.
- Aviso internacional discreto.
- No mostrar URL de archivos reales.

4) Checkout
- Resumen del producto (thumb preview + título + precio).
- Campos: nombre, email, confirmar email (helper: “Te mandamos los archivos acá”).
- CTA “Pagar con Mercado Pago”.
- Aviso exterior → email.
- Sin crear cuenta, sin carrito, sin cupón.

5) Gracias / pago recibido
- Estado Ok. “Ya estamos generando tu entrega.”
- “Revisá la bandeja de [email] (y spam).”
- Link a tienda. Sin listar archivos descargables en claro (el mail es la entrega del MVP).

6) Login admin
- Fondo wash + mist. Wordmark hero + “Tienda de productos digitales”.
- Email, contraseña, CTA Rose “Ingresar”.
- No hay signup público.

7) Admin — Inicio
- Sidebar con wordmark grande: Inicio, Productos, Pedidos, Contenido.
- KPIs del día: ventas, pedidos pagados, reenvíos pendientes.
- Lista corta “Necesitan atención” (email fallido / reenviar).
- Sin dashboard de marketing.

8) Admin — Nuevo / editar producto
- Form: título, descripción, precio ARS, categoría opcional, featured, publicado/oculto.
- Zona A: imágenes de preview (dropzone).
- Zona B: archivos entregables (dropzone, múltiple, cualquier tipo). Las dos zonas se distinguen sí o sí.
- Guardar CTA Rose.

9) Admin — Pedidos (y acceso a Contenido)
- Tabla: fecha, producto, comprador, email, estado (pagado / entregado / error de mail), total ARS.
- Acciones en fila o detalle: Editar email, Reenviar entrega.
- Mostrar un pedido de “Lucía Fernández” con email mal tipeado (lucía@gmial.com) y CTA para corregir.
- Desde sidebar, estado de la pantalla Contenido puede resolverse como segundo estado de esta vista o tab: textos de home, aviso internacional, editor de Términos / Privacidad / Compra y entrega. Simple, no settings infinitos.

REGLAS DE UI
- Una job por pantalla. Copy rioplatense neutro.
- Wordmark Resalto Ideas en sidebar de todas las pantallas logueadas y en login.
- Previews siempre distintos al entregable.
- Entregá las 9 pantallas navegables (prototype links: nav pública + sidebar admin + CTAs Comprar / Ingresar / Guardar).
- Al finalizar, listá componentes reutilizables detectados (botón, card producto, dropzone, row pedido, etc.).
```

---

## Notas de Implementación

**Implementado:** 2026-08-25

### Resumen

Se publicaron el design system (salidas + referencia) y el masterprompt de 9 pantallas. Se actualizaron PRD, `.cursorrules` (tokens + typo Resalto), `CLAUDE.md` y `contexto/proyectos.md`. No se tocó `app-digitales/` ni se creó la app Next.

### Desviaciones del Plan

Ninguna. El usuario invocó `/implementar planes/2026-08-25-design-system.m` (extensión truncada); se ejecutó `app-digitales2/planes/2026-08-25-design-system.md`.

### Problemas Encontrados

Ninguno

