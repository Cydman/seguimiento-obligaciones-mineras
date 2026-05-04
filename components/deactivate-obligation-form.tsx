"use client";

import { useState } from "react";
import { deactivateObligationAction } from "@/app/admin/actions";

interface DeactivateObligationFormProps {
  obligationId: string;
  obligationCode: string;
}

export function DeactivateObligationForm({
  obligationId,
  obligationCode,
}: DeactivateObligationFormProps) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-xl border border-red-500/40 px-3 py-2 text-sm font-medium text-red-300 transition hover:bg-red-500/10"
        >
          Anular
        </button>
      ) : (
        <form
          action={deactivateObligationAction}
          className="space-y-3 rounded-2xl border border-slate-700 bg-slate-950 p-4"
        >
          <input type="hidden" name="obligation_id" value={obligationId} />

          <p className="text-sm leading-6 text-slate-300">
            Vas a anular la obligación{" "}
            <span className="font-semibold text-white">{obligationCode}</span>.
          </p>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Motivo de anulación
            </label>
            <textarea
              name="delete_reason"
              className="min-h-24 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-red-400"
              placeholder="Explica por qué esta obligación debe anularse."
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Escribe ANULAR para confirmar
            </label>
            <input
              name="confirmation_text"
              type="text"
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-red-400"
              placeholder="ANULAR"
              required
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              className="rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-400"
            >
              Confirmar anulación
            </button>

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:border-slate-500"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}
    </div>
  );
}