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