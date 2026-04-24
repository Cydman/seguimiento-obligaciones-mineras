import { updateUserProfileAction } from "@/app/admin/users/actions";

interface UserProfileRow {
  id: string;
  email: string | null;
  role: "admin" | "client" | "specialist";
  organization_id: string | null;
  is_active: boolean;
  specialty: string | null;
  full_name: string | null;
}

interface OrganizationOption {
  id: string;
  name: string;
}

interface AdminUsersTableProps {
  profiles: UserProfileRow[];
  organizations: OrganizationOption[];
}

function getOrganizationName(
  organizationId: string | null,
  organizations: OrganizationOption[]
) {
  if (!organizationId) return "Sin organización";
  return (
    organizations.find((org) => org.id === organizationId)?.name ??
    "Sin organización"
  );
}

function formatRole(role: string) {
  switch (role) {
    case "admin":
      return "Admin";
    case "specialist":
      return "Specialist";
    case "client":
      return "Client";
    default:
      return role;
  }
}

function formatSpecialty(value: string | null) {
  switch (value) {
    case "tecnica":
      return "Técnica";
    case "juridica":
      return "Jurídica";
    case "economica":
      return "Económica";
    case "social":
      return "Social";
    case "ambiental":
      return "Ambiental";
    default:
      return value || "No aplica";
  }
}

export function AdminUsersTable({
  profiles,
  organizations,
}: AdminUsersTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
      <div className="grid grid-cols-[1.2fr_1.6fr_0.9fr_1fr_1.2fr_0.8fr_auto] gap-3 border-b border-slate-800 bg-slate-800/70 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-300">
        <div>Nombre</div>
        <div>Correo</div>
        <div>Rol</div>
        <div>Especialidad</div>
        <div>Organización</div>
        <div>Estado</div>
        <div>Acción</div>
      </div>

      {profiles.length === 0 ? (
        <div className="px-4 py-8 text-center text-sm text-slate-400">
          No hay usuarios visibles con los filtros actuales.
        </div>
      ) : (
        profiles.map((profile) => (
          <details key={profile.id} className="border-t border-slate-800">
            <summary className="grid cursor-pointer list-none grid-cols-[1.2fr_1.6fr_0.9fr_1fr_1.2fr_0.8fr_auto] gap-3 px-4 py-3 text-sm text-slate-200">
              <div className="truncate">{profile.full_name || "-"}</div>
              <div className="truncate">{profile.email || "Sin correo"}</div>
              <div>{formatRole(profile.role)}</div>
              <div className="truncate">{formatSpecialty(profile.specialty)}</div>
              <div className="truncate">
                {getOrganizationName(profile.organization_id, organizations)}
              </div>
              <div>{profile.is_active ? "Activo" : "Inactivo"}</div>
              <div>
                <span className="rounded-xl border border-slate-700 px-3 py-1.5 text-xs font-medium text-white">
                  Editar
                </span>
              </div>
            </summary>

            <div className="border-t border-slate-800 bg-slate-950/40 px-4 py-4">
              <form action={updateUserProfileAction} className="space-y-4">
                <input type="hidden" name="profile_id" value={profile.id} />

                <div className="grid gap-4 lg:grid-cols-5">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Nombre
                    </label>
                    <input
                      name="full_name"
                      defaultValue={profile.full_name ?? ""}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Rol
                    </label>
                    <select
                      name="role"
                      defaultValue={profile.role}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
                    >
                      <option value="admin">Admin</option>
                      <option value="specialist">Specialist</option>
                      <option value="client">Client</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Especialidad
                    </label>
                    <select
                      name="specialty"
                      defaultValue={profile.specialty ?? ""}
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
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Organización
                    </label>
                    <select
                      name="organization_id"
                      defaultValue={profile.organization_id ?? ""}
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
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Estado
                    </label>
                    <select
                      name="is_active"
                      defaultValue={profile.is_active ? "true" : "false"}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
                    >
                      <option value="true">Activo</option>
                      <option value="false">Inactivo</option>
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