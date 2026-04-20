import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/modules/auth/get-current-profile";

export default async function DashboardRedirectPage() {
  const { user, profile } = await getCurrentProfile();

  if (!user) {
    redirect("/login");
  }

  if (!profile || !profile.is_active) {
    redirect("/login?disabled=1");
  }

  if (profile.role === "admin") {
    redirect("/admin");
  }

  if (profile.role === "specialist") {
    redirect("/specialist");
  }

  redirect("/client");
}