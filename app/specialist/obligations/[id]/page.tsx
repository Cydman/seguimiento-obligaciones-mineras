import { redirect } from "next/navigation";
import { ObligationActivityPanel } from "@/components/obligation-activity-panel";
import { ObligationDetailCard } from "@/components/obligation-detail-card";
import { PageShell } from "@/components/page-shell";
import { SpecialistEditObligationForm } from "@/components/specialist-edit-obligation-form";
import { getCurrentProfile } from "@/modules/auth/get-current-profile";
import { getObligationDetail } from "@/modules/obligations/get-obligation-detail";

export default async function SpecialistObligationDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    updated?: string;
    activity_saved?: string;
  }>;
}) {
  const query = await searchParams;
  const { user, profile } = await getCurrentProfile();

  if (!user) redirect("/login");
  if (!profile || !profile.is_active || profile.role !== "specialist") {
    redirect("/client");
  }

  const { id } = await params;
  const { obligation, logs } = await getObligationDetail(profile, id);

  if (!obligation) {
    redirect("/specialist");
  }

  return (
    <PageShell
      title="Detalle de obligación"
      description="Gestiona la obligación según tu especialidad y registra actuaciones."
    >
      {query.updated === "1" ? (
        <div className="mb-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-200">
          Obligación actualizada correctamente.
        </div>
      ) : null}

      {query.activity_saved === "1" ? (
        <div className="mb-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-200">
          Actuación guardada correctamente.
        </div>
      ) : null}

      <div className="space-y-6">
        <ObligationDetailCard obligation={obligation} backHref="/specialist" />

        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
          <details>
            <summary className="cursor-pointer list-none border-b border-slate-800 bg-slate-800/70 px-5 py-4 text-lg font-semibold text-white">
              Actualizar obligación
            </summary>
            <div className="px-5 py-5">
              <SpecialistEditObligationForm obligation={obligation} />
            </div>
          </details>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Historial de actuaciones</h2>
          <ObligationActivityPanel
            obligationId={obligation.id}
            logs={logs}
            role="specialist"
            returnPath={`/specialist/obligations/${obligation.id}`}
          />
        </div>
      </div>
    </PageShell>
  );
}