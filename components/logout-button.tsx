"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { createClient } from "@/lib/supabase/client";

export function LogoutButton() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleLogout() {
    startTransition(async () => {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push("/login");
      router.refresh();
    });
  }

  return (
    <button
      onClick={handleLogout}
      disabled={pending}
      className="w-full rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-medium text-white transition hover:border-slate-500 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Cerrando sesión..." : "Cerrar sesión"}
    </button>
  );
}