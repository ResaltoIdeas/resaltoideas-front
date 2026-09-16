type Tone = "ok" | "warn" | "danger" | "muted" | "rose" | "mp";

const tones: Record<Tone, string> = {
  ok: "bg-[#3d7a64]/12 text-ok",
  warn: "bg-[#c9a227]/15 text-[#8a6e10]",
  danger: "bg-danger/12 text-danger",
  muted: "bg-rose-wash text-muted",
  rose: "bg-rose-light text-ink",
  mp: "bg-[#009ee3]/12 text-mp",
};

export function Badge({
  children,
  tone = "muted",
}: {
  children: React.ReactNode;
  tone?: Tone;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${tones[tone]}`}
    >
      {children}
    </span>
  );
}
