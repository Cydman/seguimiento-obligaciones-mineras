import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentProfile } from "@/modules/auth/get-current-profile";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { user, profile } = await getCurrentProfile();

  if (!user || !profile || !profile.is_active) {
    return new NextResponse("No autorizado", { status: 401 });
  }

  const { id } = await context.params;
  const adminClient = createAdminClient();

  const { data: activity, error: activityError } = await adminClient
    .from("obligation_activity_logs")
    .select("id, obligation_id, attachment_path, attachment_name, attachment_mime")
    .eq("id", id)
    .eq("is_system", false)
    .maybeSingle();

  if (activityError || !activity || !activity.attachment_path) {
    return new NextResponse("Archivo no encontrado", { status: 404 });
  }

  const { data: obligation, error: obligationError } = await adminClient
    .from("obligations")
    .select("organization_id, category, assigned_profile_id")
    .eq("id", activity.obligation_id)
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
    .from("obligation-activity-files")
    .download(activity.attachment_path);

  if (downloadError || !fileData) {
    return new NextResponse("No fue posible descargar el archivo", { status: 400 });
  }

  return new NextResponse(fileData, {
    headers: {
      "Content-Type": activity.attachment_mime || "application/pdf",
      "Content-Disposition": `attachment; filename="${encodeURIComponent(
        activity.attachment_name || "archivo.pdf"
      )}"`,
    },
  });
}