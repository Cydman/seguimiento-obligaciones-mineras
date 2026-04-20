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
  }>;
}

export default async function AdminUsersPage({
  searchParams,
}: AdminUsersPageProps) {
  const params = await searchParams;
  const { user, profile } = await getCurrentProfile();

  if (!user) {
    redirect("/login");
  }

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

  const activeUsers = allProfiles.filter((item) => item.is_active).length;
  const adminUsers = allProfiles.filter((item) => item.role === "admin").length;
  const specialistUsers = allProfiles.filter(
    (item) => item.role === "specialist"
  ).length;
  const clientUsers = allProfiles.filter(
    (item) => item.role === "client"
  ).length;

  return (
    <PageShell
      title="Usuarios y clientes"
      description="Crea y administra accesos, roles, especialidades, organizaciones y estado de cada usuario."
    >
      <div className="mb-8">
        <AdminSubmenu />
      </div>

      {params.created === "1" ? (
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-200">
          Usuario creado correctamente.
        </div>
      ) : null}

      {params.updated === "1" ? (
        <div className="mt-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-200">
          Perfil actualizado correctamente.
        </div>
      ) : null}

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Usuarios activos"
          value={activeUsers}
          accentClass="text-emerald-400"
        />
        <StatCard
          title="Admins"
          value={adminUsers}
          accentClass="text-sky-400"
        />
        <StatCard
          title="Specialists"
          value={specialistUsers}
          accentClass="text-amber-400"
        />
        <StatCard
          title="Clientes"
          value={clientUsers}
          accentClass="text-red-400"
        />
      </div>

      <div className="mt-8">
        <AdminCreateSection
          title="Crear usuario"
          description="Registra un nuevo acceso y asígnale rol, especialidad, organización y estado."
          buttonLabel="Nuevo usuario"
        >
          <AdminCreateUserForm organizations={organizationOptions} />
        </AdminCreateSection>
      </div>

      <div className="mt-8 space-y-4">
        <h2 className="text-2xl font-semibold">Editar usuarios</h2>
        <AdminUsersTable
          profiles={allProfiles}
          organizations={organizationOptions}
        />
      </div>
    </PageShell>
  );
}