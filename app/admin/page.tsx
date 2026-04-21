export const dynamic = "force-dynamic";
export const revalidate = 0;

import { CreateObligationForm } from "@/components/create-obligation-form";
import { ObligationsTable } from "@/components/obligations-table";
import { PageShell } from "@/components/page-shell";
import { StatCard } from "@/components/stat-card";
import { getDashboardData } from "@/modules/obligations/get-dashboard-data";

export default async function AdminPage() {
  const { organizations, titles, obligations } = await getDashboardData();

  const criticalAlerts = obligations.filter(
    (item) => item.status === "vencida" || item.priority === "alta"
  ).length;

  return (
    <PageShell
      title="Panel administrativo"
      description="Aquí administraremos clientes, obligaciones, usuarios, documentos y suscripciones."
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Clientes activos"
          value={organizations.length}
          accentClass="text-emerald-400"
        />
        <StatCard
          title="Títulos registrados"
          value={titles.length}
          accentClass="text-sky-400"
        />
        <StatCard
          title="Obligaciones cargadas"
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
        <CreateObligationForm organizations={organizations} titles={titles} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-2xl font-semibold">Organizaciones</h2>
          <div className="mt-4 space-y-3">
            {organizations.map((org) => (
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
            {titles.map((title) => (
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
        <ObligationsTable obligations={obligations} />
      </div>
    </PageShell>
  );
}