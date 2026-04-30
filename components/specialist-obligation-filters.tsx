export function SpecialistObligationFilters({
  selectedStatus = "",
  selectedAuthority = "",
  searchText = "",
}: {
  selectedStatus?: string;
  selectedAuthority?: string;
  searchText?: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800/80 bg-slate-900 px-4 py-4">
      <form
        method="GET"
        className="grid gap-3 xl:grid-cols-[1fr_1fr_1.4fr_auto_auto]"
      >
        <input type="hidden" name="view" value="obligations" />

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
            Autoridad
          </label>
          <select
            name="authority"
            defaultValue={selectedAuthority}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none focus:border-emerald-500"
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
          <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-slate-400">
            Buscar
          </label>
          <input
            name="q"
            defaultValue={searchText}
            placeholder="Código o nombre"
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none placeholder:text-slate-500 focus:border-emerald-500"
          />
        </div>

        <button
          type="submit"
          className="self-end rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
        >
          Filtrar
        </button>

        <a
          href="/specialist?view=obligations"
          className="self-end rounded-xl border border-slate-700 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:border-slate-500"
        >
          Limpiar
        </a>
      </form>
    </div>
  );
}