import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-6 py-16">
        <div className="max-w-3xl">
          <span className="mb-4 inline-block rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1 text-sm text-emerald-300">
            Plataforma de seguimiento regulatorio minero
          </span>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Sistema web para seguimiento de obligaciones de titulares frente a
            autoridad minera
          </h1>

          <p className="mt-6 text-lg leading-8 text-slate-300">
            Aplicativo diseñado para administrar obligaciones, alertas,
            vencimientos, soportes y control de suscripciones de usuarios.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/login"
              className="rounded-xl bg-emerald-500 px-5 py-3 font-medium text-slate-950 transition hover:bg-emerald-400"
            >
              Ingresar
            </Link>

            <Link
              href="/planes"
              className="rounded-xl border border-slate-700 px-5 py-3 font-medium text-white transition hover:border-slate-500"
            >
              Conocer planes
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}