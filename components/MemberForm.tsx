"use client";

import { FormEvent, useState } from "react";
import { Button } from "./ui/Button";
import { addMonths, todayISO } from "@/lib/dates";
import type { FrequencyMonths, Member, PaymentStatus } from "@/lib/types";

const FREQUENCIES: { value: FrequencyMonths; label: string }[] = [
  { value: 1, label: "Mensual" },
  { value: 3, label: "Trimestral" },
  { value: 6, label: "Semestral" },
  { value: 12, label: "Anual" },
];

interface MemberFormProps {
  initial?: Member;
  onSave: (data: Omit<Member, "id">) => void;
  onCancel: () => void;
}

export function MemberForm({ initial, onSave, onCancel }: MemberFormProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [plan, setPlan] = useState(initial?.plan ?? "");
  const [amount, setAmount] = useState(initial ? String(initial.amountCents / 100) : "");
  const [frequencyMonths, setFrequencyMonths] = useState<FrequencyMonths>(initial?.frequencyMonths ?? 1);
  const [startDate, setStartDate] = useState(initial?.startDate ?? todayISO());
  const [renewalDate, setRenewalDate] = useState(initial?.renewalDate ?? addMonths(todayISO(), 1));
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(initial?.paymentStatus ?? "al_dia");
  const [contact, setContact] = useState(initial?.contact ?? "");
  const [notes, setNotes] = useState(initial?.notes ?? "");
  const [error, setError] = useState("");

  function handleFrequencyChange(months: FrequencyMonths) {
    setFrequencyMonths(months);
    if (!initial) setRenewalDate(addMonths(startDate, months));
  }

  function handleStartDateChange(value: string) {
    setStartDate(value);
    if (!initial) setRenewalDate(addMonths(value, frequencyMonths));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const amountNumber = Number(amount);
    if (!name.trim()) return setError("El nombre es obligatorio.");
    if (!plan.trim()) return setError("El plan es obligatorio.");
    if (!amount || Number.isNaN(amountNumber) || amountNumber < 0) return setError("Ingresa un monto válido.");
    if (!startDate) return setError("La fecha de inicio es obligatoria.");
    if (!renewalDate) return setError("La fecha de renovación es obligatoria.");
    setError("");
    onSave({
      name: name.trim(),
      plan: plan.trim(),
      amountCents: Math.round(amountNumber * 100),
      frequencyMonths,
      startDate,
      renewalDate,
      paymentStatus,
      contact: contact.trim(),
      notes: notes.trim(),
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      data-testid="member-form"
      className="rounded-2xl border border-parchment-dim bg-white/70 p-5"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-ink">Nombre del miembro</span>
          <input
            data-testid="field-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej. Ana Torres"
            className="rounded-lg border border-parchment-dim bg-parchment px-3 py-2 text-sm text-ink outline-none focus:border-renewal"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-ink">Plan</span>
          <input
            data-testid="field-plan"
            value={plan}
            onChange={(e) => setPlan(e.target.value)}
            placeholder="Ej. Plan full, mensualidad academia..."
            className="rounded-lg border border-parchment-dim bg-parchment px-3 py-2 text-sm text-ink outline-none focus:border-renewal"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-ink">Monto por ciclo (MXN)</span>
          <input
            data-testid="field-amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            type="number"
            min="0"
            step="0.01"
            placeholder="Ej. 600"
            className="rounded-lg border border-parchment-dim bg-parchment px-3 py-2 text-sm text-ink outline-none focus:border-renewal font-mono"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-ink">Frecuencia de cobro</span>
          <select
            data-testid="field-frequency"
            value={frequencyMonths}
            onChange={(e) => handleFrequencyChange(Number(e.target.value) as FrequencyMonths)}
            className="rounded-lg border border-parchment-dim bg-parchment px-3 py-2 text-sm text-ink outline-none focus:border-renewal"
          >
            {FREQUENCIES.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-ink">Fecha de inicio</span>
          <input
            data-testid="field-start-date"
            value={startDate}
            onChange={(e) => handleStartDateChange(e.target.value)}
            type="date"
            className="rounded-lg border border-parchment-dim bg-parchment px-3 py-2 text-sm text-ink outline-none focus:border-renewal font-mono"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-ink">Próxima renovación</span>
          <input
            data-testid="field-renewal-date"
            value={renewalDate}
            onChange={(e) => setRenewalDate(e.target.value)}
            type="date"
            className="rounded-lg border border-parchment-dim bg-parchment px-3 py-2 text-sm text-ink outline-none focus:border-renewal font-mono"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-ink">Estado de pago</span>
          <select
            data-testid="field-payment-status"
            value={paymentStatus}
            onChange={(e) => setPaymentStatus(e.target.value as PaymentStatus)}
            className="rounded-lg border border-parchment-dim bg-parchment px-3 py-2 text-sm text-ink outline-none focus:border-renewal"
          >
            <option value="al_dia">Al día</option>
            <option value="pendiente">Pendiente</option>
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-ink">Contacto (opcional)</span>
          <input
            data-testid="field-contact"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder="Teléfono o email"
            className="rounded-lg border border-parchment-dim bg-parchment px-3 py-2 text-sm text-ink outline-none focus:border-renewal"
          />
        </label>
      </div>
      <label className="mt-4 flex flex-col gap-1 text-sm">
        <span className="font-medium text-ink">Notas (opcional)</span>
        <textarea
          data-testid="field-notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          className="rounded-lg border border-parchment-dim bg-parchment px-3 py-2 text-sm text-ink outline-none focus:border-renewal"
        />
      </label>
      {error && (
        <p data-testid="form-error" className="mt-3 text-sm font-medium text-ember">
          {error}
        </p>
      )}
      <div className="mt-5 flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" data-testid="submit-member">
          {initial ? "Guardar cambios" : "Agregar miembro"}
        </Button>
      </div>
    </form>
  );
}
