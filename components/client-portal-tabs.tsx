"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

type PortalView = "general" | "obligations";

export function ClientPortalTabs({
  currentView,
}: {
  currentView: PortalView;
}) {
  const searchParams = useSearchParams();

  function buildHref(view: PortalView) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("view", view);
    return `/client?${params.toString()}`;
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-1.5">
      <div className="flex flex-wrap gap-2">
        <Link
          href={buildHref("general")}
          className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
            currentView === "general"
              ? "bg-emerald-500 text-slate-950"
              : "border border-slate-700 text-white hover:border-slate-500"
          }`}
        >
          Información general
        </Link>

        <Link
          href={buildHref("obligations")}
          className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
            currentView === "obligations"
              ? "bg-emerald-500 text-slate-950"
              : "border border-slate-700 text-white hover:border-slate-500"
          }`}
        >
          Obligaciones
        </Link>
      </div>
    </div>
  );
}