import { createOrganizationAction } from "@/app/admin/organizations/actions";

export function AdminCreateOrganizationForm() {
  return (
    <form action={createOrganizationAction} className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-300">
          Nombre
        </label>
        <input
          name="name"
          type="text"
          required
          className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-500"
          placeholder="Nombre de la organización"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-300">
          Documento
        </label>
        <input
          name="document_number"
          type="text"
          required
          className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-500"
          placeholder="NIT o documento"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-300">
          Plan
        </label>
        <select
          name="subscription_plan"
          defaultValue="basico"
          className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-500"
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
          defaultValue="true"
          className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-500"
        >
          <option value="true">Activa</option>
          <option value="false">Inactiva</option>
        </select>
      </div>

      <div className="md:col-span-2 xl:col-span-4 flex justify-end">
        <button
          type="submit"
          className="rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-emerald-400"
        >
          Crear organización
        </button>
      </div>
    </form>
  );
}