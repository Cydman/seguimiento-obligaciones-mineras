import Link from "next/link";
import { formatDateDisplay } from "@/lib/format-date";
import type { Obligation } from "@/types/obligations";

interface ObligationDetailCardProps {
  obligation: Obligation;
  backHref: string;
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
    case "ANM":
      return "ANM";
    case "ANLA":
      return "ANLA";
    case "CAR":
      return "CAR";
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

export function ObligationDetailCard({
  obligation,
  backHref,
}: ObligationDetailCardProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Link
          href={backHref}
          className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-medium text-white transition hover:border-slate-500"
        >
          Volver
        </Link>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-wide text-slate-400">
              {obligation.code}
            </p>
            <h2 className="mt-2 text-3xl font-bold">{obligation.name}</h2>
          </div>

          <div className="grid gap-2 text-sm text-slate-300 md:grid-cols-2">
            <p>Categoría: {formatCategory(obligation.category)}</p>
            <p>Autoridad: {formatAuthority(obligation.authority)}</p>
            <p>Estado: {formatStatus(obligation.status)}</p>
            <p>Prioridad: {formatPriority(obligation.priority)}</p>
            <p>Vence: {formatDateDisplay(obligation.dueDate)}</p>
          </div>
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <div>
            <h3 className="text-lg font-semibold">Descripción</h3>
            <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-300">
              {obligation.description}
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Fundamento jurídico o técnico</h3>
            <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-300">
              {obligation.legalBasis || "No registrado."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}