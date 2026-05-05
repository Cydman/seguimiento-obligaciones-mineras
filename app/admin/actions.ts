"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

import { getCurrentProfile } from "@/modules/auth/get-current-profile";
import { logObligationActivity } from "@/modules/obligations/log-obligation-activity";

/* =========================================================
   UTILIDADES
========================================================= */

function sanitizeFileName(name: string) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9.\-_]/g, "_")
    .toLowerCase();
}

/* =========================================================
   SUBIR DOCUMENTO BASE (PDF)
========================================================= */

export async function uploadObligationDocumentAction(formData: FormData) {
  const { user, profile } = await getCurrentProfile();

  if (!user) redirect("/login");

  if (!profile || profile.role !== "admin" || !profile.is_active) {
    redirect("/client");
  }

  const obligationId = String(formData.get("obligation_id") ?? "").trim();
  const file = formData.get("file") as File | null;

  if (!obligationId) {
    throw new Error("No se recibió la obligación.");
  }

  if (!file || file.size === 0) {
    throw new Error("Debes seleccionar un archivo.");
  }

  /* ================= VALIDACIONES ================= */

  if (
    file.type !== "application/pdf" &&
    !file.name.toLowerCase().endsWith(".pdf")
  ) {
    throw new Error("Solo se permiten archivos PDF.");
  }

  if (file.size > 10 * 1024 * 1024) {
    throw new Error("El archivo no puede superar 10 MB.");
  }

  /* ================= CLIENTES ================= */

  const supabase = await createClient();
  const adminClient = createAdminClient();

  /* ================= VALIDAR OBLIGACIÓN ================= */

  const { data: obligation, error: obligationError } = await supabase
    .from("obligations")
    .select("id, organization_id")
    .eq("id", obligationId)
    .maybeSingle();

  if (obligationError || !obligation) {
    throw new Error("No fue posible identificar la obligación.");
  }

  /* ================= SUBIR A STORAGE ================= */

  const safeName = sanitizeFileName(file.name);
  const storagePath = `${obligationId}/${Date.now()}-${safeName}`;

  const { error: uploadError } = await supabase.storage
    .from("obligation-documents")
    .upload(storagePath, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: "application/pdf",
    });

  if (uploadError) {
    throw new Error(`Error subiendo archivo: ${uploadError.message}`);
  }

  /* ================= GUARDAR EN BD ================= */

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

  /* ================= LOG DE ACTIVIDAD ================= */

  await logObligationActivity({
    obligationId,
    actorProfileId: user.id,
    action: "document_uploaded",
    note: "Documento base cargado en la obligación.",
    payload: {
      file_name: file.name,
      file_size: file.size,
    },
  });

  /* ================= REFRESH UI ================= */

  revalidatePath(`/admin/obligations/${obligationId}`);
  revalidatePath(`/client/obligations/${obligationId}`);

  redirect(`/admin/obligations/${obligationId}?uploaded=1`);
}

/* =========================================================
   ELIMINAR DOCUMENTO
========================================================= */

export async function deleteObligationDocumentAction(formData: FormData) {
  const { user, profile } = await getCurrentProfile();

  if (!user) redirect("/login");

  if (!profile || profile.role !== "admin") {
    redirect("/client");
  }

  const documentId = String(formData.get("document_id") ?? "");

  const adminClient = createAdminClient();

  const { data: doc, error } = await adminClient
    .from("obligation_documents")
    .select("*")
    .eq("id", documentId)
    .maybeSingle();

  if (error || !doc) {
    throw new Error("Documento no encontrado.");
  }

  /* eliminar archivo físico */
  await adminClient.storage
    .from("obligation-documents")
    .remove([doc.storage_path]);

  /* eliminar registro */
  await adminClient
    .from("obligation_documents")
    .delete()
    .eq("id", documentId);

  await logObligationActivity({
    obligationId: doc.obligation_id,
    actorProfileId: user.id,
    action: "document_deleted",
    note: `Documento eliminado: ${doc.file_name}`,
  });

  revalidatePath(`/admin/obligations/${doc.obligation_id}`);

  redirect(`/admin/obligations/${doc.obligation_id}`);
}

/* =========================================================
   CREAR ACTUACIÓN (HISTORIAL)
========================================================= */

export async function createActivityAction(formData: FormData) {
  const { user } = await getCurrentProfile();

  if (!user) redirect("/login");

  const obligationId = String(formData.get("obligation_id") ?? "");
  const action = String(formData.get("action") ?? "");
  const note = String(formData.get("note") ?? "");

  if (!obligationId || !action) {
    throw new Error("Datos incompletos.");
  }

  await logObligationActivity({
    obligationId,
    actorProfileId: user.id,
    action,
    note,
  });

  revalidatePath(`/admin/obligations/${obligationId}`);

  redirect(`/admin/obligations/${obligationId}`);
}