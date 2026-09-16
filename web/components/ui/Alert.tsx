type Tone = "ok" | "warn" | "danger";

const tones: Record<Tone, string> = {
  ok: "border-ok/30 bg-[#3d7a64]/8 text-ok",
  warn: "border-warn/40 bg-[#c9a227]/10 text-ink",
  danger: "border-danger/30 bg-danger/8 text-danger",
};

export function Alert({
  tone,
  children,
}: {
  tone: Tone;
  children: React.ReactNode;
}) {
  return (
    <div className={`rounded-xl border px-4 py-3 text-sm ${tones[tone]}`}>
      {children}
    </div>
  );
}
