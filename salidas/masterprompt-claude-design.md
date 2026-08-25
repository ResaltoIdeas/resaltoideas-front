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
