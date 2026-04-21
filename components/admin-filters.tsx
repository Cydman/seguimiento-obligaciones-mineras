import Link from "next/link";

interface OrganizationOption {
  id: string;
  name: string;
}

interface TitleOption {
  id: string;
  code: string;
  name: string;
  organization_id: string;
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
  const filteredTitles = selectedOrganization
    ? titles.filter((title) => title.organization_id === selectedOrganization)
    : titles;

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <h2 className="text-2xl font-semibold">Filtros de consulta</h2>

      <form method="GET" className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Cliente / organización
          </label>
          <select
            name="organization"
            defaultValue={selectedOrganization}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-500"
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
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Título minero
          </label>
          <select
            name="title"
            defaultValue={selectedTitle}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-500"
          >
            <option value="">Todos</option>
            {filteredTitles.map((title) => (
              <option key={title.id} value={title.id}>
                {title.code} - {title.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Estado
          </label>
          <select
            name="status"
            defaultValue={selectedStatus}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-500"
          >
            <option value="">Todos</option>
            <option value="pendiente">Pendiente</option>
            <option value="en_proceso">En proceso</option>
            <option value="cumplida">Cumplida</option>
            <option value="vencida">Vencida</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Buscar
          </label>
          <input
            name="q"
            defaultValue={searchText}
            type="text"
            placeholder="Código o nombre"
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-500"
          />
        </div>

        <div className="md:col-span-2 lg:col-span-4 flex gap-3">
          <button
            type="submit"
            className="rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-emerald-400"
          >
            Aplicar filtros
          </button>

          <Link
            href="/admin"
            className="rounded-xl border border-slate-700 px-5 py-3 font-semibold text-white transition hover:border-slate-500"
          >
            Limpiar
          </Link>
        </div>
      </form>
    </div>
  );
}