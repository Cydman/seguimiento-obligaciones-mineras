import type { MiningTitleRecord } from "@/types/titles";

export function ClientTitleFilters({
  titles,
  selectedTitle,
  selectedStatus = "",
  selectedAuthority = "",
  searchText = "",
}: {
  titles: MiningTitleRecord[];
  selectedTitle?: string;
  selectedStatus?: string;
  selectedAuthority?: string;
  searchText?: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <h2 className="text-2xl font-semibold">Consulta del título</h2>

      <form method="GET" className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Placa del título
          </label>
          <select
            name="title"
            defaultValue={selectedTitle}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
          >
            {titles.map((title) => (
              <option key={title.id} value={title.id}>
                {title.code} - {title.mine_name || title.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Estado de obligación
          </label>
          <select
            name="status"
            defaultValue={selectedStatus}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
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
            Autoridad
          </label>
          <select
            name="authority"
            defaultValue={selectedAuthority}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
          >
            <option value="">Todas</option>
            <option value="ANM">ANM</option>
            <option value="ANLA">ANLA</option>
            <option value="CAR">CAR</option>
            <option value="MUNICIPIO">MUNICIPIO</option>
            <option value="OTRA">OTRA</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Buscar obligación
          </label>
          <input
            name="q"
            defaultValue={searchText}
            placeholder="Código o nombre"
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
          />
        </div>

        <div className="lg:col-span-4 flex gap-3">
          <button type="submit" className="rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-slate-950">
            Aplicar filtros
          </button>
          <a href="/client" className="rounded-xl border border-slate-700 px-5 py-3 font-semibold text-white">
            Limpiar
          </a>
        </div>
      </form>
    </div>
  );
}