import { createAdminClient } from "@/lib/supabase/admin";
import { mapObligationRow } from "@/modules/obligations/map-obligation";
import type { ObligationActivityLog } from "@/types/obligations";

export async function getObligationAdminDetail(obligationId: string) {
  const adminClient = createAdminClient();

  const { data: obligationRow, error: obligationError } = await adminClient
    .from("obligations")
    .select("*")
    .eq("id", obligationId)
    .maybeSingle();

  if (obligationError) {
    throw new Error(`Error consultando obligación: ${obligationError.message}`);
  }

  if (!obligationRow) {
    return {
      obligation: null,
      logs: [] as ObligationActivityLog[],
      assignableProfiles: [],
    };
  }

  const [{ data: logs, error: logsError }, { data: profiles, error: profilesError }] =
    await Promise.all([
      adminClient
        .from("obligation_activity_logs")
        .select("*")
        .eq("obligation_id", obligationId)
        .eq("is_system", false)
        .order("created_at", { ascending: false }),
      adminClient
        .from("profiles")
        .select("id, email, full_name, role, specialty, is_active")
        .eq("is_active", true)
        .in("role", ["admin", "specialist"]),
    ]);

  if (logsError) {
    throw new Error(`Error consultando historial: ${logsError.message}`);
  }

  if (profilesError) {
    throw new Error(`Error consultando responsables: ${profilesError.message}`);
  }

  const assignableProfiles = (profiles ?? []).filter(
    (item) =>
      item.role === "admin" ||
      (item.role === "specialist" && item.specialty === obligationRow.category)
  );

  return {
    obligation: mapObligationRow(obligationRow),
    logs: (logs ?? []) as ObligationActivityLog[],
    assignableProfiles,
  };
}