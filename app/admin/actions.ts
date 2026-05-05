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

async function logObligationActivity({
  obligationId,
  actorProfileId,
  action,
  note,
  payload,
}: {
  obligationId: string;
  actorProfileId: string;
  action: string;
  note?: string | null;
  payload?: Record<string, unknown> | null;
}) {
  const adminClient = createAdminClient();

  await adminClient.from("obligation_activity_logs").insert({
    obligation_id: obligationId,
    actor_profile_id: actorProfileId,
    action,
    note: note ?? null,
    payload: payload ?? null,
    is_system: true,
  });
}

export async function createObligationAction(formData: FormData) {
  const { user, profile } = await getCurrentProfile();

  if (!user) redirect("/login");
  if (!profile || profile.role !== "admin" || !profile.is_active) {
    redirect("/client");
  }

  const organizationId = String(formData.get("organization_id") ?? "").trim();
  const titleId = String(formData.get("title_id") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const authority = String(formData.get("authority") ?? "").trim();
  const priority = String(formData.get("priority") ?? "").trim();
  const status = String(formData.get("status") ?? "").trim();
  const dueDate = String(formData.get("due_date") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const legalBasis = String(formData.get("legal_basis") ?? "").trim();

  if (
    !organizationId ||
    !titleId ||
    !category ||
    !name ||
    !authority ||
    !priority ||
    !status ||
    !dueDate ||
    !description
  ) {
    throw new Error("Todos los campos obligatorios deben estar diligenciados.");
  }

  const adminClient = createAdminClient();

  const { data: codeData, error: codeError } = await adminClient.rpc(
    "generate_obligation_code",
    { cat: category }
  );

  if (codeError || !codeData) {
    throw new Error("No fue posible generar el código automático de la obligación.");
  }

  const { data: inserted, error } = await adminClient
    .from("obligations")
    .insert({
      organization_id: organizationId,
      title_id: titleId,
      code: codeData,
      name,
      authority,
      priority,
      status,
      category,
      due_date: dueDate,
      description,
      legal_basis: legalBasis || null,
      created_by: user.id,
      updated_by: user.id,
    })
    .select("id, code")
    .single();

  if (error || !inserted) {
    throw new Error(`Error al guardar la obligación: ${error?.message}`);
  }

  await logObligationActivity({
    obligationId: inserted.id,
    actorProfileId: user.id,
    action: "created",
    note: "Obligación creada desde el panel administrativo.",
    payload: {
      code: inserted.code,
      category,
      authority,
      priority,
      status,
    },
  });

  revalidatePath("/admin");
  redirect("/admin?created=1");
}

export async function updateObligationAction(formData: FormData) {
  const { user, profile } = await getCurrentProfile();

  if (!user) redirect("/login");
  if (!profile || profile.role !== "admin" || !profile.is_active) {
    redirect("/client");
  }

  const obligationId = String(formData.get("obligation_id") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const authority = String(formData.get("authority") ?? "").trim();
  const priority = String(formData.get("priority") ?? "").trim();
  const status = String(formData.get("status") ?? "").trim();
  const dueDate = String(formData.get("due_date") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const legalBasis = String(formData.get("legal_basis") ?? "").trim();
  const assignedProfileId = String(formData.get("assigned_profile_id") ?? "").trim();

  if (
    !obligationId ||
    !category ||
    !name ||
    !authority ||
    !priority ||
    !status ||
    !dueDate ||
    !description
  ) {
    throw new Error("Debes diligenciar todos los campos obligatorios.");
  }

  const adminClient = createAdminClient();

  const { error } = await adminClient
    .from("obligations")
    .update({
      category,
      name,
      authority,
      priority,
      status,
      due_date: dueDate,
      description,
      legal_basis: legalBasis || null,
      assigned_profile_id: assignedProfileId || null,
      updated_by: user.id,
    })
    .eq("id", obligationId);

  if (error) {
    throw new Error(`Error actualizando la obligación: ${error.message}`);
  }

  await logObligationActivity({
    obligationId,
    actorProfileId: user.id,
    action: "updated",
    note: "Obligación actualizada desde el detalle administrativo.",
    payload: {
      category,
      authority,
      priority,
      status,
      due_date: dueDate,
      assigned_profile_id: assignedProfileId || null,
    },
  });

  revalidatePath(`/admin/obligations/${obligationId}`);
  revalidatePath("/admin");
  redirect(`/admin/obligations/${obligationId}?updated=1`);
}

export async function deactivateObligationAction(formData: FormData) {
  const { user, profile } = await getCurrentProfile();

  if (!user) redirect("/login");
  if (!profile || profile.role !== "admin" || !profile.is_active) {
    redirect("/client");
  }

  const obligationId = String(formData.get("obligation_id") ?? "").trim();
  const deleteReason = String(formData.get("delete_reason") ?? "").trim();
  const confirmationText = String(formData.get("confirmation_text") ?? "").trim();

  if (!obligationId) {
    throw new Error("No se recibió la obligación a anular.");
  }

  if (!deleteReason) {
    throw new Error("Debes indicar el motivo de anulación.");
  }

  if (confirmationText !== "ANULAR") {
    throw new Error('Debes escribir exactamente "ANULAR" para confirmar.');
  }

  const adminClient = createAdminClient();

  const { error } = await adminClient
    .from("obligations")
    .update({
      is_active: false,
      deleted_at: new Date().toISOString(),
      deleted_by: user.id,
      delete_reason: deleteReason,
      updated_by: user.id,
    })
    .eq("id", obligationId)
    .eq("is_active", true);

  if (error) {
    throw new Error(`Error al anular la obligación: ${error.message}`);
  }

  await logObligationActivity({
    obligationId,
    actorProfileId: user.id,
    action: "deactivated",
    note: deleteReason,
    payload: null,
  });

  revalidatePath("/admin");
  redirect("/admin?deleted=1");
}

export async function uploadObligationDocumentAction(formData: FormData) {
  const { user, profile } = await getCurrentProfile();

  if (!user) redirect("/login");
  if (!profile || profile.role !== "admin" || !profile.is_active) {
    redirect("/client");
  }

  console.log("UPLOAD ENV CHECK", {
    hasUrl: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
    hasServiceRoleKey: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
  });

  const obligationId = String(formData.get("obligation_id") ?? "").trim();
  const file = formData.get("file") as File | null;

  console.log("UPLOAD DOC DEBUG", {
    obligationId,
    fileName: file?.name,
    fileType: file?.type,
    fileSize: file?.size,
  });

  if (!obligationId) {
    throw new Error("No se recibió la obligación.");
  }

  if (!file || file.size === 0) {
    throw new Error("Debes seleccionar un archivo.");
  }

  if (
    file.type !== "application/pdf" &&
    !file.name.toLowerCase().endsWith(".pdf")
  ) {
    throw new Error("Solo se permiten archivos PDF.");
  }

  if (file.size > 10 * 1024 * 1024) {
    throw new Error("El archivo no puede superar 10 MB.");
  }

  const adminClient = createAdminClient();

  const { data: obligation, error: obligationError } = await adminClient
    .from("obligations")
    .select("id, organization_id")
    .eq("id", obligationId)
    .maybeSingle();

  if (obligationError || !obligation) {
    throw new Error("No fue posible identificar la obligación.");
  }

  const safeName = sanitizeFileName(file.name);
  const storagePath = `${obligationId}/${Date.now()}-${safeName}`;

  const { error: uploadError } = await adminClient.storage
    .from("obligation-documents")
    .upload(storagePath, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: "application/pdf",
    });

  if (uploadError) {
    throw new Error(`Error subiendo archivo: ${uploadError.message}`);
  }

  const { error: insertError } = await adminClient
    .from("obligation_documents")
    .insert({
      obligation_id: obligationId,
      organization_id: obligation.organization_id,
      storage_path: storagePath,
      file_name: file.name,
      mime_type: "application/pdf",
      file_size: file.size,
      uploaded_by: user.id,
    });

  if (insertError) {
    throw new Error(`Error registrando documento: ${insertError.message}`);
  }

  await logObligationActivity({
    obligationId,
    actorProfileId: user.id,
    action: "document_uploaded",
    note: "Documento base cargado en la obligación.",
    payload: {
      file_name: file.name,
      file_size: file.size,
      mime_type: "application/pdf",
    },
  });

  revalidatePath(`/admin/obligations/${obligationId}`);
  revalidatePath(`/client/obligations/${obligationId}`);
  redirect(`/admin/obligations/${obligationId}?uploaded=1`);
}

export async function removeObligationDocumentAction(formData: FormData) {
  const { user, profile } = await getCurrentProfile();

  if (!user) redirect("/login");
  if (!profile || profile.role !== "admin" || !profile.is_active) {
    redirect("/client");
  }

  const documentId = String(formData.get("document_id") ?? "").trim();
  const returnPath = String(formData.get("return_path") ?? "").trim() || "/admin";

  if (!documentId) {
    throw new Error("No se recibió el documento.");
  }

  const adminClient = createAdminClient();

  const { data: current, error: currentError } = await adminClient
    .from("obligation_documents")
    .select("id, obligation_id, storage_path, file_name")
    .eq("id", documentId)
    .maybeSingle();

  if (currentError || !current) {
    throw new Error("No fue posible identificar el documento.");
  }

  const { error: removeError } = await adminClient.storage
    .from("obligation-documents")
    .remove([current.storage_path]);

  if (removeError) {
    throw new Error(`Error eliminando archivo del storage: ${removeError.message}`);
  }

  const { error: deleteError } = await adminClient
    .from("obligation_documents")
    .delete()
    .eq("id", documentId);

  if (deleteError) {
    throw new Error(`Error eliminando documento: ${deleteError.message}`);
  }

  await logObligationActivity({
    obligationId: current.obligation_id,
    actorProfileId: user.id,
    action: "document_deleted",
    note: "Documento base eliminado de la obligación.",
    payload: {
      file_name: current.file_name,
    },
  });

  revalidatePath(returnPath);
  redirect(withFlag(returnPath, "document_deleted"));
}