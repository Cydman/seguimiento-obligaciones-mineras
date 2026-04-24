import { redirect } from "next/navigation";
import { AdminCreateSection } from "@/components/admin-create-section";
import { AdminCreateUserForm } from "@/components/admin-create-user-form";
import { AdminSubmenu } from "@/components/admin-submenu";
import { AdminUsersTable } from "@/components/admin-users-table";
import { PageShell } from "@/components/page-shell";
import { StatCard } from "@/components/stat-card";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentProfile } from "@/modules/auth/get-current-profile";

interface AdminUsersPageProps {
  searchParams: Promise<{
    created?: string;
    updated?: string;
    q?: string;
    role?: string;
    status?: string;
    organization?: string;
  }>;
}

export default async function AdminUsersPage({
  searchParams,
}: AdminUsersPageProps) {
  const params = await searchParams;
  const { user, profile } = await getCurrentProfile();

  if (!user) redirect("/login");
  if (!profile || profile.role !== "admin" || !profile.is_active) {
    redirect("/client");
  }

  const adminClient = createAdminClient();

  const [
    { data: profiles, error: profilesError },
    { data: organizations, error: organizationsError },
  ] = await Promise.all([
    adminClient
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false }),
    adminClient
      .from("organizations")
      .select("id, name")
      .order("name"),
  ]);

  if (profilesError) {
    throw new Error(`Error consultando perfiles: ${profilesError.message}`);
  }

  if (organizationsError) {
    throw new Error(
      `Error consultando organizaciones: ${organizationsError.message}`
    );
  }

  const allProfiles = profiles ?? [];
  const organizationOptions = organizations ?? [];

  const q = (params.q ?? "").trim().toLowerCase();
  const selectedRole = params.role ?? "";
  const selectedStatus = params.status ?? "";
  const selectedOrganization = params.organization ?? "";

  const filteredProfiles = allProfiles.filter((item) => {
    const matchesQuery =
      !q ||
      (item.full_name ?? "").toLowerCase().includes(q) ||
      (item.email ?? "").toLowerCase().includes(q);

    const matchesRole = !selectedRole || item.role === selectedRole;

    const matchesStatus =
      !selectedStatus ||
      (selectedStatus === "active" && item.is_active) ||
      (selectedStatus === "inactive" && !item.is_active);

    const matchesOrganization =
      !selectedOrganization || item.organization_id === selectedOrganization;

    return (
      matchesQuery &&
      matchesRole &&
      matchesStatus &&
      matchesOrganization
    );
  });

  const visibleCount = filteredProfiles.length;
  const activeUsers = filteredProfiles.filter((item) => item.is_active).length;
  const adminUsers = filteredProfiles.filter((item) => item.role === "admin").length;
  const specialistUsers = filteredProfiles.filter(
    (item) => item.role === "specialist"
  ).length;
  const clientUsers = filteredProfiles.filter(
    (item) => item.role === "client"
  ).length;

  return (
    <PageShell
      title="Usuarios y clientes"
      description="Crea y administra accesos, roles, especialidades, organizaciones y estado de cada usuario."
    >
      <div className="space-y-5">
        <AdminSubmenu />

        {params.created === "1" ? (
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-200">
            Usuario creado correctamente.
          </div>
        ) : null}

        {params.updated === "1" ? (
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-200">
            Perfil actualizado correctamente.
          </div>
        ) : null}

        <div className="rounded-2xl border border-slate-800 bg-slate-900 px-4 py-4">
          <form
            method="GET"
            className="grid gap-3 xl:grid-cols-[1.5fr_1fr_1fr_1.2fr_auto_auto]"
          >
            <div>
              <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-slate-400">
                Buscar
              </label>
              <input
                name="q"
                defaultValue={params.q ?? ""}
                placeholder="Nombre o correo"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none placeholder:text-slate-500 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-slate-400">
                Rol
              </label>
              <select
                name="role"
                defaultValue={selectedRole}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none focus:border-emerald-500"
              >
                <option value="">Todos</option>
                <option value="admin">Admin</option>
                <option value="specialist">Specialist</option>
                <option value="client">Client</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-slate-400">
                Estado
              </label>
              <select
                name="status"
                defaultValue={selectedStatus}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none focus:border-emerald-500"
              >
                <option value="">Todos</option>
                <option value="active">Activos</option>
                <option value="inactive">Inactivos</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-slate-400">
                Organización
              </label>
              <select
                name="organization"
                defaultValue={selectedOrganization}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none focus:border-emerald-500"
              >
                <option value="">Todas</option>
                {organizationOptions.map((org) => (
                  <option key={org.id} value={org.id}>
                    {org.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="self-end rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
            >
              Aplicar filtros
            </button>

            <a
              href="/admin/users"
              className="self-end rounded-xl border border-slate-700 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:border-slate-500"
            >
              Limpiar
            </a>
          </form>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          <StatCard
            title="Usuarios visibles"
            value={visibleCount}
            accentClass="text-sky-400"
          />
          <StatCard
            title="Activos"
            value={activeUsers}
            accentClass="text-emerald-400"
          />
          <StatCard
            title="Admins"
            value={adminUsers}
            accentClass="text-amber-400"
          />
          <StatCard
            title="Specialists"
            value={specialistUsers}
            accentClass="text-fuchsia-400"
          />
          <StatCard
            title="Clientes"
            value={clientUsers}
            accentClass="text-red-400"
          />
        </div>

        <AdminCreateSection
          title="Crear usuario"
          description="Registra un nuevo acceso y asígnale rol, especialidad, organización y estado."
          buttonLabel="Nuevo usuario"
        >
          <AdminCreateUserForm organizations={organizationOptions} />
        </AdminCreateSection>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
          <div className="mb-4">
            <h2 className="text-xl font-semibold">Editar usuarios</h2>
            <p className="mt-1 text-sm text-slate-400">
              Consulta y ajusta rol, especialidad, organización y estado de los usuarios visibles.
            </p>
          </div>

          <AdminUsersTable
            profiles={filteredProfiles}
            organizations={organizationOptions}
          />
        </section>
      </div>
    </PageShell>
  );
}