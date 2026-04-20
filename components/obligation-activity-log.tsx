import type { ObligationActivityLog } from "@/types/obligations";

export function ObligationActivityLog({
  logs,
}: {
  logs: ObligationActivityLog[];
}) {
  if (logs.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 text-slate-400">
        No hay actuaciones registradas todavía.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
      <div className="grid grid-cols-[1.2fr_1fr_2fr] gap-4 border-b border-slate-800 bg-slate-800/70 px-5 py-4 text-sm font-semibold text-slate-300">
        <div>Fecha</div>
        <div>Acción</div>
        <div>Detalle</div>
      </div>

      {logs.map((log) => (
        <div
          key={log.id}
          className="grid grid-cols-[1.2fr_1fr_2fr] gap-4 border-t border-slate-800 px-5 py-4 text-sm text-slate-200"
        >
          <div>{log.created_at}</div>
          <div>{log.action}</div>
          <div>{log.note || "-"}</div>
        </div>
      ))}
    </div>
  );
}