"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "./ui/Button";
import { MemberForm } from "./MemberForm";
import { MemberCard } from "./MemberCard";
import { PriorityList } from "./PriorityList";
import { StatTile } from "./StatTile";
import { getMembers, saveMembers } from "@/lib/storage";
import { addMonths, todayISO } from "@/lib/dates";
import { getMemberStatus, priorityScore, type UrgencyBucket } from "@/lib/status";
import { formatCurrency } from "@/lib/format";
import type { Member } from "@/lib/types";

type StatusFilter = "todos" | UrgencyBucket;

export function RenewlyView() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Member | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("todos");

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setMembers(getMembers());
    setLoaded(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  function persist(next: Member[]) {
    setMembers(next);
    saveMembers(next);
  }

  function handleAdd(data: Omit<Member, "id">) {
    persist([...members, { ...data, id: crypto.randomUUID() }]);
    setShowForm(false);
  }

  function handleUpdate(data: Omit<Member, "id">) {
    if (!editing) return;
    persist(members.map((m) => (m.id === editing.id ? { ...data, id: editing.id } : m)));
    setEditing(null);
  }

  function handleDelete(id: string) {
    persist(members.filter((m) => m.id !== id));
  }

  function handleRenew(id: string) {
    const today = todayISO();
    persist(
      members.map((m) => {
        if (m.id !== id) return m;
        // Advance from the later of "today" or the current renewal date, so a lapsed
        // membership doesn't inherit debt from months it wasn't paid.
        const base = m.renewalDate > today ? m.renewalDate : today;
        return { ...m, renewalDate: addMonths(base, m.frequencyMonths), paymentStatus: "al_dia" as const };
      })
    );
  }

  function handleTogglePayment(id: string) {
    persist(
      members.map((m) =>
        m.id === id
          ? { ...m, paymentStatus: m.paymentStatus === "pendiente" ? ("al_dia" as const) : ("pendiente" as const) }
          : m
      )
    );
  }

  const priorityMembers = useMemo(() => {
    return members
      .filter((m) => {
        const { bucket } = getMemberStatus(m);
        return bucket !== "al_dia" || m.paymentStatus === "pendiente";
      })
      .sort((a, b) => priorityScore(b) - priorityScore(a))
      .slice(0, 8);
  }, [members]);

  const filtered = useMemo(() => {
    return members
      .filter((m) => (statusFilter === "todos" ? true : getMemberStatus(m).bucket === statusFilter))
      .filter((m) => {
        if (!search.trim()) return true;
        const q = search.trim().toLowerCase();
        return m.name.toLowerCase().includes(q) || m.plan.toLowerCase().includes(q);
      })
      .sort((a, b) => priorityScore(b) - priorityScore(a));
  }, [members, statusFilter, search]);

  const mrrCents = members.reduce((sum, m) => sum + m.amountCents / m.frequencyMonths, 0);
  const vencidosCount = members.filter((m) => getMemberStatus(m).bucket === "vencido").length;
  const urgentesCount = members.filter((m) => getMemberStatus(m).bucket === "urgente").length;
  const pendientesCount = members.filter((m) => m.paymentStatus === "pendiente").length;

  if (!loaded) {
    return <div className="flex min-h-[50vh] items-center justify-center text-sm text-mist">Cargando…</div>;
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">Panel de membresías</h1>
          <p className="text-sm text-ink/60">
            Quién está por vencer, quién ya venció, y cuánto ingreso recurrente estimas este mes.
          </p>
        </div>
        <Button
          onClick={() => {
            setShowForm((v) => !v);
            setEditing(null);
          }}
          data-testid="new-member-button"
        >
          <Plus size={15} /> Nuevo miembro
        </Button>
      </div>

      {showForm && (
        <div className="mb-6">
          <MemberForm onSave={handleAdd} onCancel={() => setShowForm(false)} />
        </div>
      )}
      {editing && (
        <div className="mb-6">
          <MemberForm initial={editing} onSave={handleUpdate} onCancel={() => setEditing(null)} />
        </div>
      )}

      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile
          label="Ingreso recurrente estimado / mes"
          value={formatCurrency(Math.round(mrrCents))}
          tone="renewal"
        />
        <StatTile label="Vencidos" value={String(vencidosCount)} tone="ember" />
        <StatTile label="Vencen en 7 días" value={String(urgentesCount)} tone="amber" />
        <StatTile label="Pago pendiente" value={String(pendientesCount)} tone="amber" />
      </div>

      <section className="mb-8">
        <h2 className="mb-3 font-display text-lg font-semibold text-ink">A quién contactar primero</h2>
        <PriorityList members={priorityMembers} onRenew={handleRenew} />
      </section>

      <section>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-lg font-semibold text-ink">Todos los miembros</h2>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search size={14} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-mist" />
              <input
                data-testid="search-input"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar miembro o plan…"
                className="rounded-full border border-parchment-dim bg-white/70 py-1.5 pl-8 pr-3 text-sm text-ink outline-none focus:border-renewal"
              />
            </div>
            <select
              data-testid="status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
              className="rounded-full border border-parchment-dim bg-white/70 px-3 py-1.5 text-sm text-ink outline-none focus:border-renewal"
            >
              <option value="todos">Todos los estados</option>
              <option value="vencido">Vencidos</option>
              <option value="urgente">Vence en 7 días</option>
              <option value="proximo">Vence en 14 días</option>
              <option value="por_venir">Vence en 30 días</option>
              <option value="al_dia">Al día</option>
            </select>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-parchment-dim bg-white/50 p-8 text-center text-sm text-mist">
            {members.length === 0
              ? "Todavía no registras miembros. Agrega el primero para empezar a dar seguimiento."
              : "Ningún miembro coincide con estos filtros."}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            {filtered.map((m) => (
              <MemberCard
                key={m.id}
                member={m}
                onEdit={(mem) => {
                  setEditing(mem);
                  setShowForm(false);
                }}
                onDelete={handleDelete}
                onRenew={handleRenew}
                onTogglePayment={handleTogglePayment}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
