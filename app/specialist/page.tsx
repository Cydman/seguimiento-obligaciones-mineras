import { redirect } from "next/navigation";
import Link from "next/link";
import { ObligationsTable } from "@/components/obligations-table";
import { PageShell } from "@/components/page-shell";
import { SpecialistObligationFilters } from "@/components/specialist-obligation-filters";
import { StatCard } from "@/components/stat-card";
import { getCurrentProfile } from "@/modules/auth/get-current-profile";
import { getSpecialistObligations } from "@/modules/obligations/get-specialist-obligations";

interface SpecialistPageProps {
  searchParams: Promise<{
    status?: string;
    authority?: string;
    q?: string;
    view?: string;
  }>;
}

function formatSpecialty(value: string | null) {
  switch (value) {
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
      return "No definida";
  }
}

export default async function SpecialistPage({
  searchParams,
}: SpecialistPageProps) {
  const params = await searchParams;
  const { user, profile } = await getCurrentProfile();

  if (!user) redirect("/login");
  if (!profile || !profile.is_active || profile.role !== "specialist") {
    redirect("/client");
  }

  const currentView =
    params.view === "general" ? "general" : "obligations";

  const obligations = await getSpecialistObligations(profile, {
    status: params.status || undefined,
    authority: params.authority || undefined,
    q: params.q || undefined,
  });

  const upcoming = obligations.filter(
    (item) => item.status === "pendiente" || item.status === "en_proceso"
  ).length;
  const overdue = obligations.filter((item) => item.status === "vencida").length;
  const completed = obligations.filter((item) => item.status === "cumplida").length;

  return (
    <PageShell
      title="Portal especialista"
      description={`Gestiona las obligaciones de tu especialidad: ${formatSpecialty(
        profile.specialty
      )}.`}
    >
      <div className="space-y-5">
        <div className="grid gap-3 md:grid-cols-3">
          <StatCard title="Próximas" value={upcoming} accentClass="text-amber-400" />
          <StatCard title="Vencidas" value={overdue} accentClass="text-red-400" />
          <StatCard title="Cumplidas" value={completed} accentClass="text-emerald-400" />
        </div>

        {currentView === "general" ? (
          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <div className="grid gap-5 xl:grid-cols-[1.3fr_0.9fr]">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">
                  Resumen operativo
                </p>
                <h2 className="mt-2 text-2xl font-bold">
                  Panel del especialista
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                  Desde aquí puedes consultar las obligaciones asignadas por temática,
                  revisar su estado, aplicar filtros rápidos y registrar actuaciones
                  en las obligaciones que gestionas.
                </p>

                <div className="mt-5">
                  <Link
                    href="/specialist?view=obligations"
                    className="inline-flex items-center rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
                  >
                    Ir a obligaciones
                  </Link>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-5">
                <p className="text-xs uppercase tracking-[0.18em] text-sky-300">
                  Especialidad
                </p>
                <p className="mt-2 text-2xl font-semibold text-white">
                  {formatSpecialty(profile.specialty)}
                </p>
                <p className="mt-3 text-sm text-slate-400">
                  Las obligaciones visibles se filtran por tu especialidad
                  o por asignación directa.
                </p>
              </div>
            </div>
          </section>
        ) : (
          <>
            <SpecialistObligationFilters
              selectedStatus={params.status ?? ""}
              selectedAuthority={params.authority ?? ""}
              searchText={params.q ?? ""}
            />

            <section className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
              <div className="mb-4 flex flex-col gap-1 lg:flex-row lg:items-center lg:justify-between">
                <h2 className="text-xl font-semibold">
                  Obligaciones asignadas por temática
                </h2>
                <p className="text-sm text-slate-400">
                  {obligations.length} resultado(s)
                </p>
              </div>

              <ObligationsTable obligations={obligations} basePath="/specialist" />
            </section>
          </>
        )}
      </div>
    </PageShell>
  );
}