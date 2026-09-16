import { NextRequest, NextResponse } from "next/server";
import { fulfillMpPayment } from "@/lib/fulfill";

export async function POST(req: NextRequest) {
  let body: Record<string, unknown> = {};
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    body = {};
  }
  const queryId = req.nextUrl.searchParams.get("data.id") || req.nextUrl.searchParams.get("id");
  const nested = body.data as { id?: string } | undefined;
  const paymentId = String(queryId || nested?.id || body.id || "");
  const type = String(body.type || req.nextUrl.searchParams.get("type") || "");

  if (!paymentId || (type && type !== "payment")) {
    return NextResponse.json({ ignored: true });
  }

  try {
    const result = await fulfillMpPayment(paymentId);
    return NextResponse.json(result);
  } catch (err) {
    console.error("mp webhook", err);
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}

export async function GET(req: NextRequest) {
  return POST(req);
}
