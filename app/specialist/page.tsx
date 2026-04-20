import { redirect } from "next/navigation";
import { ObligationsTable } from "@/components/obligations-table";
import { PageShell } from "@/components/page-shell";
import { SpecialistObligationFilters } from "@/components/specialist-obligation-filters";
import { StatCard } from "@/components/stat-card";
import { getCurrentProfile } from "@/modules/auth/get-current-profile";
import { getSpecialistObligations } from "@/modules/obligations/get-specialist-obligations";

interface SpecialistPageProps {
  searchParams: Promise<{
    status?: string;
    authority?: string;
    q?: string;
  }>;
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
      return "No definida";
  }
}

export default async function SpecialistPage({
  searchParams,
}: SpecialistPageProps) {
  const params = await searchParams;
  const { user, profile } = await getCurrentProfile();

  if (!user) redirect("/login");
  if (!profile || !profile.is_active || profile.role !== "specialist") {
    redirect("/client");
  }

  const obligations = await getSpecialistObligations(profile, {
    status: params.status || undefined,
    authority: params.authority || undefined,
    q: params.q || undefined,
  });

  const upcoming = obligations.filter(
    (item) => item.status === "pendiente" || item.status === "en_proceso"
  ).length;

  const overdue = obligations.filter((item) => item.status === "vencida").length;
  const completed = obligations.filter((item) => item.status === "cumplida").length;

  return (
    <PageShell
      title="Portal especialista"
      description={`Gestiona las obligaciones de tu especialidad: ${formatSpecialty(
        profile.specialty
      )}.`}
    >
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Próximas" value={upcoming} accentClass="text-amber-400" />
        <StatCard title="Vencidas" value={overdue} accentClass="text-red-400" />
        <StatCard title="Cumplidas" value={completed} accentClass="text-emerald-400" />
      </div>

      <div className="mt-6">
        <SpecialistObligationFilters
          selectedStatus={params.status ?? ""}
          selectedAuthority={params.authority ?? ""}
          searchText={params.q ?? ""}
        />
      </div>

      <div className="mt-6">
        <h2 className="mb-4 text-2xl font-semibold">Obligaciones asignadas por temática</h2>
        <ObligationsTable obligations={obligations} basePath="/specialist" />
      </div>
    </PageShell>
  );
}