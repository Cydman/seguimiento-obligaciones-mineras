"use client";

import { useEffect, useMemo, useState } from "react";
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
  mine_name?: string | null;
  is_active?: boolean;
}

interface CreateObligationFormProps {
  organizations: OrganizationOption[];
  titles: TitleOption[];
}

export function CreateObligationForm({
  organizations,
  titles,
}: CreateObligationFormProps) {
  const [selectedOrganizationId, setSelectedOrganizationId] = useState("");
  const [selectedTitleId, setSelectedTitleId] = useState("");

  const availableTitles = useMemo(() => {
    if (!selectedOrganizationId) return [];

    return titles
      .filter(
        (title) =>
          title.organization_id === selectedOrganizationId &&
          title.is_active !== false
      )
      .sort((a, b) => a.code.localeCompare(b.code, "es-CO"));
  }, [titles, selectedOrganizationId]);

  useEffect(() => {
    if (!selectedTitleId) return;

    const exists = availableTitles.some((title) => title.id === selectedTitleId);

    if (!exists) {
      setSelectedTitleId("");
    }
  }, [availableTitles, selectedTitleId]);

  return (
    <form action={createObligationAction} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Organización
          </label>
          <select
            name="organization_id"
            value={selectedOrganizationId}
            onChange={(e) => {
              setSelectedOrganizationId(e.target.value);
              setSelectedTitleId("");
            }}
            required
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-500"
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
            value={selectedTitleId}
            onChange={(e) => setSelectedTitleId(e.target.value)}
            required
            disabled={!selectedOrganizationId || availableTitles.length === 0}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <option value="">
              {!selectedOrganizationId
                ? "Selecciona primero una organización"
                : availableTitles.length === 0
                ? "No hay títulos disponibles"
                : "Selecciona un título"}
            </option>

            {availableTitles.map((title) => (
              <option key={title.id} value={title.id}>
                {title.code} - {title.mine_name || title.name}
              </option>
            ))}
          </select>

          <p className="mt-2 text-xs text-slate-400">
            {selectedOrganizationId
              ? `${availableTitles.length} título(s) disponible(s) para esta organización.`
              : "El listado de títulos se filtra automáticamente por organización."}
          </p>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Categoría
          </label>
          <select
            name="category"
            required
            defaultValue="juridica"
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-500"
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
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-500"
          >
            <option value="ANM">ANM</option>
            <option value="ANLA">ANLA</option>
            <option value="CAR">CAR</option>
            <option value="MUNICIPIO">Municipio</option>
            <option value="OTRA">Otra</option>
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
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-500"
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
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-500"
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
            lang="es-CO"
            required
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-500"
          />
          <p className="mt-2 text-xs text-slate-400">
            La plataforma mostrará esta fecha en formato día/mes/año.
          </p>
        </div>

        <div className="md:col-span-2 xl:col-span-3">
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Nombre de la obligación
          </label>
          <input
            name="name"
            type="text"
            required
            placeholder="Ej. Presentación de informe técnico semestral"
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-500"
          />
        </div>

        <div className="md:col-span-2 xl:col-span-3">
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Descripción
          </label>
          <textarea
            name="description"
            required
            rows={4}
            placeholder="Describe la obligación y el seguimiento requerido."
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-500"
          />
        </div>

        <div className="md:col-span-2 xl:col-span-3">
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Fundamento jurídico o técnico
          </label>
          <textarea
            name="legal_basis"
            rows={4}
            placeholder="Norma, acto administrativo, obligación contractual, requerimiento, etc."
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-emerald-400"
        >
          Guardar obligación
        </button>
      </div>
    </form>
  );
}