"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CreateObligationForm } from "@/components/create-obligation-form";

interface OrganizationOption {
  id: string;
  name: string;
}

interface TitleOption {
  id: string;
  code: string;
  name: string;
  organization_id: string;
  mine_name?: string | null;
  is_active?: boolean;
}

interface AdminCreateObligationPanelProps {
  organizations: OrganizationOption[];
  titles: TitleOption[];
  children: ReactNode;
}

export function AdminCreateObligationPanel({
  organizations,
  titles,
  children,
}: AdminCreateObligationPanelProps) {
  const searchParams = useSearchParams();
  const created = searchParams.get("created") === "1";

  const [open, setOpen] = useState(created);

  useEffect(() => {
    if (created) {
      setOpen(true);
    }
  }, [created]);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
      <div className="flex flex-col gap-3 border-b border-slate-800 pb-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">
            Obligaciones registradas
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Consulta, filtra y administra las obligaciones activas del sistema.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
        >
          {open ? "Ocultar formulario" : "Nueva obligación"}
        </button>
      </div>

      {open ? (
        <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
          <CreateObligationForm
            organizations={organizations}
            titles={titles}
          />
        </div>
      ) : null}

      <div className="mt-4">{children}</div>
    </div>
  );
}