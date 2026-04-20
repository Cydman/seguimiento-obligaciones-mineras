export function ClientObligationFilters({
  selectedTitle,
  selectedStatus = "",
  selectedAuthority = "",
  searchText = "",
}: {
  selectedTitle?: string;
  selectedStatus?: string;
  selectedAuthority?: string;
  searchText?: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <form method="GET" className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <input type="hidden" name="title" value={selectedTitle || ""} />
        <input type="hidden" name="view" value="obligations" />

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Estado
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

        <div className="flex items-end gap-3">
          <button
            type="submit"
            className="rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-slate-950"
          >
            Filtrar
          </button>

          <a
            href={selectedTitle ? `/client?title=${selectedTitle}&view=obligations` : "/client?view=obligations"}
            className="rounded-xl border border-slate-700 px-5 py-3 font-semibold text-white"
          >
            Limpiar
          </a>
        </div>
      </form>
    </div>
  );
}