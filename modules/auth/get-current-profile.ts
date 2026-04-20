import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/types/auth";

export async function getCurrentProfile(): Promise<{
  user: { id: string; email?: string } | null;
  profile: Profile | null;
}> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { user: null, profile: null };
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    throw new Error(`Error consultando perfil: ${error.message}`);
  }

  return {
    user: { id: user.id, email: user.email ?? undefined },
    profile,
  };
}