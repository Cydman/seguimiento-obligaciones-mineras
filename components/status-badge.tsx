import type { ObligationStatus } from "@/types/obligations";

interface StatusBadgeProps {
  status: ObligationStatus;
}

const statusStyles: Record<ObligationStatus, string> = {
  pendiente: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  en_proceso: "bg-sky-500/15 text-sky-300 border-sky-500/30",
  cumplida: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  vencida: "bg-red-500/15 text-red-300 border-red-500/30",
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
      className={`inline-flex rounded-full border px-3 py-1 text-sm font-medium ${statusStyles[status]}`}
    >
      {statusLabels[status]}
    </span>
  );
}