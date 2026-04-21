import { redirect } from "next/navigation";
import { ObligationActivityPanel } from "@/components/obligation-activity-panel";
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
  const { obligation, logs } = await getObligationDetail(profile, id);

  if (!obligation) {
    redirect("/client");
  }

  return (
    <PageShell
      title="Detalle de obligación"
      description="Consulta la información general y el historial visible de actuaciones."
    >
      <div className="space-y-6">
        <ObligationDetailCard obligation={obligation} backHref="/client" />

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Historial de actuaciones</h2>
          <ObligationActivityPanel
            obligationId={obligation.id}
            logs={logs}
            role="client"
            returnPath={`/client/obligations/${obligation.id}`}
          />
        </div>
      </div>
    </PageShell>
  );
}