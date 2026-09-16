"use client";

import { useState } from "react";
import { updateOrderEmailAction, resendOrderAction } from "@/lib/actions/admin";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Input";
import { PendingButton } from "@/components/admin/PendingButton";
import type { Order } from "@/lib/types";

export function OrderActions({ order }: { order: Order }) {
  const [open, setOpen] = useState(order.status === "email_failed");

  return (
    <div className="flex flex-col items-end gap-2">
      <div className="flex gap-2">
        <form action={resendOrderAction.bind(null, order.id)}>
          <PendingButton variant="secondary" pendingLabel="Reenviando…">
            Reenviar
          </PendingButton>
        </form>
        <Button type="button" variant="ghost" onClick={() => setOpen((v) => !v)}>
          Editar email
        </Button>
      </div>
      {open ? (
        <form action={updateOrderEmailAction} className="flex flex-wrap items-end gap-2">
          <input type="hidden" name="orderId" value={order.id} />
          <Field label="Email del comprador">
            <Input name="buyerEmail" type="email" required defaultValue={order.buyerEmail} />
          </Field>
          <PendingButton pendingLabel="Guardando…">Guardar y reenviar</PendingButton>
        </form>
      ) : null}
    </div>
  );
}
