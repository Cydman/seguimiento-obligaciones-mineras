"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentProfile } from "@/modules/auth/get-current-profile";

function normalizeText(value: FormDataEntryValue | null) {
  const text = String(value ?? "").trim();
  return text ? text : null;
}

function normalizeOrganizationId(value: FormDataEntryValue | null) {
  const text = String(value ?? "").trim();
  return text ? text : null;
}

function normalizeSpecialty(role: string, value: FormDataEntryValue | null) {
  if (role !== "specialist") return null;
  const text = String(value ?? "").trim();
  return text ? text : null;
}

export async function createUserAccessAction(formData: FormData) {
  const { user, profile } = await getCurrentProfile();

  if (!user) redirect("/login");
  if (!profile || profile.role !== "admin" || !profile.is_active) {
    redirect("/client");
  }

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "").trim();
  const role = String(formData.get("role") ?? "client").trim();
  const organizationId = normalizeOrganizationId(formData.get("organization_id"));
  const isActive = String(formData.get("is_active") ?? "true").trim() === "true";
  const specialty = normalizeSpecialty(role, formData.get("specialty"));
  const fullName = normalizeText(formData.get("full_name"));

  if (!email || !password) {
    throw new Error("Debes ingresar correo y contraseña.");
  }

  if (!["admin", "client", "specialist"].includes(role)) {
    throw new Error("Rol inválido.");
  }

  const adminClient = createAdminClient();

  const { data, error } = await adminClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error || !data.user) {
    throw new Error(`Error creando usuario: ${error?.message ?? "No fue posible crear el usuario."}`);
  }

  const { error: updateError } = await adminClient
    .from("profiles")
    .update({
      role,
      organization_id: organizationId,
      is_active: isActive,
      email,
      specialty,
      full_name: fullName,
    })
    .eq("id", data.user.id);

  if (updateError) {
    throw new Error(`Usuario creado, pero no fue posible actualizar el perfil: ${updateError.message}`);
  }

  revalidatePath("/admin/users");
  redirect("/admin/users?created=1");
}

export async function updateUserProfileAction(formData: FormData) {
  const { user, profile } = await getCurrentProfile();

  if (!user) redirect("/login");
  if (!profile || profile.role !== "admin" || !profile.is_active) {
    redirect("/client");
  }

  const profileId = String(formData.get("profile_id") ?? "").trim();
  const role = String(formData.get("role") ?? "client").trim();
  const organizationId = normalizeOrganizationId(formData.get("organization_id"));
  const isActive = String(formData.get("is_active") ?? "true").trim() === "true";
  const specialty = normalizeSpecialty(role, formData.get("specialty"));
  const fullName = normalizeText(formData.get("full_name"));

  if (!profileId) {
    throw new Error("No se recibió el perfil.");
  }

  if (!["admin", "client", "specialist"].includes(role)) {
    throw new Error("Rol inválido.");
  }

  if (profileId === user.id && (!isActive || role !== "admin")) {
    throw new Error("No puedes quitarte el rol admin ni desactivar tu propio acceso.");
  }

  const adminClient = createAdminClient();

  const { error } = await adminClient
    .from("profiles")
    .update({
      role,
      organization_id: organizationId,
      is_active: isActive,
      specialty,
      full_name: fullName,
    })
    .eq("id", profileId);

  if (error) {
    throw new Error(`Error actualizando perfil: ${error.message}`);
  }

  revalidatePath("/admin/users");
  redirect("/admin/users?updated=1");
}