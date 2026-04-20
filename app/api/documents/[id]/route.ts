import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/modules/auth/get-current-profile";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { user, profile } = await getCurrentProfile();

  if (!user || !profile) {
    return new NextResponse("No autorizado", { status: 401 });
  }

  const { id } = await context.params;
  const supabase = await createClient();

  let query = supabase
    .from("obligation_documents")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (profile.role !== "admin" && profile.organization_id) {
    query = query.eq("organization_id", profile.organization_id);
  }

  const { data: doc, error } = await query;

  if (error || !doc) {
    return new NextResponse("Documento no encontrado", { status: 404 });
  }

  const { data: fileData, error: downloadError } = await supabase.storage
    .from("obligation-documents")
    .download(doc.storage_path);

  if (downloadError || !fileData) {
    return new NextResponse("No fue posible descargar el archivo", { status: 400 });
  }

  return new NextResponse(fileData, {
    headers: {
      "Content-Type": doc.mime_type || "application/octet-stream",
      "Content-Disposition": `attachment; filename="${encodeURIComponent(doc.file_name)}"`,
    },
  });
}