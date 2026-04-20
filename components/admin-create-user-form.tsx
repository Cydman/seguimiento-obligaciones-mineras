import { createUserAccessAction } from "@/app/admin/users/actions";

interface OrganizationOption {
  id: string;
  name: string;
}

interface AdminCreateUserFormProps {
  organizations: OrganizationOption[];
}

export function AdminCreateUserForm({
  organizations,
}: AdminCreateUserFormProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <form action={createUserAccessAction} className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">Nombre completo</label>
          <input
            name="full_name"
            type="text"
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
            placeholder="Nombre del usuario"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">Correo</label>
          <input
            name="email"
            type="email"
            required
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
            placeholder="usuario@empresa.com"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">Contraseña inicial</label>
          <input
            name="password"
            type="password"
            required
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
            placeholder="********"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">Rol</label>
          <select
            name="role"
            defaultValue="client"
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
          >
            <option value="client">Client</option>
            <option value="specialist">Specialist</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">Especialidad</label>
          <select
            name="specialty"
            defaultValue=""
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
          >
            <option value="">No aplica</option>
            <option value="tecnica">Técnica</option>
            <option value="juridica">Jurídica</option>
            <option value="economica">Económica</option>
            <option value="social">Social</option>
            <option value="ambiental">Ambiental</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">Organización</label>
          <select
            name="organization_id"
            defaultValue=""
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
          >
            <option value="">Sin organización</option>
            {organizations.map((org) => (
              <option key={org.id} value={org.id}>
                {org.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">Estado</label>
          <select
            name="is_active"
            defaultValue="true"
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
          >
            <option value="true">Activo</option>
            <option value="false">Inactivo</option>
          </select>
        </div>

        <div className="md:col-span-2 flex justify-end">
          <button
            type="submit"
            className="rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-slate-950"
          >
            Crear usuario
          </button>
        </div>
      </form>
    </div>
  );
}