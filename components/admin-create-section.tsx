"use client";

import type { ReactNode } from "react";
import { useState } from "react";

interface AdminCreateSectionProps {
  title: string;
  description?: string;
  buttonLabel?: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

export function AdminCreateSection({
  title,
  description,
  buttonLabel = "Crear",
  children,
  defaultOpen = false,
}: AdminCreateSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className="rounded-2xl border border-slate-800/80 bg-slate-900 p-4">
      <div className="flex flex-col gap-3 border-b border-slate-800 pb-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-semibold">{title}</h2>
          {description ? (
            <p className="mt-1 text-sm text-slate-400">{description}</p>
          ) : null}
        </div>

        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
        >
          {open ? "Ocultar formulario" : buttonLabel}
        </button>
      </div>

      {open ? <div className="mt-4">{children}</div> : null}
    </section>
  );
}