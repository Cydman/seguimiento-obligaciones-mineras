import Link from "next/link";
import {
  createManualActivityAction,
  deleteManualActivityAction,
  removeActivityAttachmentAction,
  updateManualActivityAction,
} from "@/app/obligations/activity-actions";
import type { ObligationActivityLog } from "@/types/obligations";
import { Download, Paperclip, Pencil, Save, Trash2 } from "lucide-react";

type PanelRole = "admin" | "specialist" | "client";

function formatDate(value: string, role: PanelRole) {
  const date = new Date(value);

  if (role === "admin") {
    return new Intl.DateTimeFormat("es-CO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  }

  return new Intl.DateTimeFormat("es-CO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

export function ObligationActivityPanel({
  obligationId,
  logs,
  role,
  returnPath,
}: {
  obligationId: string;
  logs: ObligationActivityLog[];
  role: PanelRole;
  returnPath: string;
}) {
  const canCreate = role === "admin" || role === "specialist";
  const canEdit = role === "admin";

  return (
    <div className="space-y-4">
      {canCreate ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
          <h2 className="text-xl font-semibold">Nueva actuación</h2>
          <p className="mt-1 text-xs text-slate-400">PDF opcional.</p>

          <form
            action={createManualActivityAction}
            className="mt-4 grid gap-3 xl:grid-cols-[0.9fr_2fr_1.1fr_auto]"
          >
            <input type="hidden" name="obligation_id" value={obligationId} />
            <input type="hidden" name="return_path" value={returnPath} />

            <input
              name="action"
              required
              placeholder="Acción"
              className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white"
            />

            <input
              name="note"
              required
              placeholder="Detalle de la actuación"
              className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white"
            />

            <input
              name="file"
              type="file"
              accept="application/pdf"
              className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white"
            />

            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-xl bg-emerald-500 px-4 py-3 text-slate-950 transition hover:bg-emerald-400"
              title="Guardar actuación"
            >
              <Save size={16} />
            </button>
          </form>
        </div>
      ) : null}

      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
        <div
          className={`grid gap-3 border-b border-slate-800 bg-slate-800/70 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-300 ${
            canEdit
              ? "grid-cols-[1fr_1fr_2fr_auto_auto]"
              : "grid-cols-[1fr_1fr_2.2fr_auto]"
          }`}
        >
          <div>Fecha</div>
          <div>Acción</div>
          <div>Detalle</div>
          <div>PDF</div>
          {canEdit ? <div>Editar</div> : null}
        </div>

        {logs.length === 0 ? (
          <div className="px-4 py-4 text-sm text-slate-400">
            No hay actuaciones registradas.
          </div>
        ) : (
          logs.map((log) =>
            canEdit ? (
              <details key={log.id} className="border-t border-slate-800">
                <summary className="grid cursor-pointer list-none grid-cols-[1fr_1fr_2fr_auto_auto] gap-3 px-4 py-3 text-sm text-slate-200">
                  <div>{formatDate(log.created_at, role)}</div>
                  <div className="truncate">{log.action}</div>
                  <div className="truncate">{log.note || "-"}</div>
                  <div className="flex items-center gap-2">
                    {log.attachment_path ? (
                      <Link
                        href={`/api/activity-files/${log.id}`}
                        className="inline-flex items-center justify-center rounded-lg border border-slate-700 p-2 text-slate-200 hover:border-slate-500"
                        title="Descargar PDF"
                      >
                        <Download size={14} />
                      </Link>
                    ) : (
                      <span className="text-slate-500">-</span>
                    )}
                  </div>
                  <div className="flex items-center">
                    <span
                      className="inline-flex items-center justify-center rounded-lg border border-slate-700 p-2 text-slate-200"
                      title="Editar"
                    >
                      <Pencil size={14} />
                    </span>
                  </div>
                </summary>

                <div className="border-t border-slate-800 bg-slate-950/40 px-4 py-4">
                  <form
                    action={updateManualActivityAction}
                    className="grid gap-3 xl:grid-cols-[0.9fr_2fr_1.1fr_auto]"
                  >
                    <input type="hidden" name="activity_id" value={log.id} />
                    <input type="hidden" name="obligation_id" value={obligationId} />
                    <input type="hidden" name="return_path" value={returnPath} />

                    <input
                      name="action"
                      defaultValue={log.action}
                      required
                      className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white"
                    />

                    <input
                      name="note"
                      defaultValue={log.note || ""}
                      required
                      className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white"
                    />

                    <input
                      name="file"
                      type="file"
                      accept="application/pdf"
                      className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white"
                    />

                    <button
                      type="submit"
                      className="inline-flex items-center justify-center rounded-xl bg-emerald-500 px-4 py-3 text-slate-950 transition hover:bg-emerald-400"
                      title="Guardar cambios"
                    >
                      <Save size={16} />
                    </button>
                  </form>

                  <div className="mt-3 flex items-center gap-3">
                    {log.attachment_path ? (
                      <>
                        <Link
                          href={`/api/activity-files/${log.id}`}
                          className="inline-flex items-center justify-center rounded-xl border border-slate-700 p-2 text-white"
                          title="Descargar PDF"
                        >
                          <Download size={14} />
                        </Link>

                        <form action={removeActivityAttachmentAction}>
                          <input type="hidden" name="activity_id" value={log.id} />
                          <input type="hidden" name="return_path" value={returnPath} />
                          <button
                            type="submit"
                            className="inline-flex items-center justify-center rounded-xl border border-red-500/40 p-2 text-red-300"
                            title="Eliminar PDF"
                          >
                            <Paperclip size={14} />
                          </button>
                        </form>
                      </>
                    ) : (
                      <span className="text-xs text-slate-400">Sin PDF adjunto</span>
                    )}

                    <form action={deleteManualActivityAction}>
                      <input type="hidden" name="activity_id" value={log.id} />
                      <input type="hidden" name="return_path" value={returnPath} />
                      <button
                        type="submit"
                        className="inline-flex items-center justify-center rounded-xl border border-red-500/40 p-2 text-red-300"
                        title="Eliminar actuación"
                      >
                        <Trash2 size={14} />
                      </button>
                    </form>
                  </div>
                </div>
              </details>
            ) : (
              <div
                key={log.id}
                className="grid grid-cols-[1fr_1fr_2.2fr_auto] gap-3 border-t border-slate-800 px-4 py-3 text-sm text-slate-200"
              >
                <div>{formatDate(log.created_at, role)}</div>
                <div className="truncate">{log.action}</div>
                <div className="truncate">{log.note || "-"}</div>
                <div className="flex items-center">
                  {log.attachment_path ? (
                    <Link
                      href={`/api/activity-files/${log.id}`}
                      className="inline-flex items-center justify-center rounded-lg border border-slate-700 p-2 text-slate-200 hover:border-slate-500"
                      title="Descargar PDF"
                    >
                      <Download size={14} />
                    </Link>
                  ) : (
                    <span className="text-slate-500">-</span>
                  )}
                </div>
              </div>
            )
          )
        )}
      </div>
    </div>
  );
}