"use client";

import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { MiningTitleRecord } from "@/types/titles";

export function ClientTitleSelector({
  titles,
  selectedTitle,
}: {
  titles: MiningTitleRecord[];
  selectedTitle?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const sortedTitles = useMemo(
    () =>
      [...titles].sort((a, b) => a.code.localeCompare(b.code, "es-CO")),
    [titles]
  );

  if (sortedTitles.length === 1) {
    const onlyTitle = sortedTitles[0];

    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900 px-5 py-4">
        <p className="text-sm font-medium text-slate-400">Placa del título</p>
        <p className="mt-2 text-2xl font-semibold text-white">
          {onlyTitle.code}
        </p>
        <p className="mt-1 text-sm text-slate-300">
          {onlyTitle.mine_name || onlyTitle.name}
        </p>
      </div>
    );
  }

  function handleChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("title", value);

    if (!params.get("view")) {
      params.set("view", "general");
    }

    router.push(`/client?${params.toString()}`);
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 px-5 py-4">
      <div className="flex flex-col gap-1 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-400">
            Placa del título
          </label>
          <p className="text-xs text-slate-500">
            Este es el filtro principal para consultar la información del cliente.
          </p>
        </div>

        <p className="text-sm text-slate-400">
          {sortedTitles.length} título(s) disponible(s)
        </p>
      </div>

      <select
        value={selectedTitle}
        onChange={(e) => handleChange(e.target.value)}
        className="mt-3 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-500"
      >
        {sortedTitles.map((title) => (
          <option key={title.id} value={title.id}>
            {title.code} - {title.mine_name || title.name}
          </option>
        ))}
      </select>
    </div>
  );
}