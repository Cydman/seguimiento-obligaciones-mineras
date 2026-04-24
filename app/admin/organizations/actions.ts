"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentProfile } from "@/modules/auth/get-current-profile";

function normalizeSubscriptionPlan(value: FormDataEntryValue | null) {
  const text = String(value ?? "").trim().toLowerCase();

  if (text === "basico" || text === "basic") return "basico";
  if (
    text === "profesional" ||
    text === "professional" ||
    text === "pro"
  ) {
    return "profesional";
  }

  if (
    text === "empresarial" ||
    text === "enterprise" ||
    text === "premium"
  ) {
    return "empresarial";
  }

  return "";
}

export async function createOrganizationAction(formData: FormData) {
  const { user, profile } = await getCurrentProfile();

  if (!user) redirect("/login");
  if (!profile || profile.role !== "admin" || !profile.is_active) {
    redirect("/client");
  }

  const name = String(formData.get("name") ?? "").trim();
  const documentNumber = String(formData.get("document_number") ?? "").trim();
  const subscriptionPlan = normalizeSubscriptionPlan(
    formData.get("subscription_plan")
  );
  const isActive = String(formData.get("is_active") ?? "true").trim() === "true";

  if (!name || !documentNumber || !subscriptionPlan) {
    throw new Error("Todos los campos son obligatorios.");
  }

  const adminClient = createAdminClient();

  const { error } = await adminClient.from("organizations").insert({
    name,
    document_number: documentNumber,
    subscription_plan: subscriptionPlan,
    is_active: isActive,
  });

  if (error) {
    throw new Error(`Error creando organización: ${error.message}`);
  }

  revalidatePath("/admin/organizations");
  revalidatePath("/admin");
  revalidatePath("/admin/users");
  redirect("/admin/organizations?created=1");
}

export async function updateOrganizationAction(formData: FormData) {
  const { user, profile } = await getCurrentProfile();

  if (!user) redirect("/login");
  if (!profile || profile.role !== "admin" || !profile.is_active) {
    redirect("/client");
  }

  const organizationId = String(formData.get("organization_id") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const documentNumber = String(formData.get("document_number") ?? "").trim();
  const subscriptionPlan = normalizeSubscriptionPlan(
    formData.get("subscription_plan")
  );
  const isActive = String(formData.get("is_active") ?? "true").trim() === "true";

  if (!organizationId || !name || !documentNumber || !subscriptionPlan) {
    throw new Error("Todos los campos son obligatorios.");
  }

  const adminClient = createAdminClient();

  const { error } = await adminClient
    .from("organizations")
    .update({
      name,
      document_number: documentNumber,
      subscription_plan: subscriptionPlan,
      is_active: isActive,
    })
    .eq("id", organizationId);

  if (error) {
    throw new Error(`Error actualizando organización: ${error.message}`);
  }

  revalidatePath("/admin/organizations");
  revalidatePath("/admin");
  revalidatePath("/admin/users");
  redirect("/admin/organizations?updated=1");
}