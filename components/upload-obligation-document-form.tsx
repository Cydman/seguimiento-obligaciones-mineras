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
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <h2 className="text-2xl font-semibold">Cargar documento</h2>

      <form action={uploadObligationDocumentAction} className="mt-6 space-y-4">
        <input type="hidden" name="obligation_id" value={obligationId} />

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Archivo
          </label>
          <input
            name="file"
            type="file"
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
            required
          />
        </div>

        <div className="flex items-center gap-4">
          <SubmitButton />
          {uploaded ? (
            <p className="text-sm text-slate-300">
              Documento cargado correctamente.
            </p>
          ) : null}
        </div>
      </form>
    </div>
  );
}