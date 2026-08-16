"use client";

import { CircleDollarSign, Pencil, RotateCw, Trash2 } from "lucide-react";
import { RenewalRing } from "./RenewalRing";
import { StatusBadge } from "./StatusBadge";
import { Button } from "./ui/Button";
import { formatCurrency, formatDate } from "@/lib/format";
import { cycleProgress } from "@/lib/dates";
import { daysLabel, getMemberStatus } from "@/lib/status";
import type { Member } from "@/lib/types";

interface MemberCardProps {
  member: Member;
  onEdit: (member: Member) => void;
  onDelete: (id: string) => void;
  onRenew: (id: string) => void;
  onTogglePayment: (id: string) => void;
}

export function MemberCard({ member, onEdit, onDelete, onRenew, onTogglePayment }: MemberCardProps) {
  const { bucket, daysUntil } = getMemberStatus(member);
  const progress = cycleProgress(member.renewalDate, member.frequencyMonths);
  const urgent = bucket === "vencido" || bucket === "urgente";

  return (
    <div
      data-testid="member-card"
      data-member-name={member.name}
      data-status={bucket}
      className={`rounded-2xl border bg-white/70 p-4 transition-colors ${
        bucket === "vencido" ? "border-ember/50" : bucket === "urgente" ? "border-ember/25" : "border-parchment-dim"
      }`}
    >
      <div className="flex items-start gap-4">
        <div className={urgent ? "pulse-urgent" : ""}>
          <RenewalRing progress={progress} bucket={bucket} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate font-display text-base font-semibold text-ink">{member.name}</h3>
            <StatusBadge bucket={bucket} />
            {member.paymentStatus === "pendiente" && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber/20 px-2 py-0.5 text-xs font-semibold text-amber-deep">
                <CircleDollarSign size={12} /> Pago pendiente
              </span>
            )}
          </div>
          <p className="mt-0.5 truncate text-sm text-ink/60">{member.plan}</p>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-xs text-mist">
            <span>{formatCurrency(member.amountCents)} / ciclo</span>
            <span>Renueva: {formatDate(member.renewalDate)}</span>
            <span className={bucket === "vencido" ? "font-semibold text-ember" : ""}>{daysLabel(daysUntil)}</span>
          </div>
          {member.contact && <p className="mt-1 text-xs text-mist">{member.contact}</p>}
        </div>
      </div>
      <div className="mt-3 flex flex-wrap justify-end gap-2 border-t border-parchment-dim pt-3">
        <Button variant="ghost" onClick={() => onTogglePayment(member.id)} className="!px-2.5 !py-1.5 text-xs">
          {member.paymentStatus === "pendiente" ? "Marcar pago recibido" : "Marcar pago pendiente"}
        </Button>
        <Button
          variant="secondary"
          onClick={() => onRenew(member.id)}
          className="!px-2.5 !py-1.5 text-xs"
          data-testid="renew-button"
        >
          <RotateCw size={13} /> Renovar ahora
        </Button>
        <Button variant="ghost" onClick={() => onEdit(member)} className="!px-2.5 !py-1.5 text-xs">
          <Pencil size={13} /> Editar
        </Button>
        <Button variant="danger" onClick={() => onDelete(member.id)} className="!px-2.5 !py-1.5 text-xs">
          <Trash2 size={13} /> Eliminar
        </Button>
      </div>
    </div>
  );
}
