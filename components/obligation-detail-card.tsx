import { formatDateDisplay } from "@/lib/format-date";
import type { Obligation } from "@/types/obligations";

interface ObligationDetailCardProps {
  obligation: Obligation;
}

function formatCategory(category: string) {
  switch (category) {
    case "tecnica":
      return "Técnica";
    case "juridica":
      return "Jurídica";
    case "economica":
      return "Económica";
    case "social":
      return "Social";
    case "ambiental":
      return "Ambiental";
    default:
      return category;
  }
}

function formatAuthority(authority: string) {
  switch (authority) {
    case "MUNICIPIO":
      return "Municipio";
    case "OTRA":
      return "Otra";
    default:
      return authority;
  }
}

function formatPriority(priority: string) {
  switch (priority) {
    case "alta":
      return "Alta";
    case "media":
      return "Media";
    case "baja":
      return "Baja";
    default:
      return priority;
  }
}

function formatStatus(status: string) {
  switch (status) {
    case "pendiente":
      return "Pendiente";
    case "en_proceso":
      return "En proceso";
    case "cumplida":
      return "Cumplida";
    case "vencida":
      return "Vencida";
    default:
      return status;
  }
}

function MetaPill({ label }: { label: string }) {
  return (
    <span className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs font-medium text-slate-200">
      {label}
    </span>
  );
}

export function ObligationDetailCard({
  obligation,
}: ObligationDetailCardProps) {
  return (
    <details className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
      <summary className="cursor-pointer list-none px-5 py-4">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="min-w-0 flex-1">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
              {obligation.code}
            </p>
            <h2 className="mt-2 truncate text-2xl font-bold text-white">
              {obligation.name}
            </h2>
          </div>

          <div className="flex flex-wrap gap-2 xl:max-w-[52%] xl:justify-end">
            <MetaPill label={`Categoría: ${formatCategory(obligation.category)}`} />
            <MetaPill label={`Autoridad: ${formatAuthority(obligation.authority)}`} />
            <MetaPill label={`Estado: ${formatStatus(obligation.status)}`} />
            <MetaPill label={`Prioridad: ${formatPriority(obligation.priority)}`} />
            <MetaPill label={`Vence: ${formatDateDisplay(obligation.dueDate)}`} />
          </div>
        </div>
      </summary>

      <div className="border-t border-slate-800 bg-slate-950/30 px-5 py-5">
        <div className="grid gap-5 xl:grid-cols-2">
          <div>
            <h3 className="text-lg font-semibold">Descripción</h3>
            <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-300">
              {obligation.description}
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Fundamento jurídico o técnico</h3>
            <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-300">
              {obligation.legalBasis || "No se registró fundamento jurídico o técnico."}
            </p>
          </div>
        </div>
      </div>
    </details>
  );
}