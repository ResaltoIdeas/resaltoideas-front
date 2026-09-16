import Image from "next/image";
import Link from "next/link";

type Props = {
  size?: "sm" | "md" | "lg";
  href?: string | null;
  subtitle?: boolean;
};

const typeSizes = {
  sm: "text-[22px] leading-none",
  md: "text-[28px] leading-none",
  lg: "text-[36px] sm:text-[44px] leading-none",
};

const logoSizes = {
  sm: 40,
  md: 52,
  lg: 72,
};

export function Wordmark({ size = "md", href = "/", subtitle = true }: Props) {
  const px = logoSizes[size];
  const inner = (
    <span className="inline-flex items-center gap-3">
      <Image
        src="/logo.png"
        alt="Resalto Ideas"
        width={px}
        height={px}
        className="rounded-xl shrink-0"
        priority={size === "lg"}
      />
      <span className="inline-flex flex-col min-w-0">
        <span className={`font-display font-bold text-ink ${typeSizes[size]}`}>
          Resalto Ideas
        </span>
        {subtitle ? (
          <span className="mt-1 text-sm font-medium text-muted">
            Tienda de productos digitales
          </span>
        ) : null}
      </span>
    </span>
  );

  if (!href) return inner;
  return <Link href={href}>{inner}</Link>;
}
