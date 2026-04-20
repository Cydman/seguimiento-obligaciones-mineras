"use client";

import { updateObligationAction } from "@/app/admin/actions";
import type { Obligation } from "@/types/obligations";

interface AssignableProfile {
  id: string;
  email: string | null;
  full_name: string | null;
}

export function AdminEditObligationForm({
  obligation,
  assignableProfiles,
}: {
  obligation: Obligation;
  assignableProfiles: AssignableProfile[];
}) {
  return (
    <form action={updateObligationAction} className="space-y-6">
      <input type="hidden" name="obligation_id" value={obligation.id} />

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-3">
          <p className="text-sm text-slate-400">Código</p>
          <p className="mt-1 text-sm text-white">{obligation.code}</p>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Categoría
          </label>
          <select
            name="category"
            defaultValue={obligation.category}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
          >
            <option value="tecnica">Técnica</option>
            <option value="juridica">Jurídica</option>
            <option value="economica">Económica</option>
            <option value="social">Social</option>
            <option value="ambiental">Ambiental</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Nombre de la obligación
          </label>
          <input
            name="name"
            defaultValue={obligation.name}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Autoridad
          </label>
          <select
            name="authority"
            defaultValue={obligation.authority}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
          >
            <option value="ANM">ANM</option>
            <option value="ANLA">ANLA</option>
            <option value="CAR">CAR</option>
            <option value="MUNICIPIO">MUNICIPIO</option>
            <option value="OTRA">OTRA</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Prioridad
          </label>
          <select
            name="priority"
            defaultValue={obligation.priority}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
          >
            <option value="alta">Alta</option>
            <option value="media">Media</option>
            <option value="baja">Baja</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Estado
          </label>
          <select
            name="status"
            defaultValue={obligation.status}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
          >
            <option value="pendiente">Pendiente</option>
            <option value="en_proceso">En proceso</option>
            <option value="cumplida">Cumplida</option>
            <option value="vencida">Vencida</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Fecha de vencimiento
          </label>
          <input
            name="due_date"
            type="date"
            defaultValue={obligation.dueDate}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Responsable asignado
          </label>
          <select
            name="assigned_profile_id"
            defaultValue={obligation.assignedProfileId ?? ""}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
          >
            <option value="">Sin asignar</option>
            {assignableProfiles.map((item) => (
              <option key={item.id} value={item.id}>
                {item.full_name || item.email || item.id}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Descripción
          </label>
          <textarea
            name="description"
            defaultValue={obligation.description}
            rows={4}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Fundamento jurídico o técnico
          </label>
          <textarea
            name="legal_basis"
            defaultValue={obligation.legalBasis ?? ""}
            rows={4}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-slate-950"
        >
          Guardar cambios
        </button>
      </div>
    </form>
  );
}