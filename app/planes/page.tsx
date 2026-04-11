export default function PlanesPage() {
  const planes = [
    {
      nombre: "Básico",
      precio: "$49.000/mes",
      descripcion: "Ideal para un titular o unidad de seguimiento inicial.",
    },
    {
      nombre: "Profesional",
      precio: "$99.000/mes",
      descripcion: "Para empresas con mayor número de obligaciones y usuarios.",
    },
    {
      nombre: "Empresarial",
      precio: "A cotizar",
      descripcion: "Para operaciones con múltiples títulos, usuarios y reportes.",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-4xl font-bold">Planes de suscripción</h1>
        <p className="mt-4 max-w-2xl text-slate-300">
          Esta sección mostrará los planes disponibles para acceder al servicio
          de seguimiento de obligaciones.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {planes.map((plan) => (
            <article
              key={plan.nombre}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
            >
              <h2 className="text-2xl font-semibold">{plan.nombre}</h2>
              <p className="mt-3 text-3xl font-bold text-emerald-400">
                {plan.precio}
              </p>
              <p className="mt-4 text-slate-300">{plan.descripcion}</p>
              <button className="mt-6 rounded-xl bg-emerald-500 px-4 py-3 font-semibold text-slate-950">
                Seleccionar plan
              </button>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}