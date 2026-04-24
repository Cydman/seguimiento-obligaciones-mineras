"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

interface OrganizationOption {
  id: string;
  name: string;
}

interface TitleOption {
  id: string;
  code: string;
  name: string;
  organization_id: string;
  mine_name?: string | null;
}

interface AdminFiltersProps {
  organizations: OrganizationOption[];
  titles: TitleOption[];
  selectedOrganization?: string;
  selectedTitle?: string;
  selectedStatus?: string;
  searchText?: string;
}

export function AdminFilters({
  organizations,
  titles,
  selectedOrganization = "",
  selectedTitle = "",
  selectedStatus = "",
  searchText = "",
}: AdminFiltersProps) {
  const [organizationId, setOrganizationId] = useState(selectedOrganization);
  const [titleId, setTitleId] = useState(selectedTitle);

  const filteredTitles = useMemo(() => {
    if (!organizationId) return titles;
    return titles.filter((title) => title.organization_id === organizationId);
  }, [titles, organizationId]);

  useEffect(() => {
    if (!titleId) return;

    const exists = filteredTitles.some((title) => title.id === titleId);
    if (!exists) setTitleId("");
  }, [filteredTitles, titleId]);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 px-4 py-4">
      <form
        method="GET"
        className="grid gap-3 xl:grid-cols-[1.2fr_1.2fr_0.9fr_1.4fr_auto_auto]"
      >
        <div>
          <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-slate-400">
            Organización
          </label>
          <select
            name="organization"
            value={organizationId}
            onChange={(e) => {
              setOrganizationId(e.target.value);
              setTitleId("");
            }}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none focus:border-emerald-500"
          >
            <option value="">Todas</option>
            {organizations.map((org) => (
              <option key={org.id} value={org.id}>
                {org.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-slate-400">
            Título
          </label>
          <select
            name="title"
            value={titleId}
            onChange={(e) => setTitleId(e.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none focus:border-emerald-500"
          >
            <option value="">Todos</option>
            {filteredTitles.map((title) => (
              <option key={title.id} value={title.id}>
                {title.code} - {title.mine_name || title.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-slate-400">
            Estado
          </label>
          <select
            name="status"
            defaultValue={selectedStatus}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none focus:border-emerald-500"
          >
            <option value="">Todos</option>
            <option value="pendiente">Pendiente</option>
            <option value="en_proceso">En proceso</option>
            <option value="cumplida">Cumplida</option>
            <option value="vencida">Vencida</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-slate-400">
            Buscar
          </label>
          <input
            name="q"
            defaultValue={searchText}
            type="text"
            placeholder="Código o nombre"
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none placeholder:text-slate-500 focus:border-emerald-500"
          />
        </div>

        <button
          type="submit"
          className="self-end rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
        >
          Aplicar filtros
        </button>

        <Link
          href="/admin"
          className="self-end rounded-xl border border-slate-700 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:border-slate-500"
        >
          Limpiar
        </Link>
      </form>
    </div>
  );
}