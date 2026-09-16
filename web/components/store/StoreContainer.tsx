import { cn } from "@/lib/utils";

export function StoreContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-[1120px] px-5 sm:px-6", className)}>
      {children}
    </div>
  );
}
