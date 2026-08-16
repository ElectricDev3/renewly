"use client";

import { RotateCw } from "lucide-react";
import { RenewalRing } from "./RenewalRing";
import { StatusBadge } from "./StatusBadge";
import { Button } from "./ui/Button";
import { formatCurrency } from "@/lib/format";
import { cycleProgress } from "@/lib/dates";
import { daysLabel, getMemberStatus } from "@/lib/status";
import type { Member } from "@/lib/types";

interface PriorityListProps {
  members: Member[];
  onRenew: (id: string) => void;
}

export function PriorityList({ members, onRenew }: PriorityListProps) {
  if (members.length === 0) {
    return (
      <div className="rounded-2xl border border-parchment-dim bg-white/50 p-6 text-center text-sm text-mist">
        Nadie necesita seguimiento ahora mismo. Todos los miembros están al día.
      </div>
    );
  }

  return (
    <ol className="flex flex-col gap-2" data-testid="priority-list">
      {members.map((member, i) => {
        const { bucket, daysUntil } = getMemberStatus(member);
        const progress = cycleProgress(member.renewalDate, member.frequencyMonths);
        return (
          <li
            key={member.id}
            data-testid="priority-item"
            className="flex flex-wrap items-center gap-3 rounded-xl border border-parchment-dim bg-white/70 px-3 py-2.5"
          >
            <span className="w-5 shrink-0 text-center font-mono text-xs text-mist">{i + 1}</span>
            <RenewalRing progress={progress} bucket={bucket} size={36} strokeWidth={4} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-ink">{member.name}</p>
              <p className="truncate text-xs text-mist">
                {daysLabel(daysUntil)} · {formatCurrency(member.amountCents)}
              </p>
            </div>
            <StatusBadge bucket={bucket} />
            <Button variant="secondary" onClick={() => onRenew(member.id)} className="!px-2.5 !py-1.5 text-xs">
              <RotateCw size={13} /> Renovar
            </Button>
          </li>
        );
      })}
    </ol>
  );
}
