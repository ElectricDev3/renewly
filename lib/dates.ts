const DAY_MS = 24 * 60 * 60 * 1000;

/** Today's date as a YYYY-MM-DD string in local time. */
export function todayISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function parseISO(iso: string): Date {
  return new Date(`${iso}T00:00:00`);
}

/** Whole days from `fromIso` to `toIso` (positive when `toIso` is later). */
export function daysBetween(fromIso: string, toIso: string): number {
  const from = parseISO(fromIso);
  const to = parseISO(toIso);
  return Math.round((to.getTime() - from.getTime()) / DAY_MS);
}

/** Days from today until `renewalDate` (negative when already overdue). */
export function daysUntil(renewalDate: string, referenceIso: string = todayISO()): number {
  return daysBetween(referenceIso, renewalDate);
}

/** Adds (or subtracts, with a negative value) whole calendar months to an ISO date. */
export function addMonths(iso: string, months: number): string {
  const d = parseISO(iso);
  const result = new Date(d.getFullYear(), d.getMonth() + months, d.getDate());
  return `${result.getFullYear()}-${String(result.getMonth() + 1).padStart(2, "0")}-${String(result.getDate()).padStart(2, "0")}`;
}

/** The date the current billing cycle started, derived from the renewal date and its frequency. */
export function cycleStartDate(renewalDate: string, frequencyMonths: number): string {
  return addMonths(renewalDate, -frequencyMonths);
}

/** How far through the current billing cycle we are, from 0 (just started) to 1 (renewal date reached). */
export function cycleProgress(
  renewalDate: string,
  frequencyMonths: number,
  referenceIso: string = todayISO()
): number {
  const start = cycleStartDate(renewalDate, frequencyMonths);
  const totalDays = daysBetween(start, renewalDate);
  if (totalDays <= 0) return 1;
  const elapsed = daysBetween(start, referenceIso);
  return Math.min(1, Math.max(0, elapsed / totalDays));
}
