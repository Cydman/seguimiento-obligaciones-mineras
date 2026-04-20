import { redirect } from "next/navigation";
import { AdminCreateObligationPanel } from "@/components/admin-create-obligation-panel";
import { AdminFilters } from "@/components/admin-filters";
import { AdminObligationsTable } from "@/components/admin-obligations-table";
import { AdminSubmenu } from "@/components/admin-submenu";
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
      description="Aquí administraremos clientes, obligaciones, usuarios, documentos y suscripciones."
    >
      <div className="mb-8">
        <AdminSubmenu />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
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

      <div className="mt-8">
        <AdminFilters
          organizations={allOrganizations}
          titles={allTitles}
          selectedOrganization={selectedOrganization}
          selectedTitle={selectedTitle}
          selectedStatus={selectedStatus}
          searchText={searchText}
        />
      </div>

      <div className="mt-8">
        <AdminCreateObligationPanel
          organizations={allOrganizations}
          titles={allTitles}
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-2xl font-semibold">Organizaciones</h2>
          <div className="mt-4 space-y-3">
            {visibleOrganizations.map((org) => (
              <div
                key={org.id}
                className="rounded-xl border border-slate-800 bg-slate-950 p-4"
              >
                <p className="font-semibold">{org.name}</p>
                <p className="text-sm text-slate-400">
                  Documento: {org.document_number}
                </p>
                <p className="text-sm text-slate-400">
                  Plan: {org.subscription_plan}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-2xl font-semibold">Títulos mineros</h2>
          <div className="mt-4 space-y-3">
            {visibleTitles.map((title) => (
              <div
                key={title.id}
                className="rounded-xl border border-slate-800 bg-slate-950 p-4"
              >
                <p className="font-semibold">
                  {title.code} - {title.name}
                </p>
                <p className="text-sm text-slate-400">
                  Mineral: {title.mineral}
                </p>
                <p className="text-sm text-slate-400">
                  Ubicación: {title.municipality}, {title.department}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="mb-4 text-2xl font-semibold">
          Obligaciones registradas
        </h2>
        <AdminObligationsTable obligations={obligations} />
      </div>
    </PageShell>
  );
}