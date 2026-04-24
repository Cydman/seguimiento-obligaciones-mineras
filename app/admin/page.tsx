import { redirect } from "next/navigation";
import { AdminCreateObligationPanel } from "@/components/admin-create-obligation-panel";
import { AdminFilters } from "@/components/admin-filters";
import { AdminObligationsTable } from "@/components/admin-obligations-table";
import { AdminOrganizationsTable } from "@/components/admin-organizations-table";
import { AdminTitlesTable } from "@/components/admin-titles-table";
import { PageShell } from "@/components/page-shell";
import { StatCard } from "@/components/stat-card";
import { getCurrentProfile } from "@/modules/auth/get-current-profile";
import { getDashboardData } from "@/modules/obligations/get-dashboard-data";

interface AdminPageProps {
  searchParams: Promise<{
    organization?: string;
    title?: string;
    status?: string;
    q?: string;
  }>;
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const params = await searchParams;
  const { user, profile } = await getCurrentProfile();

  if (!user) {
    redirect("/login");
  }

  if (!profile || profile.role !== "admin" || !profile.is_active) {
    redirect("/client");
  }

  const selectedOrganization = params.organization ?? "";
  const selectedTitle = params.title ?? "";
  const selectedStatus = params.status ?? "";
  const searchText = params.q ?? "";

  const {
    allOrganizations,
    allTitles,
    visibleOrganizations,
    visibleTitles,
    obligations,
  } = await getDashboardData(profile, {
    organization: selectedOrganization || undefined,
    title: selectedTitle || undefined,
    status: selectedStatus || undefined,
    q: searchText || undefined,
  });

  const criticalAlerts = obligations.filter(
    (item) => item.status === "vencida" || item.priority === "alta"
  ).length;

  return (
    <PageShell
      title="Panel administrativo"
      description="Administra obligaciones, organizaciones, títulos y usuarios desde una vista centralizada."
    >
      <div className="space-y-5">
        <AdminFilters
          organizations={allOrganizations}
          titles={allTitles}
          selectedOrganization={selectedOrganization}
          selectedTitle={selectedTitle}
          selectedStatus={selectedStatus}
          searchText={searchText}
        />

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Clientes visibles"
            value={visibleOrganizations.length}
            accentClass="text-emerald-400"
          />
          <StatCard
            title="Títulos visibles"
            value={visibleTitles.length}
            accentClass="text-sky-400"
          />
          <StatCard
            title="Obligaciones visibles"
            value={obligations.length}
            accentClass="text-amber-400"
          />
          <StatCard
            title="Alertas críticas"
            value={criticalAlerts}
            accentClass="text-red-400"
          />
        </div>

        <AdminCreateObligationPanel
          organizations={allOrganizations}
          titles={allTitles}
        >
          <AdminObligationsTable obligations={obligations} />
        </AdminCreateObligationPanel>

        <div className="grid gap-5 xl:grid-cols-2">
          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
            <div className="mb-4">
              <h2 className="text-lg font-semibold">Organizaciones</h2>
              <p className="mt-1 text-sm text-slate-400">
                Listado compacto editable de organizaciones visibles.
              </p>
            </div>

            <AdminOrganizationsTable organizations={visibleOrganizations} />
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
            <div className="mb-4">
              <h2 className="text-lg font-semibold">Títulos mineros</h2>
              <p className="mt-1 text-sm text-slate-400">
                Consulta y edición compacta de títulos visibles.
              </p>
            </div>

            <AdminTitlesTable
              titles={visibleTitles}
              organizations={allOrganizations}
            />
          </section>
        </div>
      </div>
    </PageShell>
  );
}