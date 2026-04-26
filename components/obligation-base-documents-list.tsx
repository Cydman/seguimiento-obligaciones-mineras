"use client";

import { Eye, Download, Trash2 } from "lucide-react";
import { formatDateDisplay, formatDateTimeDisplay } from "@/lib/format-date";
import { removeObligationDocumentAction } from "@/app/admin/actions";

interface ObligationBaseDocument {
  id: string;
  obligation_id: string;
  organization_id: string;
  storage_path: string;
  file_name: string;
  mime_type: string | null;
  file_size: number | null;
  uploaded_by: string | null;
  created_at: string;
}

function formatFileSize(size?: number | null) {
  if (!size || size <= 0) return "-";

  const kb = size / 1024;
  if (kb < 1024) return `${kb.toFixed(0)} KB`;

  const mb = kb / 1024;
  return `${mb.toFixed(2)} MB`;
}

export function ObligationBaseDocumentsList({
  documents,
  returnPath,
}: {
  documents: ObligationBaseDocument[];
  returnPath: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">Documentos base</h2>
          <p className="mt-1 text-sm text-slate-400">
            Consulta, visualiza, descarga o elimina los documentos generales de la obligación.
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-300">
          {documents.length} archivo(s)
        </div>
      </div>

      <details open className="rounded-2xl border border-slate-800 bg-slate-950/40">
        <summary className="cursor-pointer list-none border-b border-slate-800 px-4 py-3 text-sm font-semibold text-white">
          Listado visible de documentos base
        </summary>

        {documents.length === 0 ? (
          <div className="px-4 py-6 text-sm text-slate-400">
            No hay documentos base cargados para esta obligación.
          </div>
        ) : (
          <div className="divide-y divide-slate-800">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="grid gap-3 px-4 py-4 xl:grid-cols-[2fr_0.9fr_0.8fr_auto]"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-white">
                    {doc.file_name}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Cargado: {formatDateTimeDisplay(doc.created_at)}
                  </p>
                </div>

                <div className="text-sm text-slate-300">
                  {formatDateDisplay(doc.created_at)}
                </div>

                <div className="text-sm text-slate-300">
                  {formatFileSize(doc.file_size)}
                </div>

                <div className="flex items-center justify-start gap-2 xl:justify-end">
                  <a
                    href={`/api/documents/${doc.id}?view=1`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center rounded-xl border border-slate-700 p-2 text-white transition hover:border-slate-500"
                    title="Ver PDF"
                  >
                    <Eye size={15} />
                  </a>

                  <a
                    href={`/api/documents/${doc.id}`}
                    className="inline-flex items-center justify-center rounded-xl border border-slate-700 p-2 text-white transition hover:border-slate-500"
                    title="Descargar PDF"
                  >
                    <Download size={15} />
                  </a>

                  <form
                    action={removeObligationDocumentAction}
                    onSubmit={(event) => {
                      const confirmed = window.confirm(
                        "¿Deseas eliminar este documento base?"
                      );

                      if (!confirmed) {
                        event.preventDefault();
                      }
                    }}
                  >
                    <input type="hidden" name="document_id" value={doc.id} />
                    <input type="hidden" name="return_path" value={returnPath} />
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center rounded-xl border border-red-500/40 p-2 text-red-300 transition hover:bg-red-500/10"
                      title="Eliminar documento"
                    >
                      <Trash2 size={15} />
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </details>
    </div>
  );
}