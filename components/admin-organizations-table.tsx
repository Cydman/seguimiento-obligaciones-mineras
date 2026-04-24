import { updateOrganizationAction } from "@/app/admin/organizations/actions";

interface OrganizationRow {
  id: string;
  name: string;
  document_number: string;
  subscription_plan: string;
  is_active: boolean;
}

interface AdminOrganizationsTableProps {
  organizations: OrganizationRow[];
}

function formatPlan(plan: string) {
  switch (plan) {
    case "basico":
      return "Básico";
    case "profesional":
      return "Profesional";
    case "empresarial":
      return "Empresarial";
    default:
      return plan;
  }
}

export function AdminOrganizationsTable({
  organizations,
}: AdminOrganizationsTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
      <div className="grid grid-cols-[1.7fr_1.2fr_1fr_1fr_auto] gap-3 border-b border-slate-800 bg-slate-800/70 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-300">
        <div>Nombre</div>
        <div>Documento</div>
        <div>Plan</div>
        <div>Estado</div>
        <div>Acción</div>
      </div>

      {organizations.length === 0 ? (
        <div className="px-4 py-8 text-center text-sm text-slate-400">
          No hay organizaciones visibles con los filtros actuales.
        </div>
      ) : (
        organizations.map((org) => (
          <details key={org.id} className="border-t border-slate-800">
            <summary className="grid cursor-pointer list-none grid-cols-[1.7fr_1.2fr_1fr_1fr_auto] gap-3 px-4 py-3 text-sm text-slate-200">
              <div className="truncate">{org.name}</div>
              <div>{org.document_number}</div>
              <div>{formatPlan(org.subscription_plan)}</div>
              <div>{org.is_active ? "Activa" : "Inactiva"}</div>
              <div>
                <span className="rounded-xl border border-slate-700 px-3 py-1.5 text-xs font-medium text-white">
                  Editar
                </span>
              </div>
            </summary>

            <div className="border-t border-slate-800 bg-slate-950/40 px-4 py-4">
              <form action={updateOrganizationAction} className="space-y-4">
                <input type="hidden" name="organization_id" value={org.id} />

                <div className="grid gap-4 lg:grid-cols-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Nombre
                    </label>
                    <input
                      name="name"
                      defaultValue={org.name}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Documento
                    </label>
                    <input
                      name="document_number"
                      defaultValue={org.document_number}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Plan
                    </label>
                    <select
                      name="subscription_plan"
                      defaultValue={org.subscription_plan}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
                    >
                      <option value="basico">Básico</option>
                      <option value="profesional">Profesional</option>
                      <option value="empresarial">Empresarial</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Estado
                    </label>
                    <select
                      name="is_active"
                      defaultValue={org.is_active ? "true" : "false"}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
                    >
                      <option value="true">Activa</option>
                      <option value="false">Inactiva</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-slate-950"
                  >
                    Guardar cambios
                  </button>
                </div>
              </form>
            </div>
          </details>
        ))
      )}
    </div>
  );
}