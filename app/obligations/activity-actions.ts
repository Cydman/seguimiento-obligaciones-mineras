"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentProfile } from "@/modules/auth/get-current-profile";

function sanitizeFileName(fileName: string) {
  return fileName
    .normalize("NFKD")
    .replace(/[^\w.\-]+/g, "_")
    .replace(/_+/g, "_");
}

function withFlag(path: string, flag: string) {
  return path.includes("?") ? `${path}&${flag}=1` : `${path}?${flag}=1`;
}

function canManageRole(role: string) {
  return role === "admin" || role === "specialist";
}

async function getManageableObligation({
  obligationId,
  role,
  profileId,
  specialty,
}: {
  obligationId: string;
  role: string;
  profileId: string;
  specialty: string | null;
}) {
  const adminClient = createAdminClient();

  const { data: obligation, error } = await adminClient
    .from("obligations")
    .select("id, category, assigned_profile_id")
    .eq("id", obligationId)
    .eq("is_active", true)
    .maybeSingle();

  if (error || !obligation) {
    throw new Error("No fue posible identificar la obligación.");
  }

  const allowed =
    role === "admin" ||
    (role === "specialist" &&
      (specialty === obligation.category ||
        obligation.assigned_profile_id === profileId));

  if (!allowed) {
    throw new Error("No tienes permisos para gestionar esta obligación.");
  }

  return obligation;
}

export async function createManualActivityAction(formData: FormData) {
  const { user, profile } = await getCurrentProfile();

  if (!user) redirect("/login");
  if (!profile || !profile.is_active || !canManageRole(profile.role)) {
    redirect("/client");
  }

  const obligationId = String(formData.get("obligation_id") ?? "").trim();
  const action = String(formData.get("action") ?? "").trim();
  const note = String(formData.get("note") ?? "").trim();
  const returnPath = String(formData.get("return_path") ?? "").trim() || "/admin";
  const file = formData.get("file") as File | null;

  if (!obligationId || !action || !note) {
    throw new Error("Debes diligenciar la acción y el detalle.");
  }

  await getManageableObligation({
    obligationId,
    role: profile.role,
    profileId: profile.id,
    specialty: profile.specialty,
  });

  let attachment:
    | {
        attachment_path: string;
        attachment_name: string;
        attachment_mime: string | null;
        attachment_size: number;
      }
    | undefined;

  const adminClient = createAdminClient();
  const activityId = crypto.randomUUID();

  if (file && file.size > 0) {
    if (!file.name.toLowerCase().endsWith(".pdf")) {
      throw new Error("Solo se permiten archivos PDF.");
    }

    if (file.size > 10 * 1024 * 1024) {
      throw new Error("El PDF no puede superar 10 MB.");
    }

    const safeName = sanitizeFileName(file.name);
    const storagePath = `${obligationId}/${activityId}-${safeName}`;

    const { error: uploadError } = await adminClient.storage
      .from("obligation-activity-files")
      .upload(storagePath, file, {
        contentType: "application/pdf",
        upsert: false,
      });

    if (uploadError) {
      throw new Error(`Error cargando PDF: ${uploadError.message}`);
    }

    attachment = {
      attachment_path: storagePath,
      attachment_name: file.name,
      attachment_mime: file.type || "application/pdf",
      attachment_size: file.size,
    };
  }

  const { error } = await adminClient.from("obligation_activity_logs").insert({
    id: activityId,
    obligation_id: obligationId,
    actor_profile_id: user.id,
    action,
    note,
    payload: null,
    is_system: false,
    updated_by: user.id,
    ...(attachment ?? {}),
  });

  if (error) {
    throw new Error(`Error guardando actuación: ${error.message}`);
  }

  revalidatePath(returnPath);
  redirect(withFlag(returnPath, "activity_saved"));
}

