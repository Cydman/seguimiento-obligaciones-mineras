import Link from "next/link";
import { redirect } from "next/navigation";
import { PageShell } from "@/components/page-shell";
import { StatusBadge } from "@/components/status-badge";
import { formatDateDisplay } from "@/lib/format-date";
import { getCurrentProfile } from "@/modules/auth/get-current-profile";
import { globalSearch } from "@/modules/search/global-search";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const { user, profile } = await getCurrentProfile();

  if (!user) redirect("/login");
  if (!profile || !profile.is_active) {
    redirect("/login?disabled=1");
  }

  const query = params.q?.trim() ?? "";
  const results = await globalSearch(profile, query);

  return (
    <PageShell
      title="Búsqueda global"
      description="Consulta rápidamente obligaciones, títulos, organizaciones y usuarios según tu rol."
    >
      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
        <form method="GET" action="/search" className="flex flex-col gap-3 md:flex-row">
          <input
            name="q"
            defaultValue={query}
            placeholder="Buscar por código, nombre, correo, documento..."
            className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-500"
          />
          <button
            type="submit"
            className="rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-emerald-400"
          >
            Buscar
          </button>
        </form>
      </section>

      {query.length < 2 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 text-slate-300">
          Escribe al menos 2 caracteres para buscar.
        </div>
      ) : (
        <div className="space-y-5">
          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <h2 className="text-xl font-semibold">Obligaciones</h2>
            <div className="mt-4 space-y-3">
              {results.obligations.length === 0 ? (
                <p className="text-sm text-slate-400">Sin resultados en obligaciones.</p>
              ) : (
                results.obligations.map((item) => {
                  const href =
                    profile.role === "admin"
                      ? `/admin/obligations/${item.id}`
                      : profile.role === "specialist"
                      ? `/specialist/obligations/${item.id}`
                      : `/client/obligations/${item.id}`;

                  return (
                    <Link
                      key={item.id}
                      href={href}
                      className="block rounded-2xl border border-slate-800 bg-slate-950/40 p-4 transition hover:border-slate-600"
                    >
                      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                          <p className="text-sm font-semibold text-emerald-300">{item.code}</p>
                          <p className="mt-1 text-base text-white">{item.name}</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <span className="rounded-xl border border-slate-700 px-3 py-1.5 text-xs text-slate-200">
                            Vence: {formatDateDisplay(item.dueDate)}
                          </span>
                          <StatusBadge status={item.status} />
                        </div>
                      </div>
                    </Link>
                  );
                })
              )}
            </div>
          </section>

          {results.titles.length > 0 ? (
            <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
              <h2 className="text-xl font-semibold">Títulos</h2>
              <div className="mt-4 space-y-3">
                {results.titles.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4"
                  >
                    <p className="text-sm font-semibold text-emerald-300">{item.code}</p>
                    <p className="mt-1 text-base text-white">{item.mine_name || item.name}</p>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {results.organizations.length > 0 ? (
            <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
              <h2 className="text-xl font-semibold">Organizaciones</h2>
              <div className="mt-4 space-y-3">
                {results.organizations.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4"
                  >
                    <p className="text-base font-semibold text-white">{item.name}</p>
                    <p className="mt-1 text-sm text-slate-400">
                      Documento: {item.document_number}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {results.users.length > 0 ? (
            <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
              <h2 className="text-xl font-semibold">Usuarios</h2>
              <div className="mt-4 space-y-3">
                {results.users.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4"
                  >
                    <p className="text-base font-semibold text-white">
                      {item.full_name || "Sin nombre"}
                    </p>
                    <p className="mt-1 text-sm text-slate-400">{item.email}</p>
                  </div>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      )}
    </PageShell>
  );
}