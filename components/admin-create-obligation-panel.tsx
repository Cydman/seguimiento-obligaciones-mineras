"use client";

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
}

interface AdminCreateObligationPanelProps {
  organizations: OrganizationOption[];
  titles: TitleOption[];
}

export function AdminCreateObligationPanel({
  organizations,
  titles,
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
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white">
            Registro de obligaciones
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Abre este bloque solo cuando necesites crear una obligación nueva.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-emerald-400"
        >
          {open ? "Ocultar formulario" : "Nueva obligación"}
        </button>
      </div>

      {open ? (
        <div className="mt-6">
          <CreateObligationForm
            organizations={organizations}
            titles={titles}
          />
        </div>
      ) : null}
    </div>
  );
}