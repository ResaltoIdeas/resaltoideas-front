import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { isSchemaReady } from "@/lib/db";
import { AdminNotice } from "@/components/admin/AdminNotice";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Alert } from "@/components/ui/Alert";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdmin();
  if (!session) redirect("/login");

  return (
    <div className="min-h-screen md:flex">
      <AdminSidebar />
      <div className="min-w-0 flex-1 p-6 sm:p-8">
        <SchemaBanner />
        <AdminNotice />
        {children}
      </div>
    </div>
  );
}

async function SchemaBanner() {
  const ready = await isSchemaReady();
  if (ready) return null;
  return (
    <div className="mb-6">
      <Alert tone="warn">
        Falta pegar el SQL de tablas en Supabase (SQL Editor). Archivo:{" "}
        <code>web/supabase/migrations/20260825_init.sql</code>. Los buckets de
        archivos ya están creados.
      </Alert>
    </div>
  );
}

