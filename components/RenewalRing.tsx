import type { UrgencyBucket } from "@/lib/status";

const BUCKET_COLOR: Record<UrgencyBucket, string> = {
  vencido: "var(--color-ember)",
  urgente: "var(--color-ember)",
  proximo: "var(--color-amber)",
  por_venir: "var(--color-amber)",
  al_dia: "var(--color-renewal)",
};

interface RenewalRingProps {
  /** 0 (cycle just started) to 1 (renewal date reached). */
  progress: number;
  bucket: UrgencyBucket;
  size?: number;
  strokeWidth?: number;
}

/**
 * Renewly's signature mark: a ring that fills as a membership moves through its billing
 * cycle. Overdue members get a fully-filled ring plus a solid center dot, so urgency reads
 * from shape as much as from color.
 */
export function RenewalRing({ progress, bucket, size = 56, strokeWidth = 5 }: RenewalRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(1, Math.max(0, progress));
  const dash = circumference * clamped;
  const color = BUCKET_COLOR[bucket];
  const overdue = bucket === "vencido";

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="shrink-0"
      role="img"
      aria-label={overdue ? "Ciclo vencido" : `Ciclo al ${Math.round(clamped * 100)} por ciento`}
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="var(--color-parchment-dim)"
        strokeWidth={strokeWidth}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={`${dash} ${circumference - dash}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: "stroke-dasharray 0.4s ease" }}
      />
      {overdue && <circle cx={size / 2} cy={size / 2} r={Math.max(3, strokeWidth * 0.9)} fill={color} />}
    </svg>
  );
}
