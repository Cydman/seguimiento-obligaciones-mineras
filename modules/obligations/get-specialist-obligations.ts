import { createAdminClient } from "@/lib/supabase/admin";
import { mapObligationRow } from "@/modules/obligations/map-obligation";
import type { Profile } from "@/types/auth";

export async function getSpecialistObligations(
  profile: Profile,
  filters: {
    status?: string;
    authority?: string;
    q?: string;
  } = {}
) {
  const adminClient = createAdminClient();

  let query = adminClient
    .from("obligations")
    .select("*")
    .eq("is_active", true)
    .or(
      `category.eq.${profile.specialty ?? "___"},assigned_profile_id.eq.${profile.id}`
    )
    .order("due_date", { ascending: true });

  if (filters.status) {
    query = query.eq("status", filters.status);
  }

  if (filters.authority) {
    query = query.eq("authority", filters.authority);
  }

  if (filters.q) {
    query = query.or(`code.ilike.%${filters.q}%,name.ilike.%${filters.q}%`);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Error consultando obligaciones del especialista: ${error.message}`);
  }

  return (data ?? []).map(mapObligationRow);
}