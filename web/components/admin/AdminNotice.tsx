"use client";

import { Suspense, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Alert } from "@/components/ui/Alert";

const MESSAGES: Record<string, { tone: "ok" | "warn" | "danger"; text: string }> = {
  created: { tone: "ok", text: "Producto creado." },
  saved: { tone: "ok", text: "Producto guardado." },
  resent: { tone: "ok", text: "Entrega reenviada al email del comprador." },
  "resent-queued": {
    tone: "warn",
    text: "Pedido actualizado. El mail se manda cuando Resend esté configurado.",
  },
  "resent-error": { tone: "danger", text: "No se pudo reenviar la entrega." },
  email: { tone: "ok", text: "Email actualizado y entrega reenviada." },
  content: { tone: "ok", text: "Contenido del sitio guardado." },
};

function AdminNoticeInner() {
  const params = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const key = params.get("notice");
  const msg = key ? MESSAGES[key] : null;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!msg) {
      setVisible(false);
      return;
    }
    setVisible(true);
    const timer = window.setTimeout(() => {
      setVisible(false);
      router.replace(pathname, { scroll: false });
    }, 4500);
    return () => window.clearTimeout(timer);
  }, [key, msg, pathname, router]);

  if (!visible || !msg) return null;

  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-50 w-[min(100%-2rem,380px)]">
      <div className="pointer-events-auto shadow-rose">
        <Alert tone={msg.tone}>{msg.text}</Alert>
      </div>
    </div>
  );
}

export function AdminNotice() {
  return (
    <Suspense fallback={null}>
      <AdminNoticeInner />
    </Suspense>
  );
}
