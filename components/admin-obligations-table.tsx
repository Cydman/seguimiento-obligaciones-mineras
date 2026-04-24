import Link from "next/link";
import { DeactivateObligationForm } from "@/components/deactivate-obligation-form";
import { StatusBadge } from "@/components/status-badge";
import { formatDateDisplay } from "@/lib/format-date";
import type { Obligation } from "@/types/obligations";

interface AdminObligationsTableProps {
  obligations: Obligation[];
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

export function AdminObligationsTable({
  obligations,
}: AdminObligationsTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-800/70 text-slate-300">
            <tr>
              <th className="px-4 py-3">Código</th>
              <th className="px-4 py-3">Obligación</th>
              <th className="px-4 py-3">Autoridad</th>
              <th className="px-4 py-3">Prioridad</th>
              <th className="px-4 py-3">Vencimiento</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3">Acción</th>
            </tr>
          </thead>
          <tbody>
            {obligations.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-10 text-center text-sm text-slate-400"
                >
                  No hay obligaciones para los filtros seleccionados.
                </td>
              </tr>
            ) : (
              obligations.map((obligation) => (
                <tr
                  key={obligation.id}
                  className="border-t border-slate-800 text-slate-200 align-top"
                >
                  <td className="px-4 py-3 whitespace-nowrap">
                    <Link
                      href={`/admin/obligations/${obligation.id}`}
                      className="font-medium text-emerald-300 hover:underline"
                    >
                      {obligation.code}
                    </Link>
                  </td>
                  <td className="px-4 py-3 min-w-[280px]">{obligation.name}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {formatAuthority(obligation.authority)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {formatPriority(obligation.priority)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {formatDateDisplay(obligation.dueDate)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <StatusBadge status={obligation.status} />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <DeactivateObligationForm
                      obligationId={obligation.id}
                      obligationCode={obligation.code}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}