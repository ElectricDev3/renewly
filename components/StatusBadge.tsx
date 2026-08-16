import { AlertTriangle, CalendarClock, CheckCircle2, Clock3 } from "lucide-react";
import { BUCKET_LABEL, type UrgencyBucket } from "@/lib/status";

const ICON: Record<UrgencyBucket, typeof AlertTriangle> = {
  vencido: AlertTriangle,
  urgente: Clock3,
  proximo: CalendarClock,
  por_venir: CalendarClock,
  al_dia: CheckCircle2,
};

const CLASS: Record<UrgencyBucket, string> = {
  vencido: "bg-ember text-white",
  urgente: "border-2 border-ember text-ember bg-ember/10",
  proximo: "border border-amber text-amber-deep bg-amber/15",
  por_venir: "border border-mist/50 text-ink/70",
  al_dia: "text-renewal-deep bg-renewal/10",
};

export function StatusBadge({ bucket }: { bucket: UrgencyBucket }) {
  const Icon = ICON[bucket];
  return (
    <span
      data-testid="status-badge"
      data-bucket={bucket}
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap ${CLASS[bucket]}`}
    >
      <Icon size={13} strokeWidth={2.5} />
      {BUCKET_LABEL[bucket]}
    </span>
  );
}
