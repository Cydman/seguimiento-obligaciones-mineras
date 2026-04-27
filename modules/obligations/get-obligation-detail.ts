import { createAdminClient } from "@/lib/supabase/admin";
import { mapObligationRow } from "@/modules/obligations/map-obligation";
import type { Profile } from "@/types/auth";
import type { ObligationActivityLog } from "@/types/obligations";

interface ObligationBaseDocument {
  id: string;
  obligation_id: string;
  organization_id: string;
  storage_path: string;
  file_name: string;
  mime_type: string | null;
  file_size: number | null;
  uploaded_by: string | null;
  created_at: string;
}

export async function getObligationDetail(profile: Profile, obligationId: string) {
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
    return {
      obligation: null,
      logs: [] as ObligationActivityLog[],
      documents: [] as ObligationBaseDocument[],
    };
  }

  const canAccess =
    profile.role === "admin" ||
    (profile.role === "client" &&
      profile.organization_id === obligationRow.organization_id) ||
    (profile.role === "specialist" &&
      (profile.specialty === obligationRow.category ||
        obligationRow.assigned_profile_id === profile.id));

  if (!canAccess) {
    return {
      obligation: null,
      logs: [] as ObligationActivityLog[],
      documents: [] as ObligationBaseDocument[],
    };
  }

  const [
    { data: logs, error: logsError },
    { data: documents, error: documentsError },
  ] = await Promise.all([
    adminClient
      .from("obligation_activity_logs")
      .select("*")
      .eq("obligation_id", obligationId)
      .eq("is_system", false)
      .order("created_at", { ascending: false }),
    adminClient
      .from("obligation_documents")
      .select(
        "id, obligation_id, organization_id, storage_path, file_name, mime_type, file_size, uploaded_by, created_at"
      )
      .eq("obligation_id", obligationId)
      .order("created_at", { ascending: false }),
  ]);

  if (logsError) {
    throw new Error(`Error consultando historial: ${logsError.message}`);
  }

  if (documentsError) {
    throw new Error(`Error consultando documentos base: ${documentsError.message}`);
  }

  return {
    obligation: mapObligationRow(obligationRow),
    logs: (logs ?? []) as ObligationActivityLog[],
    documents: (documents ?? []) as ObligationBaseDocument[],
  };
}