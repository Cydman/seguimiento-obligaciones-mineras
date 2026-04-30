import { redirect } from "next/navigation";
import { ClientObligationFilters } from "@/components/client-obligation-filters";
import { ClientPortalTabs } from "@/components/client-portal-tabs";
import { ClientTitleSelector } from "@/components/client-title-selector";
import { ObligationsTable } from "@/components/obligations-table";
import { PageShell } from "@/components/page-shell";
import { StatCard } from "@/components/stat-card";
import { TitleGeneralInfoCard } from "@/components/title-general-info-card";
import { getCurrentProfile } from "@/modules/auth/get-current-profile";
import { getClientDashboardData } from "@/modules/titles/get-client-dashboard-data";

interface ClientPageProps {
  searchParams: Promise<{
    title?: string;
    status?: string;
    authority?: string;
    q?: string;
    view?: string;
  }>;
}

export default async function ClientPage({ searchParams }: ClientPageProps) {
  const params = await searchParams;
  const { user, profile } = await getCurrentProfile();

  if (!user) redirect("/login");
  if (!profile || !profile.is_active) {
    redirect("/login?disabled=1");
  }

  const selectedTitleParam = params.title ?? "";
  const selectedStatus = params.status ?? "";
  const selectedAuthority = params.authority ?? "";
  const searchText = params.q ?? "";
  const currentView =
    params.view === "obligations" ? "obligations" : "general";

  const { titles, selectedTitle, obligations } = await getClientDashboardData(
    profile,
    {
      title: selectedTitleParam || undefined,
      status: selectedStatus || undefined,
      authority: selectedAuthority || undefined,
      q: searchText || undefined,
    }
  );

  const upcoming = obligations.filter(
    (item) => item.status === "pendiente" || item.status === "en_proceso"
  ).length;
  const overdue = obligations.filter((item) => item.status === "vencida").length;
  const completed = obligations.filter((item) => item.status === "cumplida").length;

  return (
    <PageShell
      title="Portal del cliente"
      description="Consulta la información general del título y las obligaciones asociadas."
    >
      {!profile.organization_id ? (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5 text-amber-200">
          Tu usuario aún no tiene una organización asignada.
        </div>
      ) : null}

      {titles.length > 0 ? (
        <div className="space-y-5">
          <div className="grid gap-4 xl:grid-cols-[1.2fr_auto] xl:items-start">
            <ClientTitleSelector
              titles={titles}
              selectedTitle={selectedTitle?.id}
            />
            <ClientPortalTabs currentView={currentView} />
          </div>

          {currentView === "general" ? (
            selectedTitle ? (
              <TitleGeneralInfoCard title={selectedTitle} />
            ) : (
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 text-slate-300">
                No hay información general disponible para este título.
              </div>
            )
          ) : (
            <>
              <div className="grid gap-3 md:grid-cols-3">
                <StatCard
                  title="Próximas"
                  value={upcoming}
                  accentClass="text-amber-400"
                />
                <StatCard
                  title="Vencidas"
                  value={overdue}
                  accentClass="text-red-400"
                />
                <StatCard
                  title="Cumplidas"
                  value={completed}
                  accentClass="text-emerald-400"
                />
              </div>

              <section className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
                <div className="mb-4 flex flex-col gap-1 lg:flex-row lg:items-center lg:justify-between">
                  <h2 className="text-xl font-semibold">
                    Obligaciones del título
                  </h2>
                  <p className="text-sm text-slate-400">
                    {obligations.length} resultado(s)
                  </p>
                </div>

                <ClientObligationFilters
                  selectedTitle={selectedTitle?.id}
                  selectedStatus={selectedStatus}
                  selectedAuthority={selectedAuthority}
                  searchText={searchText}
                />

                <div className="mt-4">
                  <ObligationsTable obligations={obligations} basePath="/client" />
                </div>
              </section>
            </>
          )}
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 text-slate-300">
          No hay títulos activos asociados a esta organización.
        </div>
      )}
    </PageShell>
  );
}