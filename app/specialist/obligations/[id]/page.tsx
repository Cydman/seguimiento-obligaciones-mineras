import Link from "next/link";
import { redirect } from "next/navigation";
import { ObligationActivityPanel } from "@/components/obligation-activity-panel";
import { ObligationBaseDocumentsReadonly } from "@/components/obligation-base-documents-readonly";
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
  const { obligation, logs, documents } = await getObligationDetail(profile, id);

  if (!obligation) {
    redirect("/specialist");
  }

  return (
    <PageShell
      title="Detalle de obligación"
      description="Gestiona la obligación priorizando las actuaciones recientes y conservando la edición y los documentos en la parte inferior."
    >
      {query.updated === "1" ? (
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-200">
          Obligación actualizada correctamente.
        </div>
      ) : null}

      {query.activity_saved === "1" ? (
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-200">
          Actuación guardada correctamente.
        </div>
      ) : null}

      <div className="flex justify-end">
        <Link
          href="/specialist?view=obligations"
          className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-medium text-white transition hover:border-slate-500"
        >
          Volver
        </Link>
      </div>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">Historial de actuaciones</h2>
        <ObligationActivityPanel
          obligationId={obligation.id}
          logs={logs}
          role="specialist"
          returnPath={`/specialist/obligations/${obligation.id}`}
          pageSize={10}
        />
      </section>

      <ObligationDetailCard obligation={obligation} />

      <details className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
        <summary className="cursor-pointer list-none border-b border-slate-800 bg-slate-800/70 px-5 py-4 text-lg font-semibold text-white">
          Gestión de la obligación
        </summary>

        <div className="space-y-4 px-4 py-4">
          <details className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/30">
            <summary className="cursor-pointer list-none border-b border-slate-800 px-4 py-3 text-sm font-semibold text-white">
              Actualizar obligación
            </summary>
            <div className="px-4 py-4">
              <SpecialistEditObligationForm obligation={obligation} />
            </div>
          </details>

          <details className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/30">
            <summary className="cursor-pointer list-none border-b border-slate-800 px-4 py-3 text-sm font-semibold text-white">
              Documentos base
            </summary>
            <div className="px-4 py-4">
              <ObligationBaseDocumentsReadonly documents={documents} />
            </div>
          </details>
        </div>
      </details>
    </PageShell>
  );
}