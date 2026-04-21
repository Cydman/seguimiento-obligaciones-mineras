import { createAdminClient } from "@/lib/supabase/admin";
import { mapObligationRow } from "@/modules/obligations/map-obligation";
import type { Profile } from "@/types/auth";
import type { ObligationActivityLog } from "@/types/obligations";

export async function getObligationDetail(
  profile: Profile,
  obligationId: string
) {
  const adminClient = createAdminClient();

  const { data: obligationRow, error: obligationError } = await adminClient
    .from("obligations")
    .select("*")
    .eq("id", obligationId)
    .eq("is_active", true)
    .maybeSingle();

  if (obligationError) {
    throw new Error(`Error consultando obligación: ${obligationError.message}`);
  }

  if (!obligationRow) {
    return { obligation: null, logs: [] as ObligationActivityLog[] };
  }

  const canAccess =
    profile.role === "admin" ||
    (profile.role === "client" &&
      profile.organization_id === obligationRow.organization_id) ||
    (profile.role === "specialist" &&
      (profile.specialty === obligationRow.category ||
        obligationRow.assigned_profile_id === profile.id));

  if (!canAccess) {
    return { obligation: null, logs: [] as ObligationActivityLog[] };
  }

  const { data: logs, error: logsError } = await adminClient
    .from("obligation_activity_logs")
    .select("*")
    .eq("obligation_id", obligationId)
    .eq("is_system", false)
    .order("created_at", { ascending: false });

  if (logsError) {
    throw new Error(`Error consultando historial: ${logsError.message}`);
  }

  return {
    obligation: mapObligationRow(obligationRow),
    logs: (logs ?? []) as ObligationActivityLog[],
  };
}