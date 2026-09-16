import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { Wordmark } from "@/components/ui/Wordmark";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata = { title: "Ingresar" };

export default async function LoginPage() {
  const session = await getAdminSession();
  if (session) redirect("/admin");

  return (
    <div className="flex min-h-screen items-center justify-center px-5 py-12">
      <div className="w-full max-w-md rounded-xl border border-[var(--line)] bg-surface p-8 shadow-rose">
        <Wordmark size="lg" href={null} />
        <h1 className="sr-only">Ingresar</h1>
        <p className="mt-8 mb-6 text-sm text-muted">Panel de la tienda. No es público.</p>
        <LoginForm />
      </div>
    </div>
  );
}
