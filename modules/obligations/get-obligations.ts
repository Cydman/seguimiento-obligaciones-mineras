import { supabase } from "@/lib/supabase";
import { mapObligationRow } from "@/modules/obligations/map-obligation";

export async function getObligations() {
  const { data, error } = await supabase
    .from("obligations")
    .select("*")
    .order("due_date", { ascending: true });

  if (error) {
    throw new Error(`Error consultando obligaciones: ${error.message}`);
  }

  return (data ?? []).map(mapObligationRow);
}