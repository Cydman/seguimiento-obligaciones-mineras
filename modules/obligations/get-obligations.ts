import { createClient } from "@/lib/supabase/server";
import { mapObligationRow } from "@/modules/obligations/map-obligation";
import type { Profile } from "@/types/auth";

export async function getObligations(profile: Profile) {
  const supabase = await createClient();

  if (profile.role !== "admin" && !profile.organization_id) {
    return [];
  }

  let query = supabase
    .from("obligations")
    .select("*")
    .eq("is_active", true)
    .order("due_date", { ascending: true });

  if (profile.role !== "admin") {
    query = query.eq("organization_id", profile.organization_id);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Error consultando obligaciones: ${error.message}`);
  }

  return (data ?? []).map(mapObligationRow);
}