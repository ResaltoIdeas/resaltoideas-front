import Link from "next/link";
import { getOrderById } from "@/lib/db";
import { fulfillMpPayment } from "@/lib/fulfill";
import { Alert } from "@/components/ui/Alert";
import { StoreContainer } from "@/components/store/StoreContainer";

type Props = {
  searchParams: Promise<{
    order?: string;
    payment_id?: string;
    collection_id?: string;
    status?: string;
    pending?: string;
    mp?: string;
  }>;
};

export const metadata = { title: "Gracias" };

export default async function ThanksPage({ searchParams }: Props) {
  const q = await searchParams;
  const paymentId = q.payment_id || q.collection_id;
  if (paymentId) {
    try {
      await fulfillMpPayment(paymentId);
    } catch {
      // el webhook puede completar después
    }
  }

  const order = q.order ? await getOrderById(q.order) : null;
  const failed = q.mp === "failure";
  const pending = q.pending === "1" || order?.status === "pending";
  const delivered = order?.status === "delivered";
  const mailPending = order?.status === "email_failed" || order?.status === "paid";

  return (
    <StoreContainer className="pt-10">
      <div className="mx-auto max-w-lg">
        {failed ? (
          <Alert tone="danger">El pago no se completó. Podés intentar de nuevo desde la ficha.</Alert>
        ) : pending && !delivered ? (
          <Alert tone="warn">Pago pendiente o en proceso. Cuando Mercado Pago lo confirme, armamos la entrega.</Alert>
        ) : mailPending ? (
          <Alert tone="warn">
            El pago está OK. El mail de descarga se manda cuando Resend esté configurado;
            mientras tanto se reenvía desde el panel.
          </Alert>
        ) : (
          <Alert tone="ok">Ya registramos tu compra. Estamos generando la entrega.</Alert>
        )}
        <h1 className="font-display mt-6 text-3xl font-bold">Revisá tu email</h1>
        <p className="mt-3 text-muted">
          {order
            ? `Te vamos a escribir a ${order.buyerEmail}. Si no está, mirá spam.`
            : "Si el pago se confirmó, el archivo llega al email que ingresaste."}
        </p>
        {order?.lastEmailError ? (
          <p className="mt-3 text-sm text-muted">{order.lastEmailError}</p>
        ) : null}
        <Link href="/tienda" className="mt-8 inline-block font-semibold text-rose-deep">
          Volver a la tienda
        </Link>
      </div>
    </StoreContainer>
  );
}
