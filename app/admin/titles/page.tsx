import { redirect } from "next/navigation";
import { AdminCreateSection } from "@/components/admin-create-section";
import { AdminCreateTitleForm } from "@/components/admin-create-title-form";
import { AdminSubmenu } from "@/components/admin-submenu";
import { AdminTitlesTable } from "@/components/admin-titles-table";
import { PageShell } from "@/components/page-shell";
import { StatCard } from "@/components/stat-card";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentProfile } from "@/modules/auth/get-current-profile";
import type { MiningTitleRecord } from "@/types/titles";

interface AdminTitlesPageProps {
  searchParams: Promise<{
    created?: string;
    updated?: string;
    organization?: string;
    q?: string;
    status?: string;
    municipality?: string;
    modality?: string;
  }>;
}

function uniqueSorted(values: Array<string | null | undefined>) {
  return [...new Set(values.filter((value): value is string => Boolean(value?.trim())))]
    .sort((a, b) => a.localeCompare(b, "es-CO"));
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

  const { data: titles, error: titlesError } = await adminClient
    .from("mining_titles")
    .select("*")
    .order("code");

  if (titlesError) {
    throw new Error(`Error consultando títulos: ${titlesError.message}`);
  }

  const allOrganizations = organizations ?? [];
  const allRows = (titles ?? []) as MiningTitleRecord[];

  const q = (params.q ?? "").trim().toLowerCase();
  const selectedOrganization = params.organization ?? "";
  const selectedStatus = params.status ?? "";
  const selectedMunicipality = params.municipality ?? "";
  const selectedModality = params.modality ?? "";

  const municipalityOptions = uniqueSorted(allRows.map((item) => item.municipality));
  const modalityOptions = uniqueSorted(allRows.map((item) => item.title_modality));

  const filteredRows = allRows.filter((item) => {
    const matchesQuery =
      !q ||
      item.code.toLowerCase().includes(q) ||
      item.name.toLowerCase().includes(q) ||
      (item.mine_name ?? "").toLowerCase().includes(q) ||
      item.municipality.toLowerCase().includes(q);

    const matchesOrganization =
      !selectedOrganization || item.organization_id === selectedOrganization;

    const matchesStatus =
      !selectedStatus ||
      (selectedStatus === "active" && item.is_active) ||
      (selectedStatus === "inactive" && !item.is_active);

    const matchesMunicipality =
      !selectedMunicipality || item.municipality === selectedMunicipality;

    const matchesModality =
      !selectedModality || item.title_modality === selectedModality;

    return (
      matchesQuery &&
      matchesOrganization &&
      matchesStatus &&
      matchesMunicipality &&
      matchesModality
    );
  });

  const visibleCount = filteredRows.length;
  const activeCount = filteredRows.filter((item) => item.is_active).length;
  const inactiveCount = filteredRows.filter((item) => !item.is_active).length;
  const visibleOrganizations = new Set(
    filteredRows.map((item) => item.organization_id)
  ).size;

  return (
    <PageShell
      title="Títulos por organización"
      description="Administra los títulos mineros, su información general y los datos del titular y subcontratista."
    >
      <div className="space-y-5">
        <AdminSubmenu />

        {params.created === "1" ? (
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-200">
            Título creado correctamente.
          </div>
        ) : null}

        {params.updated === "1" ? (
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-200">
            Título actualizado correctamente.
          </div>
        ) : null}

        <div className="rounded-2xl border border-slate-800 bg-slate-900 px-4 py-4">
          <form
            method="GET"
            className="grid gap-3 xl:grid-cols-[1.3fr_1fr_1fr_1fr_1.5fr_auto_auto]"
          >
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
                {allOrganizations.map((org) => (
                  <option key={org.id} value={org.id}>
                    {org.name}
                  </option>
                ))}
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
                Municipio
              </label>
              <select
                name="municipality"
                defaultValue={selectedMunicipality}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none focus:border-emerald-500"
              >
                <option value="">Todos</option>
                {municipalityOptions.map((municipality) => (
                  <option key={municipality} value={municipality}>
                    {municipality}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-slate-400">
                Modalidad
              </label>
              <select
                name="modality"
                defaultValue={selectedModality}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none focus:border-emerald-500"
              >
                <option value="">Todas</option>
                {modalityOptions.map((modality) => (
                  <option key={modality} value={modality}>
                    {modality}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-slate-400">
                Buscar
              </label>
              <input
                name="q"
                defaultValue={params.q ?? ""}
                placeholder="Placa, nombre, mina o municipio"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none placeholder:text-slate-500 focus:border-emerald-500"
              />
            </div>

            <button
              type="submit"
              className="self-end rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
            >
              Aplicar filtros
            </button>

            <a
              href="/admin/titles"
              className="self-end rounded-xl border border-slate-700 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:border-slate-500"
            >
              Limpiar
            </a>
          </form>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Títulos visibles"
            value={visibleCount}
            accentClass="text-sky-400"
          />
          <StatCard
            title="Activos"
            value={activeCount}
            accentClass="text-emerald-400"
          />
          <StatCard
            title="Inactivos"
            value={inactiveCount}
            accentClass="text-red-400"
          />
          <StatCard
            title="Organizaciones visibles"
            value={visibleOrganizations}
            accentClass="text-amber-400"
          />
        </div>

        <AdminCreateSection
          title="Crear título"
          description="Registra la información general de un nuevo título minero."
          buttonLabel="Nuevo título"
        >
          <AdminCreateTitleForm organizations={allOrganizations} />
        </AdminCreateSection>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
          <div className="mb-4">
            <h2 className="text-xl font-semibold">Editar títulos</h2>
            <p className="mt-1 text-sm text-slate-400">
              Consulta y ajusta la información general, del titular y del subcontratista para los títulos visibles.
            </p>
          </div>

          <AdminTitlesTable
            titles={filteredRows}
            organizations={allOrganizations}
          />
        </section>
      </div>
    </PageShell>
  );
}