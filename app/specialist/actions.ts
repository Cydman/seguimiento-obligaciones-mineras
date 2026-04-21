"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentProfile } from "@/modules/auth/get-current-profile";

export async function updateSpecialistObligationAction(formData: FormData) {
  const { user, profile } = await getCurrentProfile();

  if (!user) redirect("/login");
  if (!profile || !profile.is_active || profile.role !== "specialist") {
    redirect("/client");
  }

  const obligationId = String(formData.get("obligation_id") ?? "").trim();
  const status = String(formData.get("status") ?? "").trim();
  const priority = String(formData.get("priority") ?? "").trim();
  const dueDate = String(formData.get("due_date") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const legalBasis = String(formData.get("legal_basis") ?? "").trim();

  if (!obligationId || !status || !priority || !dueDate || !description) {
    throw new Error("Debes diligenciar los campos obligatorios.");
  }

  const adminClient = createAdminClient();

  const { data: obligation, error: obligationError } = await adminClient
    .from("obligations")
    .select("id, category, assigned_profile_id")
    .eq("id", obligationId)
    .eq("is_active", true)
    .maybeSingle();

  if (obligationError || !obligation) {
    throw new Error("No fue posible identificar la obligación.");
  }

  const allowed =
    profile.specialty === obligation.category ||
    obligation.assigned_profile_id === profile.id;

  if (!allowed) {
    throw new Error("No tienes permisos para gestionar esta obligación.");
  }

  const { error } = await adminClient
    .from("obligations")
    .update({
      status,
      priority,
      due_date: dueDate,
      description,
      legal_basis: legalBasis || null,
      updated_by: user.id,
    })
    .eq("id", obligationId);

  if (error) {
    throw new Error(`Error actualizando la obligación: ${error.message}`);
  }

  await adminClient.from("obligation_activity_logs").insert({
    obligation_id: obligationId,
    actor_profile_id: user.id,
    action: "specialist_updated",
    note: "Actualización interna realizada por especialista.",
    payload: { status, priority, due_date: dueDate },
    is_system: true,
    updated_by: user.id,
  });

  revalidatePath(`/specialist/obligations/${obligationId}`);
  revalidatePath("/specialist");
  redirect(`/specialist/obligations/${obligationId}?updated=1`);
}