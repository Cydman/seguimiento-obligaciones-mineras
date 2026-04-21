export const dynamic = "force-dynamic";
export const revalidate = 0;

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type LoginPageProps = {
  searchParams?: Promise<{
    error?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = (await searchParams) ?? {};
  const errorMessage = params.error ? decodeURIComponent(params.error) : "";

  async function loginAction(formData: FormData) {
    "use server";

    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    if (!email || !password) {
      redirect("/login?error=Debe%20ingresar%20correo%20y%20contrase%C3%B1a");
    }

    const supabase = await createClient();

    const { data: authData, error: signInError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (signInError || !authData.user) {
      redirect("/login?error=Credenciales%20inv%C3%A1lidas");
    }
  
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role, is_active")
      .eq("id", authData.user.id)
      .maybeSingle();

    if (profileError || !profile) {
      await supabase.auth.signOut();
      redirect("/login?error=No%20se%20encontr%C3%B3%20el%20perfil%20del%20usuario");
    }

    if (!profile.is_active) {
      await supabase.auth.signOut();
      redirect("/login?error=El%20usuario%20se%20encuentra%20inactivo");
    }

    if (profile.role === "admin") {
      redirect("/admin");
    }

    if (profile.role === "specialist") {
      redirect("/specialist");
    }

    redirect("/client");
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <div className="mx-auto max-w-3xl rounded-[28px] border border-slate-800 bg-slate-900 px-10 py-12 shadow-2xl">
        <h1 className="text-5xl font-bold tracking-tight">Ingreso al sistema</h1>

        <p className="mt-5 max-w-2xl text-2xl leading-relaxed text-slate-300">
          Aquí iniciaremos el acceso de administradores y clientes suscriptores.
        </p>

        {errorMessage ? (
          <div className="mt-6 rounded-2xl border border-red-500/40 bg-red-500/10 px-5 py-4 text-base text-red-200">
            {errorMessage}
          </div>
        ) : null}

        <form action={loginAction} className="mt-10 space-y-7">
          <div>
            <label
              htmlFor="email"
              className="mb-3 block text-2xl font-semibold text-white"
            >
              Correo
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="correo@empresa.com"
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-6 py-5 text-2xl text-white outline-none transition focus:border-emerald-500"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-3 block text-2xl font-semibold text-white"
            >
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              placeholder="********"
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-6 py-5 text-2xl text-white outline-none transition focus:border-emerald-500"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-2xl bg-emerald-500 px-6 py-5 text-2xl font-bold text-slate-950 transition hover:bg-emerald-400"
          >
            Ingresar
          </button>
        </form>
      </div>
    </main>
  );
}