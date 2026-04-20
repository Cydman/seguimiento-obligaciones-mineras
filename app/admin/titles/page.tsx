import { redirect } from "next/navigation";
import { AdminCreateTitleForm } from "@/components/admin-create-title-form";
import { AdminSubmenu } from "@/components/admin-submenu";
import { AdminTitlesTable } from "@/components/admin-titles-table";
import { PageShell } from "@/components/page-shell";
import { StatCard } from "@/components/stat-card";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentProfile } from "@/modules/auth/get-current-profile";
import type { MiningTitleRecord } from "@/types/titles";
import { AdminCreateSection } from "@/components/admin-create-section";

interface AdminTitlesPageProps {
  searchParams: Promise<{
    created?: string;
    updated?: string;
    organization?: string;
    q?: string;
  }>;
}

export default async function AdminTitlesPage({
  searchParams,
}: AdminTitlesPageProps) {
  const params = await searchParams;
  const { user, profile } = await getCurrentProfile();

  if (!user) redirect("/login");
  if (!profile || profile.role !== "admin" || !profile.is_active) {
    redirect("/client");
  }

  const adminClient = createAdminClient();

  const { data: organizations, error: orgError } = await adminClient
    .from("organizations")
    .select("id, name")
    .order("name");

  if (orgError) {
    throw new Error(`Error consultando organizaciones: ${orgError.message}`);
  }

  let titlesQuery = adminClient
    .from("mining_titles")
    .select("*")
    .order("code");

  if (params.organization) {
    titlesQuery = titlesQuery.eq("organization_id", params.organization);
  }

  if (params.q) {
    titlesQuery = titlesQuery.or(
      `code.ilike.%${params.q}%,name.ilike.%${params.q}%,mine_name.ilike.%${params.q}%`
    );
  }

  const { data: titles, error: titlesError } = await titlesQuery;

  if (titlesError) {
    throw new Error(`Error consultando títulos: ${titlesError.message}`);
  }

  const rows = (titles ?? []) as MiningTitleRecord[];
  const activeCount = rows.filter((item) => item.is_active).length;

  return (
    <PageShell
      title="Títulos por organización"
      description="Administra los títulos mineros y su información general."
    >
      <div className="mb-8">
        <AdminSubmenu />
      </div>

      {params.created === "1" ? (
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-200">
          Título creado correctamente.
        </div>
      ) : null}

      {params.updated === "1" ? (
        <div className="mt-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-200">
          Título actualizado correctamente.
        </div>
      ) : null}

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Títulos visibles" value={rows.length} accentClass="text-sky-400" />
        <StatCard title="Activos" value={activeCount} accentClass="text-emerald-400" />
        <StatCard title="Organizaciones" value={(organizations ?? []).length} accentClass="text-amber-400" />
      </div>

      <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="text-2xl font-semibold">Filtros</h2>

        <form method="GET" className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">Organización</label>
            <select
              name="organization"
              defaultValue={params.organization ?? ""}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
            >
              <option value="">Todas</option>
              {(organizations ?? []).map((org) => (
                <option key={org.id} value={org.id}>
                  {org.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">Buscar</label>
            <input
              name="q"
              defaultValue={params.q ?? ""}
              placeholder="Placa, nombre o mina"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
            />
          </div>

          <div className="flex items-end gap-3 md:col-span-2">
            <button type="submit" className="rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-slate-950">
              Aplicar
            </button>
            <a href="/admin/titles" className="rounded-xl border border-slate-700 px-5 py-3 font-semibold text-white">
              Limpiar
            </a>
          </div>
        </form>
      </div>

      <div className="mt-8">
        <AdminCreateSection
          title="Crear título"
          description="Registra la información general de un nuevo título minero."
          buttonLabel="Nuevo título"
        >
          <AdminCreateTitleForm organizations={organizations ?? []} />
        </AdminCreateSection>
      </div>

      <div className="mt-8 space-y-4">
        <h2 className="text-2xl font-semibold">Editar títulos</h2>
        <AdminTitlesTable
          titles={rows}
          organizations={organizations ?? []}
        />
      </div>
    </PageShell>
  );
}