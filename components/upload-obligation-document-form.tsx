"use client";

import { useSearchParams } from "next/navigation";
import { uploadObligationDocumentAction } from "@/app/admin/actions";
import { SubmitButton } from "@/components/submit-button";

interface UploadObligationDocumentFormProps {
  obligationId: string;
}

export function UploadObligationDocumentForm({
  obligationId,
}: UploadObligationDocumentFormProps) {
  const searchParams = useSearchParams();
  const uploaded = searchParams.get("uploaded") === "1";

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <h2 className="text-lg font-semibold">Cargar documento base</h2>
      <p className="mt-1 text-sm text-slate-400">
        Carga documentos generales en PDF. Tamaño máximo: 10 MB.
      </p>

      <form
        action={uploadObligationDocumentAction}
        encType="multipart/form-data"
        className="mt-4 space-y-4"
      >
        <input type="hidden" name="obligation_id" value={obligationId} />

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Archivo PDF
          </label>
          <input
            name="file"
            type="file"
            accept="application/pdf,.pdf"
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
            required
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <SubmitButton
            idleLabel="Cargar documento"
            pendingLabel="Cargando..."
          />
          {uploaded ? (
            <p className="text-sm text-emerald-300">
              Documento cargado correctamente.
            </p>
          ) : null}
        </div>
      </form>
    </div>
  );
}