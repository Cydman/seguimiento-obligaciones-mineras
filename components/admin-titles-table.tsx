import { updateTitleAction } from "@/app/admin/titles/actions";
import type { MiningTitleRecord } from "@/types/titles";

interface OrganizationOption {
  id: string;
  name: string;
}

interface AdminTitlesTableProps {
  titles: MiningTitleRecord[];
  organizations: OrganizationOption[];
}

function getOrganizationName(
  organizationId: string,
  organizations: OrganizationOption[]
) {
  return organizations.find((org) => org.id === organizationId)?.name ?? "Sin organización";
}

export function AdminTitlesTable({
  titles,
  organizations,
}: AdminTitlesTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
      <div className="grid grid-cols-[1fr_1.5fr_1.4fr_1fr_1fr_auto] gap-4 border-b border-slate-800 bg-slate-800/70 px-5 py-4 text-sm font-semibold text-slate-300">
        <div>Placa</div>
        <div>Organización</div>
        <div>Mina / referencia</div>
        <div>Municipio</div>
        <div>Estado</div>
        <div>Acción</div>
      </div>

      {titles.map((title) => (
        <details key={title.id} className="border-t border-slate-800">
          <summary className="grid cursor-pointer grid-cols-[1fr_1.5fr_1.4fr_1fr_1fr_auto] gap-4 px-5 py-4 text-sm text-slate-200 list-none">
            <div>{title.code}</div>
            <div className="truncate">
              {getOrganizationName(title.organization_id, organizations)}
            </div>
            <div className="truncate">{title.mine_name || title.name}</div>
            <div>{title.municipality}</div>
            <div>{title.is_active ? "Activo" : "Inactivo"}</div>
            <div>
              <span className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-medium text-white">
                Editar
              </span>
            </div>
          </summary>

          <div className="border-t border-slate-800 bg-slate-950/40 px-5 py-5">
            <form action={updateTitleAction} className="space-y-8">
              <input type="hidden" name="title_id" value={title.id} />

              <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">Organización</label>
                  <select
                    name="organization_id"
                    defaultValue={title.organization_id}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
                  >
                    {organizations.map((org) => (
                      <option key={org.id} value={org.id}>
                        {org.name}
                      </option>
                    ))}
                  </select>
                </div>

                <input
                  name="code"
                  defaultValue={title.code}
                  className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
                />
                <input
                  name="name"
                  defaultValue={title.name}
                  className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
                />
                <input
                  name="mineral"
                  defaultValue={title.mineral}
                  className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
                />
                <input
                  name="municipality"
                  defaultValue={title.municipality}
                  className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
                />
                <input
                  name="department"
                  defaultValue={title.department}
                  className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
                />
              </section>

              <section>
                <h3 className="text-xl font-semibold">Titular</h3>
                <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <input name="holder_name" defaultValue={title.holder_name ?? ""} placeholder="Nombre del titular" className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" />
                  <input name="holder_identification" defaultValue={title.holder_identification ?? ""} placeholder="Identificación" className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" />
                  <input name="holder_phone" defaultValue={title.holder_phone ?? ""} placeholder="Teléfono" className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" />
                  <input name="holder_email" defaultValue={title.holder_email ?? ""} placeholder="Email" className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white md:col-span-2" />
                  <textarea name="holder_address" defaultValue={title.holder_address ?? ""} placeholder="Dirección" className="min-h-24 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white md:col-span-2 lg:col-span-3" />
                </div>
              </section>

              <section>
                <h3 className="text-xl font-semibold">Subcontratista</h3>
                <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <input name="subcontractor_name" defaultValue={title.subcontractor_name ?? ""} placeholder="Nombre del subcontratista" className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" />
                  <input name="subcontractor_identification" defaultValue={title.subcontractor_identification ?? ""} placeholder="Identificación" className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" />
                  <input name="subcontractor_phone" defaultValue={title.subcontractor_phone ?? ""} placeholder="Teléfono" className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" />
                  <input name="subcontractor_email" defaultValue={title.subcontractor_email ?? ""} placeholder="Email" className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white md:col-span-2" />
                  <textarea name="subcontractor_address" defaultValue={title.subcontractor_address ?? ""} placeholder="Dirección" className="min-h-24 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white md:col-span-2 lg:col-span-3" />
                </div>
              </section>

              <section>
                <h3 className="text-xl font-semibold">Información del título</h3>
                <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <input name="mine_name" defaultValue={title.mine_name ?? ""} placeholder="Nombre de la mina" className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" />
                  <input name="village" defaultValue={title.village ?? ""} placeholder="Vereda" className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" />
                  <input name="title_modality" defaultValue={title.title_modality ?? ""} placeholder="Modalidad del título" className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" />
                  <input name="granted_area" defaultValue={title.granted_area ?? ""} placeholder="Área otorgada" className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" />
                  <input name="contract_stage" defaultValue={title.contract_stage ?? ""} placeholder="Etapa contractual" className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" />
                  <input name="annuality" defaultValue={title.annuality ?? ""} placeholder="Anualidad" className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" />
                  <input name="rmn_registration_date" type="date" defaultValue={title.rmn_registration_date ?? ""} className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" />
                  <input name="subcontract_rmn_registration_date" type="date" defaultValue={title.subcontract_rmn_registration_date ?? ""} className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" />
                  <select name="is_active" defaultValue={title.is_active ? "true" : "false"} className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white">
                    <option value="true">Activo</option>
                    <option value="false">Inactivo</option>
                  </select>
                </div>
              </section>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-slate-950"
                >
                  Guardar cambios
                </button>
              </div>
            </form>
          </div>
        </details>
      ))}
    </div>
  );
}