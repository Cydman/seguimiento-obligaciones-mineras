"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentProfile } from "@/modules/auth/get-current-profile";

function normalizeText(value: FormDataEntryValue | null) {
  const text = String(value ?? "").trim();
  return text ? text : null;
}

export async function createTitleAction(formData: FormData) {
  const { user, profile } = await getCurrentProfile();

  if (!user) redirect("/login");
  if (!profile || profile.role !== "admin" || !profile.is_active) {
    redirect("/client");
  }

  const organizationId = String(formData.get("organization_id") ?? "").trim();
  const code = String(formData.get("code") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const mineral = String(formData.get("mineral") ?? "").trim();
  const municipality = String(formData.get("municipality") ?? "").trim();
  const department = String(formData.get("department") ?? "").trim();
  const isActive = String(formData.get("is_active") ?? "true") === "true";

  if (!organizationId || !code || !name || !mineral || !municipality || !department) {
    throw new Error("Los campos básicos del título son obligatorios.");
  }

  const adminClient = createAdminClient();

  const { error } = await adminClient.from("mining_titles").insert({
    organization_id: organizationId,
    code,
    name,
    mineral,
    municipality,
    department,

    holder_name: normalizeText(formData.get("holder_name")),
    holder_identification: normalizeText(formData.get("holder_identification")),
    holder_address: normalizeText(formData.get("holder_address")),
    holder_phone: normalizeText(formData.get("holder_phone")),
    holder_email: normalizeText(formData.get("holder_email")),

    subcontractor_name: normalizeText(formData.get("subcontractor_name")),
    subcontractor_identification: normalizeText(formData.get("subcontractor_identification")),
    subcontractor_address: normalizeText(formData.get("subcontractor_address")),
    subcontractor_phone: normalizeText(formData.get("subcontractor_phone")),
    subcontractor_email: normalizeText(formData.get("subcontractor_email")),

    mine_name: normalizeText(formData.get("mine_name")),
    village: normalizeText(formData.get("village")),
    title_modality: normalizeText(formData.get("title_modality")),
    granted_area: normalizeText(formData.get("granted_area")),
    rmn_registration_date: normalizeText(formData.get("rmn_registration_date")),
    contract_stage: normalizeText(formData.get("contract_stage")),
    subcontract_rmn_registration_date: normalizeText(
      formData.get("subcontract_rmn_registration_date")
    ),
    annuality: normalizeText(formData.get("annuality")),
    is_active: isActive,
  });

  if (error) {
    throw new Error(`Error creando título: ${error.message}`);
  }

  revalidatePath("/admin/titles");
  revalidatePath("/admin");
  revalidatePath("/client");
  redirect("/admin/titles?created=1");
}

export async function updateTitleAction(formData: FormData) {
  const { user, profile } = await getCurrentProfile();

  if (!user) redirect("/login");
  if (!profile || profile.role !== "admin" || !profile.is_active) {
    redirect("/client");
  }

  const titleId = String(formData.get("title_id") ?? "").trim();
  const organizationId = String(formData.get("organization_id") ?? "").trim();
  const code = String(formData.get("code") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const mineral = String(formData.get("mineral") ?? "").trim();
  const municipality = String(formData.get("municipality") ?? "").trim();
  const department = String(formData.get("department") ?? "").trim();
  const isActive = String(formData.get("is_active") ?? "true") === "true";

  if (!titleId || !organizationId || !code || !name || !mineral || !municipality || !department) {
    throw new Error("Los campos básicos del título son obligatorios.");
  }

  const adminClient = createAdminClient();

  const { error } = await adminClient
    .from("mining_titles")
    .update({
      organization_id: organizationId,
      code,
      name,
      mineral,
      municipality,
      department,

      holder_name: normalizeText(formData.get("holder_name")),
      holder_identification: normalizeText(formData.get("holder_identification")),
      holder_address: normalizeText(formData.get("holder_address")),
      holder_phone: normalizeText(formData.get("holder_phone")),
      holder_email: normalizeText(formData.get("holder_email")),

      subcontractor_name: normalizeText(formData.get("subcontractor_name")),
      subcontractor_identification: normalizeText(formData.get("subcontractor_identification")),
      subcontractor_address: normalizeText(formData.get("subcontractor_address")),
      subcontractor_phone: normalizeText(formData.get("subcontractor_phone")),
      subcontractor_email: normalizeText(formData.get("subcontractor_email")),

      mine_name: normalizeText(formData.get("mine_name")),
      village: normalizeText(formData.get("village")),
      title_modality: normalizeText(formData.get("title_modality")),
      granted_area: normalizeText(formData.get("granted_area")),
      rmn_registration_date: normalizeText(formData.get("rmn_registration_date")),
      contract_stage: normalizeText(formData.get("contract_stage")),
      subcontract_rmn_registration_date: normalizeText(
        formData.get("subcontract_rmn_registration_date")
      ),
      annuality: normalizeText(formData.get("annuality")),
      is_active: isActive,
    })
    .eq("id", titleId);

  if (error) {
    throw new Error(`Error actualizando título: ${error.message}`);
  }

  revalidatePath("/admin/titles");
  revalidatePath("/admin");
  revalidatePath("/client");
  redirect("/admin/titles?updated=1");
}