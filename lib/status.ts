import { daysUntil, todayISO } from "./dates";
import type { Member } from "./types";

export type UrgencyBucket = "vencido" | "urgente" | "proximo" | "por_venir" | "al_dia";

export interface MemberStatus {
  daysUntil: number;
  bucket: UrgencyBucket;
}

/** Classifies a member's renewal urgency from real date math against `referenceIso` (defaults to today). */
export function getMemberStatus(member: Member, referenceIso: string = todayISO()): MemberStatus {
  const days = daysUntil(member.renewalDate, referenceIso);
  let bucket: UrgencyBucket;
  if (days < 0) bucket = "vencido";
  else if (days <= 7) bucket = "urgente";
  else if (days <= 14) bucket = "proximo";
  else if (days <= 30) bucket = "por_venir";
  else bucket = "al_dia";
  return { daysUntil: days, bucket };
}

export const BUCKET_LABEL: Record<UrgencyBucket, string> = {
  vencido: "Vencido",
  urgente: "Vence en 7 días",
  proximo: "Vence en 14 días",
  por_venir: "Vence en 30 días",
  al_dia: "Al día",
};

/** Higher score = contact sooner. Overdue days dominate; a pending payment adds extra weight. */
export function priorityScore(member: Member, referenceIso: string = todayISO()): number {
  const { daysUntil: days } = getMemberStatus(member, referenceIso);
  let score = -days;
  if (member.paymentStatus === "pendiente") score += 6;
  return score;
}

export function daysLabel(days: number): string {
  if (days < 0) {
    const n = Math.abs(days);
    return `Venció hace ${n} día${n === 1 ? "" : "s"}`;
  }
  if (days === 0) return "Vence hoy";
  return `Faltan ${days} día${days === 1 ? "" : "s"}`;
}
