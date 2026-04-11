import { supabase } from "@/lib/supabase";
import { mapObligationRow } from "@/modules/obligations/map-obligation";

export async function getDashboardData() {
  const [
    { data: organizations, error: orgError },
    { data: titles, error: titlesError },
    { data: obligations, error: obligationsError },
  ] = await Promise.all([
    supabase.from("organizations").select("*"),
    supabase.from("mining_titles").select("*"),
    supabase.from("obligations").select("*").order("due_date", { ascending: true }),
  ]);

  if (orgError) {
    throw new Error(`Error consultando organizaciones: ${orgError.message}`);
  }

  if (titlesError) {
    throw new Error(`Error consultando títulos: ${titlesError.message}`);
  }

  if (obligationsError) {
    throw new Error(`Error consultando obligaciones: ${obligationsError.message}`);
  }

  return {
    organizations: organizations ?? [],
    titles: titles ?? [],
    obligations: (obligations ?? []).map(mapObligationRow),
  };
}