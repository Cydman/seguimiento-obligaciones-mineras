import { redirect } from "next/navigation";
import { AdminCreateOrganizationForm } from "@/components/admin-create-organization-form";
import { AdminCreateSection } from "@/components/admin-create-section";
import { AdminOrganizationsTable } from "@/components/admin-organizations-table";
import { AdminSubmenu } from "@/components/admin-submenu";
import { PageShell } from "@/components/page-shell";
import { StatCard } from "@/components/stat-card";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentProfile } from "@/modules/auth/get-current-profile";

interface AdminOrganizationsPageProps {
  searchParams: Promise<{
    created?: string;
    updated?: string;
    q?: string;
    status?: string;
    plan?: string;
  }>;
}

export default async function AdminOrganizationsPage({
  searchParams,
}: AdminOrganizationsPageProps) {
  const params = await searchParams;
  const { user, profile } = await getCurrentProfile();

  if (!user) redirect("/login");
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
  const q = (params.q ?? "").trim().toLowerCase();
  const selectedStatus = params.status ?? "";
  const selectedPlan = params.plan ?? "";

  const filteredRows = rows.filter((item) => {
    const matchesQuery =
      !q ||
      item.name.toLowerCase().includes(q) ||
      item.document_number.toLowerCase().includes(q);

    const matchesStatus =
      !selectedStatus ||
      (selectedStatus === "active" && item.is_active) ||
      (selectedStatus === "inactive" && !item.is_active);

    const matchesPlan =
      !selectedPlan || item.subscription_plan === selectedPlan;

    return matchesQuery && matchesStatus && matchesPlan;
  });

  const visibleCount = filteredRows.length;
  const activeCount = filteredRows.filter((item) => item.is_active).length;
  const inactiveCount = filteredRows.filter((item) => !item.is_active).length;
  const businessCount = filteredRows.filter(
    (item) => item.subscription_plan === "empresarial"
  ).length;

  return (
    <PageShell
      title="Organizaciones"
      description="Administra las organizaciones clientes del sistema."
    >
      <div className="space-y-5">
        <AdminSubmenu />

        {params.created === "1" ? (
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-200">
            Organización creada correctamente.
          </div>
        ) : null}

        {params.updated === "1" ? (
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-200">
            Organización actualizada correctamente.
          </div>
        ) : null}

        <div className="rounded-2xl border border-slate-800 bg-slate-900 px-4 py-4">
          <form
            method="GET"
            className="grid gap-3 xl:grid-cols-[1.7fr_1fr_1fr_auto_auto]"
          >
            <div>
              <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-slate-400">
                Buscar
              </label>
              <input
                name="q"
                defaultValue={params.q ?? ""}
                placeholder="Nombre o documento"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none placeholder:text-slate-500 focus:border-emerald-500"
              />
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
                <option value="active">Activas</option>
                <option value="inactive">Inactivas</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-slate-400">
                Plan
              </label>
              <select
                name="plan"
                defaultValue={selectedPlan}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none focus:border-emerald-500"
              >
                <option value="">Todos</option>
                <option value="basico">Básico</option>
                <option value="profesional">Profesional</option>
                <option value="empresarial">Empresarial</option>
              </select>
            </div>

            <button
              type="submit"
              className="self-end rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
            >
              Aplicar filtros
            </button>

            <a
              href="/admin/organizations"
              className="self-end rounded-xl border border-slate-700 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:border-slate-500"
            >
              Limpiar
            </a>
          </form>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Visibles"
            value={visibleCount}
            accentClass="text-sky-400"
          />
          <StatCard
            title="Activas"
            value={activeCount}
            accentClass="text-emerald-400"
          />
          <StatCard
            title="Inactivas"
            value={inactiveCount}
            accentClass="text-red-400"
          />
          <StatCard
            title="Empresariales"
            value={businessCount}
            accentClass="text-amber-400"
          />
        </div>

        <AdminCreateSection
          title="Crear organización"
          description="Registra una nueva organización cliente."
          buttonLabel="Nueva organización"
        >
          <AdminCreateOrganizationForm />
        </AdminCreateSection>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
          <div className="mb-4">
            <h2 className="text-xl font-semibold">Editar organizaciones</h2>
            <p className="mt-1 text-sm text-slate-400">
              Consulta y ajusta nombre, documento, plan y estado de las organizaciones visibles.
            </p>
          </div>

          <AdminOrganizationsTable organizations={filteredRows} />
        </section>
      </div>
    </PageShell>
  );
}