export async function updateManualActivityAction(formData: FormData) {
  const { user, profile } = await getCurrentProfile();

  if (!user) redirect("/login");
  if (!profile || !profile.is_active || profile.role !== "admin") {
    redirect("/client");
  }

  const activityId = String(formData.get("activity_id") ?? "").trim();
  const obligationId = String(formData.get("obligation_id") ?? "").trim();
  const action = String(formData.get("action") ?? "").trim();
  const note = String(formData.get("note") ?? "").trim();
  const returnPath = String(formData.get("return_path") ?? "").trim() || "/admin";
  const file = formData.get("file") as File | null;

  if (!activityId || !obligationId || !action || !note) {
    throw new Error("Debes diligenciar la acción y el detalle.");
  }

  await getManageableObligation({
    obligationId,
    role: profile.role,
    profileId: profile.id,
    specialty: profile.specialty,
  });

  const adminClient = createAdminClient();

  const { data: current, error: currentError } = await adminClient
    .from("obligation_activity_logs")
    .select("attachment_path")
    .eq("id", activityId)
    .eq("is_system", false)
    .maybeSingle();

  if (currentError) {
    throw new Error(`Error consultando actuación: ${currentError.message}`);
  }

  const updatePayload: Record<string, unknown> = {
    action,
    note,
    updated_at: new Date().toISOString(),
    updated_by: user.id,
  };

  if (file && file.size > 0) {
    if (!file.name.toLowerCase().endsWith(".pdf")) {
      throw new Error("Solo se permiten archivos PDF.");
    }

    if (file.size > 10 * 1024 * 1024) {
      throw new Error("El PDF no puede superar 10 MB.");
    }

    if (current?.attachment_path) {
      await adminClient.storage
        .from("obligation-activity-files")
        .remove([current.attachment_path]);
    }

    const safeName = sanitizeFileName(file.name);
    const storagePath = `${obligationId}/${activityId}-${safeName}`;

    const { error: uploadError } = await adminClient.storage
      .from("obligation-activity-files")
      .upload(storagePath, file, {
        contentType: "application/pdf",
        upsert: true,
      });

    if (uploadError) {
      throw new Error(`Error reemplazando PDF: ${uploadError.message}`);
    }

    updatePayload.attachment_path = storagePath;
    updatePayload.attachment_name = file.name;
    updatePayload.attachment_mime = file.type || "application/pdf";
    updatePayload.attachment_size = file.size;
  }

  const { error } = await adminClient
    .from("obligation_activity_logs")
    .update(updatePayload)
    .eq("id", activityId)
    .eq("is_system", false);

  if (error) {
    throw new Error(`Error actualizando actuación: ${error.message}`);
  }

  revalidatePath(returnPath);
  redirect(withFlag(returnPath, "activity_updated"));
}

export async function removeActivityAttachmentAction(formData: FormData) {
  const { user, profile } = await getCurrentProfile();

  if (!user) redirect("/login");
  if (!profile || !profile.is_active || profile.role !== "admin") {
    redirect("/client");
  }

  const activityId = String(formData.get("activity_id") ?? "").trim();
  const returnPath = String(formData.get("return_path") ?? "").trim() || "/admin";

  if (!activityId) {
    throw new Error("No se recibió la actuación.");
  }

  const adminClient = createAdminClient();

  const { data: current, error: currentError } = await adminClient
    .from("obligation_activity_logs")
    .select("attachment_path")
    .eq("id", activityId)
    .eq("is_system", false)
    .maybeSingle();

  if (currentError) {
    throw new Error(`Error consultando actuación: ${currentError.message}`);
  }

  if (current?.attachment_path) {
    await adminClient.storage
      .from("obligation-activity-files")
      .remove([current.attachment_path]);
  }

  const { error } = await adminClient
    .from("obligation_activity_logs")
    .update({
      attachment_path: null,
      attachment_name: null,
      attachment_mime: null,
      attachment_size: null,
      updated_at: new Date().toISOString(),
      updated_by: user.id,
    })
    .eq("id", activityId)
    .eq("is_system", false);

  if (error) {
    throw new Error(`Error eliminando PDF: ${error.message}`);
  }

  revalidatePath(returnPath);
  redirect(withFlag(returnPath, "attachment_removed"));
}

export async function deleteManualActivityAction(formData: FormData) {
  const { user, profile } = await getCurrentProfile();

  if (!user) redirect("/login");
  if (!profile || !profile.is_active || profile.role !== "admin") {
    redirect("/client");
  }

  const activityId = String(formData.get("activity_id") ?? "").trim();
  const returnPath = String(formData.get("return_path") ?? "").trim() || "/admin";

  if (!activityId) {
    throw new Error("No se recibió la actuación.");
  }

  const adminClient = createAdminClient();

  const { data: current, error: currentError } = await adminClient
    .from("obligation_activity_logs")
    .select("attachment_path")
    .eq("id", activityId)
    .eq("is_system", false)
    .maybeSingle();

  if (currentError) {
    throw new Error(`Error consultando actuación: ${currentError.message}`);
  }

  if (current?.attachment_path) {
    await adminClient.storage
      .from("obligation-activity-files")
      .remove([current.attachment_path]);
  }

  const { error } = await adminClient
    .from("obligation_activity_logs")
    .delete()
    .eq("id", activityId)
    .eq("is_system", false);

  if (error) {
    throw new Error(`Error eliminando actuación: ${error.message}`);
  }

  revalidatePath(returnPath);
  redirect(withFlag(returnPath, "activity_deleted"));
}