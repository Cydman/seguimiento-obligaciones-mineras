import Link from "next/link";
import { redirect } from "next/navigation";
import { ObligationActivityPanel } from "@/components/obligation-activity-panel";
import { ObligationBaseDocumentsReadonly } from "@/components/obligation-base-documents-readonly";
import { ObligationDetailCard } from "@/components/obligation-detail-card";
import { PageShell } from "@/components/page-shell";
import { getCurrentProfile } from "@/modules/auth/get-current-profile";
import { getObligationDetail } from "@/modules/obligations/get-obligation-detail";

export default async function ClientObligationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { user, profile } = await getCurrentProfile();

  if (!user) {
    redirect("/login");
  }

  if (!profile || !profile.is_active) {
    redirect("/login?disabled=1");
  }

  const { id } = await params;
  const { obligation, logs, documents } = await getObligationDetail(profile, id);

  if (!obligation) {
    redirect("/client");
  }

  return (
    <PageShell
      title="Detalle de obligación"
      description="Consulta primero las actuaciones recientes y luego la información general y los documentos base."
    >
      <div className="flex justify-end">
        <Link
          href="/client?view=obligations"
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
          role="client"
          returnPath={`/client/obligations/${obligation.id}`}
          pageSize={10}
        />
      </section>

      <ObligationDetailCard obligation={obligation} />

      <details className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
        <summary className="cursor-pointer list-none border-b border-slate-800 bg-slate-800/70 px-5 py-4 text-lg font-semibold text-white">
          Documentos base
        </summary>

        <div className="px-4 py-4">
          <ObligationBaseDocumentsReadonly documents={documents} />
        </div>
      </details>
    </PageShell>
  );
}