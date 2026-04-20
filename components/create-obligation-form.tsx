"use client";

import { createObligationAction } from "@/app/admin/actions";

interface OrganizationOption {
  id: string;
  name: string;
}

interface TitleOption {
  id: string;
  code: string;
  name: string;
  organization_id: string;
}

interface CreateObligationFormProps {
  organizations: OrganizationOption[];
  titles: TitleOption[];
}

export function CreateObligationForm({
  organizations,
  titles,
}: CreateObligationFormProps) {
  return (
    <form action={createObligationAction} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Organización
          </label>
          <select
            name="organization_id"
            required
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
          >
            <option value="">Selecciona una organización</option>
            {organizations.map((org) => (
              <option key={org.id} value={org.id}>
                {org.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Título minero
          </label>
          <select
            name="title_id"
            required
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
          >
            <option value="">Selecciona un título</option>
            {titles.map((title) => (
              <option key={title.id} value={title.id}>
                {title.code} - {title.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Categoría
          </label>
          <select
            name="category"
            required
            defaultValue="juridica"
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
          >
            <option value="tecnica">Técnica</option>
            <option value="juridica">Jurídica</option>
            <option value="economica">Económica</option>
            <option value="social">Social</option>
            <option value="ambiental">Ambiental</option>
          </select>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-3">
          <p className="text-sm text-slate-400">Código</p>
          <p className="mt-1 text-sm text-white">
            Se generará automáticamente al guardar.
          </p>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Autoridad
          </label>
          <select
            name="authority"
            required
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
            required
            defaultValue="media"
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
            required
            defaultValue="pendiente"
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
            required
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Nombre de la obligación
          </label>
          <input
            name="name"
            type="text"
            required
            placeholder="Ej. Presentación de informe técnico semestral"
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Descripción
          </label>
          <textarea
            name="description"
            required
            rows={4}
            placeholder="Describe la obligación y el seguimiento requerido."
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Fundamento jurídico o técnico
          </label>
          <textarea
            name="legal_basis"
            rows={4}
            placeholder="Norma, acto administrativo, obligación contractual, requerimiento, etc."
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-slate-950"
        >
          Guardar obligación
        </button>
      </div>
    </form>
  );
}