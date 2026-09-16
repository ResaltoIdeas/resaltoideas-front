# Resalto Ideas — web

```
npm run dev
```

http://localhost:3000 · panel: `/login`

Producción: https://resalito-ideas.vercel.app

## Supabase (una vez)

Los buckets `previews` y `deliverables` ya están creados. Falta pegar el SQL de tablas en el SQL Editor del proyecto:

`supabase/migrations/20260825_init.sql`

## Env

Copiá `.env.example` a `.env.local`. Resend puede esperar: sin `RESEND_API_KEY` el pago se registra y el mail queda pendiente para reenviar desde el panel.

