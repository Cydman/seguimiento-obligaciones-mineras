"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentProfile } from "@/modules/auth/get-current-profile";
import type { Database } from "@/types/supabase";

type AppRole = Database["public"]["Enums"]["app_role"];
type MembershipInsert = Database["public"]["Tables"]["memberships"]["Insert"];
type ObligationCategory =
  | "tecnica"
  | "juridica"
  | "economica"
  | "social"
  | "ambiental";

function normalizeText(value: FormDataEntryValue | null) {
  const text = String(value ?? "").trim();
  return text ? text : null;
}

function normalizeOrganizationId(value: FormDataEntryValue | null) {
  const text = String(value ?? "").trim();
  return text ? text : null;
}

function normalizeRole(value: FormDataEntryValue | null): AppRole {
  const text = String(value ?? "client").trim();
  if (text === "admin" || text === "client" || text === "specialist") {
    return text;
  }
  throw new Error("Rol inválido.");
}

function normalizeSpecialty(
  role: AppRole,
  value: FormDataEntryValue | null
): ObligationCategory | null {
  if (role !== "specialist") return null;

  const text = String(value ?? "").trim();
  if (!text) return null;

  if (
    text === "tecnica" ||
    text === "juridica" ||
    text === "economica" ||
    text === "social" ||
    text === "ambiental"
  ) {
    return text;
  }

  throw new Error("Especialidad inválida.");
}

async function syncMembershipsForProfile({
  profileId,
  role,
  organizationId,
  isActive,
}: {
  profileId: string;
  role: AppRole;
  organizationId: string | null;
  isActive: boolean;
}) {
  const adminClient = createAdminClient();

  const { error: deleteError } = await adminClient
    .from("memberships")
    .delete()
    .eq("profile_id", profileId);

  if (deleteError) {
    throw new Error(
      `No fue posible sincronizar membresías previas: ${deleteError.message}`
    );
  }

  if (!organizationId || !isActive || role === "admin") {
    return;
  }

  const membership: MembershipInsert = {
    profile_id: profileId,
    organization_id: organizationId,
    title_id: null,
    role,
    access_scope: "organization",
    is_active: true,
  };

  const { error: insertError } = await adminClient
    .from("memberships")
    .insert(membership);

  if (insertError) {
    throw new Error(
      `Perfil actualizado, pero no fue posible crear la membresía: ${insertError.message}`
    );
  }
}

export async function createUserAccessAction(formData: FormData) {
  const { user, profile } = await getCurrentProfile();

  if (!user) redirect("/login");
  if (!profile || profile.role !== "admin" || !profile.is_active) {
    redirect("/client");
  }

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "").trim();
  const role = normalizeRole(formData.get("role"));
  const organizationId = normalizeOrganizationId(formData.get("organization_id"));
  const isActive = String(formData.get("is_active") ?? "true").trim() === "true";
  const specialty = normalizeSpecialty(role, formData.get("specialty"));
  const fullName = normalizeText(formData.get("full_name"));

  if (!email || !password) {
    throw new Error("Debes ingresar correo y contraseña.");
  }

  const adminClient = createAdminClient();

  const { data, error } = await adminClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: fullName ? { full_name: fullName } : undefined,
  });

  if (error || !data.user) {
    throw new Error(
      `Error creando usuario: ${error?.message ?? "No fue posible crear el usuario."}`
    );
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
      updated_at: new Date().toISOString(),
    })
    .eq("id", data.user.id);

  if (updateError) {
    throw new Error(
      `Usuario creado, pero no fue posible actualizar el perfil: ${updateError.message}`
    );
  }

  await syncMembershipsForProfile({
    profileId: data.user.id,
    role,
    organizationId,
    isActive,
  });

  revalidatePath("/admin/users");
  revalidatePath("/admin");
  redirect("/admin/users?created=1");
}

export async function updateUserProfileAction(formData: FormData) {
  const { user, profile } = await getCurrentProfile();

  if (!user) redirect("/login");
  if (!profile || profile.role !== "admin" || !profile.is_active) {
    redirect("/client");
  }

  const profileId = String(formData.get("profile_id") ?? "").trim();
  const role = normalizeRole(formData.get("role"));
  const organizationId = normalizeOrganizationId(formData.get("organization_id"));
  const isActive = String(formData.get("is_active") ?? "true").trim() === "true";
  const specialty = normalizeSpecialty(role, formData.get("specialty"));
  const fullName = normalizeText(formData.get("full_name"));

  if (!profileId) {
    throw new Error("No se recibió el perfil.");
  }

  if (profileId === user.id && (!isActive || role !== "admin")) {
    throw new Error(
      "No puedes quitarte el rol admin ni desactivar tu propio acceso."
    );
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
      updated_at: new Date().toISOString(),
    })
    .eq("id", profileId);

  if (error) {
    throw new Error(`Error actualizando perfil: ${error.message}`);
  }

  await syncMembershipsForProfile({
    profileId,
    role,
    organizationId,
    isActive,
  });

  revalidatePath("/admin/users");
  revalidatePath("/admin");
  redirect("/admin/users?updated=1");
}