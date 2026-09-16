import { notFound } from "next/navigation";
import { getLegalBySlug } from "@/lib/db";
import { StoreContainer } from "@/components/store/StoreContainer";

type Props = { params: Promise<{ slug: string }> };

const allowed = ["terminos", "privacidad", "compra-entrega"] as const;

export default async function LegalPage({ params }: Props) {
  const { slug } = await params;
  if (!allowed.includes(slug as (typeof allowed)[number])) notFound();
  const page = await getLegalBySlug(slug);
  if (!page) notFound();

  return (
    <StoreContainer className="pt-10">
      <article className="mx-auto max-w-2xl">
        <h1 className="font-display text-4xl font-bold">{page.title}</h1>
        <p className="mt-6 whitespace-pre-wrap leading-relaxed text-muted">{page.body}</p>
      </article>
    </StoreContainer>
  );
}
