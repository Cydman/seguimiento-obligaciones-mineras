import { createTitleAction } from "@/app/admin/titles/actions";

interface OrganizationOption {
  id: string;
  name: string;
}

interface AdminCreateTitleFormProps {
  organizations: OrganizationOption[];
}

export function AdminCreateTitleForm({
  organizations,
}: AdminCreateTitleFormProps) {
  return (
    <form action={createTitleAction} className="space-y-8">
      <section>
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Datos básicos del título</h3>
          <p className="mt-1 text-sm text-slate-400">
            Registra los datos principales para identificar la placa, el proyecto y su ubicación.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Organización
            </label>
            <select
              name="organization_id"
              required
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
            >
              <option value="">Selecciona una organización</option>
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
              required
              placeholder="Ej. PDBA-00001"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 uppercase text-white"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Nombre del proyecto o referencia
            </label>
            <input
              name="name"
              required
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Mineral(es) a explotar
            </label>
            <input
              name="mineral"
              required
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Municipio
            </label>
            <input
              name="municipality"
              required
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Departamento
            </label>
            <input
              name="department"
              required
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
            />
          </div>
        </div>
      </section>

      <section>
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Titular</h3>
          <p className="mt-1 text-sm text-slate-400">
            Diligencia la información del titular cuando esté disponible.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <input
            name="holder_name"
            placeholder="Nombre del titular"
            className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
          />
          <input
            name="holder_identification"
            placeholder="Identificación"
            className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
          />
          <input
            name="holder_phone"
            placeholder="Teléfono"
            className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
          />
          <input
            name="holder_email"
            placeholder="Email"
            className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white md:col-span-2"
          />
          <textarea
            name="holder_address"
            placeholder="Dirección"
            className="min-h-24 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white md:col-span-2 xl:col-span-3"
          />
        </div>
      </section>

      <section>
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Subcontratista</h3>
          <p className="mt-1 text-sm text-slate-400">
            Diligencia esta sección solo cuando aplique.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <input
            name="subcontractor_name"
            placeholder="Nombre del subcontratista"
            className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
          />
          <input
            name="subcontractor_identification"
            placeholder="Identificación"
            className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
          />
          <input
            name="subcontractor_phone"
            placeholder="Teléfono"
            className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
          />
          <input
            name="subcontractor_email"
            placeholder="Email"
            className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white md:col-span-2"
          />
          <textarea
            name="subcontractor_address"
            placeholder="Dirección"
            className="min-h-24 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white md:col-span-2 xl:col-span-3"
          />
        </div>
      </section>

      <section>
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Información del título</h3>
          <p className="mt-1 text-sm text-slate-400">
            Las fechas se guardarán correctamente y se mostrarán al usuario en formato día/mes/año.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <input
            name="mine_name"
            placeholder="Nombre de la mina"
            className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
          />
          <input
            name="village"
            placeholder="Vereda"
            className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
          />
          <input
            name="title_modality"
            placeholder="Modalidad del título"
            className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
          />
          <input
            name="granted_area"
            placeholder="Área otorgada"
            className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
          />
          <input
            name="contract_stage"
            placeholder="Etapa contractual"
            className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
          />
          <input
            name="annuality"
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
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Fecha inscripción RMN subcontrato
            </label>
            <input
              name="subcontract_rmn_registration_date"
              type="date"
              lang="es-CO"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Estado
            </label>
            <select
              name="is_active"
              defaultValue="true"
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
          className="rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-slate-950"
        >
          Crear título
        </button>
      </div>
    </form>
  );
}