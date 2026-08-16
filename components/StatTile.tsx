type Tone = "default" | "ember" | "amber" | "renewal";

const TONE_CLASS: Record<Tone, string> = {
  default: "text-ink",
  ember: "text-ember",
  amber: "text-amber-deep",
  renewal: "text-renewal-deep",
};

export function StatTile({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: Tone;
}) {
  return (
    <div className="rounded-2xl border border-parchment-dim bg-white/60 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-mist">{label}</p>
      <p className={`mt-1 font-display text-3xl font-semibold ${TONE_CLASS[tone]}`}>{value}</p>
    </div>
  );
}
