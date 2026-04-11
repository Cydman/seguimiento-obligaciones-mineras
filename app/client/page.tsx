import { ObligationsTable } from "@/components/obligations-table";
import { PageShell } from "@/components/page-shell";
import { StatCard } from "@/components/stat-card";
import { getObligations } from "@/modules/obligations/get-obligations";

export default async function ClientPage() {
  const obligations = await getObligations();

  const upcoming = obligations.filter(
    (item) => item.status === "pendiente" || item.status === "en_proceso"
  ).length;

  const overdue = obligations.filter(
    (item) => item.status === "vencida"
  ).length;

  const completed = obligations.filter(
    (item) => item.status === "cumplida"
  ).length;

  return (
    <PageShell
      title="Portal del cliente"
      description="Aquí el titular o empresa suscriptora consultará sus obligaciones, fechas, soportes y alertas."
    >
      <div className="grid gap-6 md:grid-cols-3">
        <StatCard
          title="Obligaciones próximas"
          value={upcoming}
          accentClass="text-amber-400"
        />
        <StatCard
          title="Obligaciones vencidas"
          value={overdue}
          accentClass="text-red-400"
        />
        <StatCard
          title="Obligaciones cumplidas"
          value={completed}
          accentClass="text-emerald-400"
        />
      </div>

      <div className="mt-8">
        <h2 className="mb-4 text-2xl font-semibold">
          Resumen de obligaciones
        </h2>
        <ObligationsTable obligations={obligations} />
      </div>
    </PageShell>
  );
}