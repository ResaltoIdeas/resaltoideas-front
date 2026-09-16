"use client";

import { useActionState } from "react";
import { checkoutAction } from "@/lib/actions/checkout";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";
import type { Product } from "@/lib/types";

export function CheckoutForm({ product }: { product: Product }) {
  const [state, action, pending] = useActionState(checkoutAction, null);

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="slug" value={product.slug} />
      <Field label="Nombre">
        <Input name="buyerName" required autoComplete="name" />
      </Field>
      <Field label="Email" hint="Te mandamos los archivos acá.">
        <Input name="buyerEmail" type="email" required autoComplete="email" />
      </Field>
      <Field label="Confirmá el email">
        <Input name="buyerEmailConfirm" type="email" required autoComplete="email" />
      </Field>
      {state?.error ? <Alert tone="danger">{state.error}</Alert> : null}
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Preparando pago…" : "Pagar con Mercado Pago"}
      </Button>
      <p className="text-xs text-muted">
        El pago online se realiza con Mercado Pago. Sin cuenta y sin carrito.
      </p>
    </form>
  );
}
