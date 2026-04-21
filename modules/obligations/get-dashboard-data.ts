import { createClient } from "@/lib/supabase/server";
import { mapObligationRow } from "@/modules/obligations/map-obligation";
import type { Profile } from "@/types/auth";

interface AdminFilters {
  organization?: string;
  title?: string;
  status?: string;
  q?: string;
}

export async function getDashboardData(
  profile: Profile,
  filters: AdminFilters = {}
) {
  const supabase = await createClient();

  const [
    { data: organizations, error: orgError },
    { data: titles, error: titlesError },
  ] = await Promise.all([
    profile.role === "admin"
      ? supabase.from("organizations").select("*").order("name")
      : supabase
          .from("organizations")
          .select("*")
          .eq("id", profile.organization_id),

    profile.role === "admin"
      ? supabase.from("mining_titles").select("*").order("name")
      : supabase
          .from("mining_titles")
          .select("*")
          .eq("organization_id", profile.organization_id),
  ]);

  if (orgError) {
    throw new Error(`Error consultando organizaciones: ${orgError.message}`);
  }

  if (titlesError) {
    throw new Error(`Error consultando títulos: ${titlesError.message}`);
  }

  const allOrganizations = organizations ?? [];
  const allTitles = titles ?? [];

  const visibleOrganizations = filters.organization
    ? allOrganizations.filter((org) => org.id === filters.organization)
    : allOrganizations;

  const visibleTitles = filters.title
    ? allTitles.filter((title) => title.id === filters.title)
    : filters.organization
    ? allTitles.filter((title) => title.organization_id === filters.organization)
    : allTitles;

  let obligationsQuery = supabase
    .from("obligations")
    .select("*")
    .eq("is_active", true)
    .order("due_date", { ascending: true });

  if (profile.role !== "admin" && profile.organization_id) {
    obligationsQuery = obligationsQuery.eq(
      "organization_id",
      profile.organization_id
    );
  }

  if (filters.organization) {
    obligationsQuery = obligationsQuery.eq(
      "organization_id",
      filters.organization
    );
  }

  if (filters.title) {
    obligationsQuery = obligationsQuery.eq("title_id", filters.title);
  }

  if (filters.status) {
    obligationsQuery = obligationsQuery.eq("status", filters.status);
  }

  if (filters.q) {
    obligationsQuery = obligationsQuery.or(
      `code.ilike.%${filters.q}%,name.ilike.%${filters.q}%`
    );
  }

  const { data: obligations, error: obligationsError } = await obligationsQuery;

  if (obligationsError) {
    throw new Error(
      `Error consultando obligaciones: ${obligationsError.message}`
    );
  }

  return {
    allOrganizations,
    allTitles,
    visibleOrganizations,
    visibleTitles,
    obligations: (obligations ?? []).map(mapObligationRow),
  };
}