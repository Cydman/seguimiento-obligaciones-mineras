import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentProfile } from "@/modules/auth/get-current-profile";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { user, profile } = await getCurrentProfile();

  if (!user || !profile || !profile.is_active) {
    return new NextResponse("No autorizado", { status: 401 });
  }

  const url = new URL(request.url);
  const inlineView = url.searchParams.get("view") === "1";

  const { id } = await context.params;
  const adminClient = createAdminClient();

  let query = adminClient
    .from("obligation_documents")
    .select("id, storage_path, file_name, mime_type, organization_id")
    .eq("id", id);

  if (profile.role !== "admin" && profile.organization_id) {
    query = query.eq("organization_id", profile.organization_id);
  }

  const { data: doc, error } = await query.maybeSingle();

  if (error || !doc) {
    return new NextResponse("Documento no encontrado", { status: 404 });
  }

  const { data: fileData, error: downloadError } = await adminClient.storage
    .from("obligation-documents")
    .download(doc.storage_path);

  if (downloadError || !fileData) {
    return new NextResponse("No fue posible descargar el archivo", {
      status: 400,
    });
  }

  return new NextResponse(fileData, {
    headers: {
      "Content-Type": doc.mime_type || "application/octet-stream",
      "Content-Disposition": `${inlineView ? "inline" : "attachment"}; filename="${encodeURIComponent(
        doc.file_name || "documento"
      )}"`,
    },
  });
}