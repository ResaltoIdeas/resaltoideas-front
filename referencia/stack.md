# Stack — Resalto Ideas

Decisión cerrada. No hay que reabrirla en el MVP.

## Elección

| Capa | Tecnología | Por qué |
|------|------------|---------|
| Frontend | **Next.js 15 (App Router) + TypeScript + Tailwind** | Tienda + panel en un solo repo. SSR/SSG para fichas que se abren desde Instagram. Server Actions para el admin. Encaja con Vercel. |
| Estilos | Tailwind + tokens del design system | Densidad de tienda vs admin sin un CSS gigante como el legado. |
| Backend | **Route Handlers de Next.js** | Checkout, webhook de Mercado Pago y descargas firmadas. No hace falta un Express aparte (eso es lo que hay que dejar atrás). |
| Auth | **Supabase Auth** | Un solo admin. RLS en Postgres. Sin Passport/JWT casero del legado. |
| Base de datos | **Supabase (Postgres)** | Productos, pedidos, contenido, políticas. Relacional, backups, SQL. |
| Archivos | **Supabase Storage** | Reemplazo de Google Drive. Bucket público de previews + bucket privado de entregables. |
| Email | **Resend** | Entrega al comprador + aviso a `resaltoideas@gmail.com`. Templates HTML. |
| Pagos | **Mercado Pago Checkout Pro** | Ya es el medio del negocio en Argentina. Webhook → pedido → mail. |
| Hosting | **Vercel** | Preview deploys, HTTPS, dominio `resaltoideas.com.ar`, cron si hace falta. |
| Compresión | **sharp** (server-side al subir previews) | Pedido del PRD: achicar imágenes. No tocar ZIP/AI/PSD. |

## Qué no usar (y por qué)

- **Mongo + Express + Vite** (`app-digitales`): funciona, pero Drive, dos deploys y el admin gris son el problema. Se migra la *idea*, no el stack.
- **Stripe / PayPal en v1:** el PRD los deja afuera; el exterior va por email.
- **S3 aparte:** Storage de Supabase alcanza y evita otro vendor.
- **Adjuntos en el mail:** PSD/ZIP se rompen o no entran. Links firmados.
- **Cuenta de comprador:** checkout invitado.

## Variables de entorno (nombres)

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
RESEND_API_KEY
RESEND_FROM
MP_ACCESS_TOKEN
MP_WEBHOOK_SECRET
NEXT_PUBLIC_SITE_URL
ADMIN_EMAIL
```

El from de Resend puede ser `Resalto Ideas <hola@resaltoideas.com.ar>` cuando el dominio esté verificado; hasta entonces el dominio de Resend, con reply-to `resaltoideas@gmail.com`.
