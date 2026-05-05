"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { DeactivateObligationForm } from "@/components/deactivate-obligation-form";
import { StatusBadge } from "@/components/status-badge";
import {
  formatBusinessDaysRemaining,
  getBusinessDaysBadgeClass,
  getColombiaBusinessDaysRemaining,
} from "@/lib/business-days";
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

function BusinessDaysCell({ dueDate }: { dueDate: string }) {
  const days = getColombiaBusinessDaysRemaining(dueDate);

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${getBusinessDaysBadgeClass(
        days
      )}`}
      title="Días hábiles restantes para el vencimiento"
    >
      {formatBusinessDaysRemaining(days)}
    </span>
  );
}

const PAGE_SIZE = 12;

export function AdminObligationsTable({
  obligations,
}: AdminObligationsTableProps) {
  const ordered = useMemo(
    () =>
      [...obligations].sort(
        (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      ),
    [obligations]
  );

  const totalPages = Math.max(1, Math.ceil(ordered.length / PAGE_SIZE));
  const [page, setPage] = useState(1);
  const currentPage = Math.min(page, totalPages);

  const rows = ordered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

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
              <th className="px-4 py-3">Días háb.</th>
              <th className="px-4 py-3">Vencimiento</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3">Acción</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-10 text-center text-sm text-slate-400"
                >
                  No hay obligaciones para los filtros seleccionados.
                </td>
              </tr>
            ) : (
              rows.map((obligation) => (
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
                    <BusinessDaysCell dueDate={obligation.dueDate} />
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

      {ordered.length > PAGE_SIZE ? (
        <div className="flex items-center justify-between border-t border-slate-800 px-4 py-3 text-sm text-slate-300">
          <span>
            Página {currentPage} de {totalPages}
          </span>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="rounded-xl border border-slate-700 px-3 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              Anterior
            </button>
            <button
              type="button"
              onClick={() =>
                setPage((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={currentPage === totalPages}
              className="rounded-xl border border-slate-700 px-3 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}