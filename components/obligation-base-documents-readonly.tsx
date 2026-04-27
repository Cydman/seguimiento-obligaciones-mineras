import { Download, Eye } from "lucide-react";
import { formatDateTimeDisplay } from "@/lib/format-date";

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

export function ObligationBaseDocumentsReadonly({
  documents,
}: {
  documents: ObligationBaseDocument[];
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">Documentos base</h2>
          <p className="mt-1 text-sm text-slate-400">
            Consulta los documentos generales asociados a esta obligación.
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-300">
          {documents.length} archivo(s)
        </div>
      </div>

      {documents.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-950/40 px-4 py-5 text-sm text-slate-400">
          No hay documentos base disponibles para esta obligación.
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/40">
          <div className="grid grid-cols-[1.8fr_1fr_0.8fr_auto] gap-3 border-b border-slate-800 bg-slate-800/70 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-300">
            <div>Documento</div>
            <div>Fecha</div>
            <div>Tamaño</div>
            <div>Acciones</div>
          </div>

          <div className="divide-y divide-slate-800">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="grid gap-3 px-4 py-4 xl:grid-cols-[1.8fr_1fr_0.8fr_auto]"
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
                  {formatDateTimeDisplay(doc.created_at)}
                </div>

                <div className="text-sm text-slate-300">
                  {formatFileSize(doc.file_size)}
                </div>

                <div className="flex items-center gap-2 xl:justify-end">
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
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}