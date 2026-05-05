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
    throw