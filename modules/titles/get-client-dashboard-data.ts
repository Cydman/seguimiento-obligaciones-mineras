import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/types/auth";
import type { MiningTitleRecord } from "@/types/titles";
import { mapObligationRow } from "@/modules/obligations/map-obligation";

interface ClientFilters {
  title?: string;
  status?: string;
  authority?: string;
  q?: string;
}

export async function getClientDashboardData(
  profile: Profile,
  filters: ClientFilters = {}
) {
  const supabase = await createClient();

  if (!profile.organization_id) {
    return {
      titles: [] as MiningTitleRecord[],
      selectedTitle: null as MiningTitleRecord | null,
      obligations: [],
    };
  }

  const { data: titles, error: titlesError } = await supabase
    .from("mining_titles")
    .select("*")
    .eq("organization_id", profile.organization_id)
    .eq("is_active", true)
    .order("code");

  if (titlesError) {
    throw new Error(`Error consultando títulos: ${titlesError.message}`);
  }

  const titleRows = (titles ?? []) as MiningTitleRecord[];
  const selectedTitle =
    titleRows.find((item) => item.id === filters.title) ?? titleRows[0] ?? null;

  if (!selectedTitle) {
    return {
      titles: titleRows,
      selectedTitle: null,
      obligations: [],
    };
  }

  let obligationsQuery = supabase
    .from("obligations")
    .select("*")
    .eq("organization_id", profile.organization_id)
    .eq("title_id", selectedTitle.id)
    .eq("is_active", true)
    .order("due_date", { ascending: true });

  if (filters.status) {
    obligationsQuery = obligationsQuery.eq("status", filters.status);
  }

  if (filters.authority) {
    obligationsQuery = obligationsQuery.eq("authority", filters.authority);
  }

  if (filters.q) {
    obligationsQuery = obligationsQuery.or(
      `code.ilike.%${filters.q}%,name.ilike.%${filters.q}%`
    );
  }

  const { data: obligations, error: obligationsError } = await obligationsQuery;

  if (obligationsError) {
    throw new Error(`Error consultando obligaciones: ${obligationsError.message}`);
  }

  return {
    titles: titleRows,
    selectedTitle,
    obligations: (obligations ?? []).map(mapObligationRow),
  };
}