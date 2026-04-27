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

  const { data: doc, error: docError } = await adminClient
    .from("obligation_documents")
    .select("id, obligation_id, storage_path, file_name, mime_type, organization_id")
    .eq("id", id)
    .maybeSingle();

  if (docError || !doc) {
    return new NextResponse("Documento no encontrado", { status: 404 });
  }

  const { data: obligation, error: obligationError } = await adminClient
    .from("obligations")
    .select("organization_id, category, assigned_profile_id")
    .eq("id", doc.obligation_id)
    .maybeSingle();

  if (obligationError || !obligation) {
    return new NextResponse("Obligación no encontrada", { status: 404 });
  }

  const canAccess =
    profile.role === "admin" ||
    (profile.role === "client" &&
      profile.organization_id === obligation.organization_id) ||
    (profile.role === "specialist" &&
      (profile.specialty === obligation.category ||
        obligation.assigned_profile_id === profile.id));

  if (!canAccess) {
    return new NextResponse("No autorizado", { status: 403 });
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
      "Content-Type": doc.mime_type || "application/pdf",
      "Content-Disposition": `${inlineView ? "inline" : "attachment"}; filename="${encodeURIComponent(
        doc.file_name || "documento.pdf"
      )}"`,
    },
  });
}