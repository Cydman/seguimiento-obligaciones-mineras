"use client";

import { ReactNode, useState } from "react";

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
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold">{title}</h2>
          {description ? (
            <p className="mt-2 text-sm text-slate-400">{description}</p>
          ) : null}
        </div>

        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-emerald-400"
        >
          {open ? "Ocultar" : buttonLabel}
        </button>
      </div>

      {open ? <div className="mt-6">{children}</div> : null}
    </div>
  );
}