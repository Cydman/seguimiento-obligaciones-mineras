import { updateTitleAction } from "@/app/admin/titles/actions";
import { formatDateDisplay } from "@/lib/format-date";
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
  return (
    organizations.find((org) => org.id === organizationId)?.name ??
    "Sin organización"
  );
}

function normalizeDateInput(value?: string | null) {
  if (!value) return "";
  return String(value).slice(0, 10);
}

export function AdminTitlesTable({
  titles,
  organizations,
}: AdminTitlesTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
      <div className="grid grid-cols-[1fr_1.4fr_1.3fr_1fr_1fr_1fr_auto] gap-3 border-b border-slate-800 bg-slate-800/70 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-300">
        <div>Placa</div>
        <div>Organización</div>
        <div>Mina / referencia</div>
        <div>Municipio</div>
        <div>Fecha RMN</div>
        <div>Estado</div>
        <div>Acción</div>
      </div>

      {titles.length === 0 ? (
        <div className="px-4 py-8 text-center text-sm text-slate-400">
          No hay títulos visibles con los filtros actuales.
        </div>
      ) : (
        titles.map((title) => (
          <details key={title.id} className="border-t border-slate-800">
            <summary className="grid cursor-pointer list-none grid-cols-[1fr_1.4fr_1.3fr_1fr_1fr_1fr_auto] gap-3 px-4 py-3 text-sm text-slate-200">
              <div>{title.code}</div>
              <div className="truncate">
                {getOrganizationName(title.organization_id, organizations)}
              </div>
              <div className="truncate">{title.mine_name || title.name}</div>
              <div>{title.municipality}</div>
              <div>{formatDateDisplay(title.rmn_registration_date)}</div>
              <div>{title.is_active ? "Activo" : "Inactivo"}</div>
              <div>
                <span className="rounded-xl border border-slate-700 px-3 py-1.5 text-xs font-medium text-white">
                  Editar
                </span>
              </div>
            </summary>

            <div className="border-t border-slate-800 bg-slate-950/40 px-4 py-4">
              <form action={updateTitleAction} className="space-y-8">
                <input type="hidden" name="title_id" value={title.id} />

                <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Organización
                    </label>
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

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Placa / título
                    </label>
                    <input
                      name="code"
                      defaultValue={title.code}
                      className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 uppercase text-white"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Nombre de referencia
                    </label>
                    <input
                      name="name"
                      defaultValue={title.name}
                      className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Mineral
                    </label>
                    <input
                      name="mineral"
                      defaultValue={title.mineral}
                      className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Municipio
                    </label>
                    <input
                      name="municipality"
                      defaultValue={title.municipality}
                      className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Departamento
                    </label>
                    <input
                      name="department"
                      defaultValue={title.department}
                      className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
                    />
                  </div>
                </section>

                <section>
                  <h3 className="text-lg font-semibold">Titular</h3>
                  <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    <input
                      name="holder_name"
                      defaultValue={title.holder_name ?? ""}
                      placeholder="Nombre del titular"
                      className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
                    />
                    <input
                      name="holder_identification"
                      defaultValue={title.holder_identification ?? ""}
                      placeholder="Identificación"
                      className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
                    />
                    <input
                      name="holder_phone"
                      defaultValue={title.holder_phone ?? ""}
                      placeholder="Teléfono"
                      className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
                    />
                    <input
                      name="holder_email"
                      defaultValue={title.holder_email ?? ""}
                      placeholder="Email"
                      className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white md:col-span-2"
                    />
                    <textarea
                      name="holder_address"
                      defaultValue={title.holder_address ?? ""}
                      placeholder="Dirección"
                      className="min-h-24 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white md:col-span-2 xl:col-span-3"
                    />
                  </div>
                </section>

                <section>
                  <h3 className="text-lg font-semibold">Subcontratista</h3>
                  <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    <input
                      name="subcontractor_name"
                      defaultValue={title.subcontractor_name ?? ""}
                      placeholder="Nombre del subcontratista"
                      className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
                    />
                    <input
                      name="subcontractor_identification"
                      defaultValue={title.subcontractor_identification ?? ""}
                      placeholder="Identificación"
                      className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
                    />
                    <input
                      name="subcontractor_phone"
                      defaultValue={title.subcontractor_phone ?? ""}
                      placeholder="Teléfono"
                      className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
                    />
                    <input
                      name="subcontractor_email"
                      defaultValue={title.subcontractor_email ?? ""}
                      placeholder="Email"
                      className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white md:col-span-2"
                    />
                    <textarea
                      name="subcontractor_address"
                      defaultValue={title.subcontractor_address ?? ""}
                      placeholder="Dirección"
                      className="min-h-24 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white md:col-span-2 xl:col-span-3"
                    />
                  </div>
                </section>

                <section>
                  <h3 className="text-lg font-semibold">Información del título</h3>
                  <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    <input
                      name="mine_name"
                      defaultValue={title.mine_name ?? ""}
                      placeholder="Nombre de la mina"
                      className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
                    />
                    <input
                      name="village"
                      defaultValue={title.village ?? ""}
                      placeholder="Vereda"
                      className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
                    />
                    <input
                      name="title_modality"
                      defaultValue={title.title_modality ?? ""}
                      placeholder="Modalidad del título"
                      className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
                    />
                    <input
                      name="granted_area"
                      defaultValue={title.granted_area ?? ""}
                      placeholder="Área otorgada"
                      className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
                    />
                    <input
                      name="contract_stage"
                      defaultValue={title.contract_stage ?? ""}
                      placeholder="Etapa contractual"
                      className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
                    />
                    <input
                      name="annuality"
                      defaultValue={title.annuality ?? ""}
                      placeholder="Anualidad"
                      className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
                    />

                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-300">
                        Fecha inscripción RMN
                      </label>
                      <input
                        name="rmn_registration_date"
                        type="date"
                        lang="es-CO"
                        defaultValue={normalizeDateInput(title.rmn_registration_date)}
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
                      />
                      <p className="mt-2 text-xs text-slate-400">
                        Vista actual: {formatDateDisplay(title.rmn_registration_date)}
                      </p>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-300">
                        Fecha inscripción RMN subcontrato
                      </label>
                      <input
                        name="subcontract_rmn_registration_date"
                        type="date"
                        lang="es-CO"
                        defaultValue={normalizeDateInput(
                          title.subcontract_rmn_registration_date
                        )}
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
                      />
                      <p className="mt-2 text-xs text-slate-400">
                        Vista actual: {formatDateDisplay(title.subcontract_rmn_registration_date)}
                      </p>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-300">
                        Estado
                      </label>
                      <select
                        name="is_active"
                        defaultValue={title.is_active ? "true" : "false"}
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
                      >
                        <option value="true">Activo</option>
                        <option value="false">Inactivo</option>
                      </select>
                    </div>
                  </div>
                </section>

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