import { redirect } from "next/navigation";
import { AdminCreateOrganizationForm } from "@/components/admin-create-organization-form";
import { AdminOrganizationsTable } from "@/components/admin-organizations-table";
import { AdminSubmenu } from "@/components/admin-submenu";
import { PageShell } from "@/components/page-shell";
import { StatCard } from "@/components/stat-card";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentProfile } from "@/modules/auth/get-current-profile";
import { AdminCreateSection } from "@/components/admin-create-section";

interface AdminOrganizationsPageProps {
  searchParams: Promise<{
    created?: string;
    updated?: string;
  }>;
}

export default async function AdminOrganizationsPage({
  searchParams,
}: AdminOrganizationsPageProps) {
  const params = await searchParams;
  const { user, profile } = await getCurrentProfile();

  if (!user) {
    redirect("/login");
  }

  if (!profile || profile.role !== "admin" || !profile.is_active) {
    redirect("/client");
  }

  const adminClient = createAdminClient();

  const { data: organizations, error } = await adminClient
    .from("organizations")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Error consultando organizaciones: ${error.message}`);
  }

  const rows = organizations ?? [];
  const activeCount = rows.filter((item) => item.is_active).length;
  const inactiveCount = rows.filter((item) => !item.is_active).length;

  return (
    <PageShell
      title="Organizaciones"
      description="Administra las organizaciones clientes del sistema."
    >
      <div className="mb-8">
        <AdminSubmenu />
      </div>

      {params.created === "1" ? (
        <div className="mt-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-200">
          Organización creada correctamente.
        </div>
      ) : null}

      {params.updated === "1" ? (
        <div className="mt-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-200">
          Organización actualizada correctamente.
        </div>
      ) : null}

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Total organizaciones" value={rows.length} accentClass="text-sky-400" />
        <StatCard title="Activas" value={activeCount} accentClass="text-emerald-400" />
        <StatCard title="Inactivas" value={inactiveCount} accentClass="text-red-400" />
      </div>

      <div className="mt-8">
        <AdminCreateSection
          title="Crear organización"
          description="Registra una nueva organización cliente."
          buttonLabel="Nueva organización"
        >
          <AdminCreateOrganizationForm />
        </AdminCreateSection>
      </div>

      <div className="mt-8 space-y-4">
        <h2 className="text-2xl font-semibold">Editar organizaciones</h2>
        <AdminOrganizationsTable organizations={rows} />
      </div>
    </PageShell>
  );
}