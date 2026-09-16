import { getSettings } from "@/lib/db";
import { StoreFooter } from "@/components/store/StoreFooter";
import { StoreNav } from "@/components/store/StoreNav";

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSettings();
  return (
    <div className="flex min-h-screen flex-col">
      <StoreNav />
      <main className="flex-1">{children}</main>
      <StoreFooter settings={settings} />
    </div>
  );
}
