import { redirect } from "next/navigation";
import { AdminEditObligationForm } from "@/components/admin-edit-obligation-form";
import { ObligationActivityPanel } from "@/components/obligation-activity-panel";
import { ObligationBaseDocumentsList } from "@/components/obligation-base-documents-list";
import { ObligationDetailCard } from "@/components/obligation-detail-card";
import { PageShell } from "@/components/page-shell";
import { UploadObligationDocumentForm } from "@/components/upload-obligation-document-form";
import { getCurrentProfile } from "@/modules/auth/get-current-profile";
import { getObligationAdminDetail } from "@/modules/obligations/get-obligation-admin-detail";

export default async function AdminObligationDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    updated?: string;
    uploaded?: string;
    document_deleted?: string;
    activity_saved?: string;
    activity_updated?: string;
    activity_deleted?: string;
    attachment_removed?: string;
  }>;
}) {
  const query = await searchParams;
  const { user, profile } = await getCurrentProfile();

  if (!user) redirect("/login");
  if (!profile || profile.role !== "admin" || !profile.is_active) {
    redirect("/client");
  }

  const { id } = await params;
  const { obligation, logs, assignableProfiles, documents } =
    await getObligationAdminDetail(id);

  if (!obligation) {
    redirect("/admin");
  }

  return (
    <PageShell
      title="Detalle de obligación"
      description="Consulta, edita y gestiona el historial manual de actuaciones y los documentos base de la obligación."
    >
      <div className="space-y-4">
        {query.updated === "1" ? (
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-200">
            Obligación actualizada correctamente.
          </div>
        ) : null}

        {query.uploaded === "1" ? (
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-200">
            Documento base cargado correctamente.
          </div>
        ) : null}

        {query.document_deleted === "1" ? (
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-200">
            Documento base eliminado correctamente.
          </div>
        ) : null}

        {query.activity_saved === "1" ? (
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-200">
            Actuación guardada correctamente.
          </div>
        ) : null}

        {query.activity_updated === "1" ? (
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-200">
            Actuación actualizada correctamente.
          </div>
        ) : null}

        {query.activity_deleted === "1" ? (
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-200">
            Actuación eliminada correctamente.
          </div>
        ) : null}

        {query.attachment_removed === "1" ? (
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-200">
            PDF eliminado correctamente.
          </div>
        ) : null}
      </div>

      <div className="mt-4 space-y-6">
        <ObligationDetailCard obligation={obligation} backHref="/admin" />

        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
          <details>
            <summary className="cursor-pointer list-none border-b border-slate-800 bg-slate-800/70 px-5 py-4 text-lg font-semibold text-white">
              Editar obligación
            </summary>
            <div className="px-5 py-5">
              <AdminEditObligationForm
                obligation={obligation}
                assignableProfiles={assignableProfiles}
              />
            </div>
          </details>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
          <UploadObligationDocumentForm obligationId={obligation.id} />

          <ObligationBaseDocumentsList
            documents={documents}
            returnPath={`/admin/obligations/${obligation.id}`}
          />
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Historial de actuaciones</h2>
          <ObligationActivityPanel
            obligationId={obligation.id}
            logs={logs}
            role="admin"
            returnPath={`/admin/obligations/${obligation.id}`}
          />
        </div>
      </div>
    </PageShell>
  );
}