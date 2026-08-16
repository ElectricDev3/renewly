export type FrequencyMonths = 1 | 3 | 6 | 12;
export type PaymentStatus = "al_dia" | "pendiente";

export interface Member {
  id: string;
  name: string;
  plan: string;
  contact: string;
  amountCents: number;
  frequencyMonths: FrequencyMonths;
  startDate: string; // YYYY-MM-DD
  renewalDate: string; // YYYY-MM-DD
  paymentStatus: PaymentStatus;
  notes: string;
}
