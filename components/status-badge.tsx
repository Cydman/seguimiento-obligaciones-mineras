import type { ObligationStatus } from "@/types/obligations";

interface StatusBadgeProps {
  status: ObligationStatus;
}

const statusStyles: Record<ObligationStatus, string> = {
  pendiente: "border-amber-500/30 bg-amber-500/15 text-amber-300",
  en_proceso: "border-sky-500/30 bg-sky-500/15 text-sky-300",
  cumplida: "border-emerald-500/30 bg-emerald-500/15 text-emerald-300",
  vencida: "border-red-500/30 bg-red-500/15 text-red-300",
};

const statusLabels: Record<ObligationStatus, string> = {
  pendiente: "Pendiente",
  en_proceso: "En proceso",
  cumplida: "Cumplida",
  vencida: "Vencida",
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold tracking-wide ${statusStyles[status]}`}
    >
      {statusLabels[status]}
    </span>
  );
}