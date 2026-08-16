/** The renewal-loop mark: an open ring with an arrowhead and a due-date dot, echoing the RenewalRing signature. */
export function RenewalMark({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path
        d="M16 3a13 13 0 1 1 -9.19 22.19"
        stroke="var(--color-parchment)"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M4.5 20.5 L6.81 25.19 L11.5 22.5"
        stroke="var(--color-parchment)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="16" cy="16" r="3.5" fill="var(--color-ember)" />
    </svg>
  );
}

export function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink">
        <RenewalMark size={22} />
      </div>
      <div className="leading-tight">
        <p className="font-display text-lg font-semibold tracking-tight text-ink">Renewly</p>
        <p className="text-xs text-mist">Seguimiento de membresías</p>
      </div>
    </div>
  );
}
