"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

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
  const router = useRouter();

  const initialOrganizationId = organizations[0]?.id ?? "";
  const [organizationId, setOrganizationId] = useState(initialOrganizationId);

  const availableTitles = useMemo(() => {
    return titles.filter((title) => title.organization_id === organizationId);
  }, [titles, organizationId]);

  const [titleId, setTitleId] = useState(availableTitles[0]?.id ?? "");
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [authority, setAuthority] = useState("ANM");
  const [priority, setPriority] = useState("media");
  const [status, setStatus] = useState("pendiente");
  const [dueDate, setDueDate] = useState("");
  const [description, setDescription] = useState("");
  const [legalBasis, setLegalBasis] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  function handleOrganizationChange(newOrganizationId: string) {
    setOrganizationId(newOrganizationId);

    const relatedTitles = titles.filter(
      (title) => title.organization_id === newOrganizationId
    );

    setTitleId(relatedTitles[0]?.id ?? "");
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await supabase.from("obligations").insert({
      organization_id: organizationId,
      title_id: titleId,
      code,
      name,
      authority,
      status,
      priority,
      due_date: dueDate,
      description,
      legal_basis: legalBasis || null,
    });

    setLoading(false);

    if (error) {
      setMessage(`Error al guardar: ${error.message}`);
      return;
    }

    setCode("");
    setName("");
    setAuthority("ANM");
    setPriority("media");
    setStatus("pendiente");
    setDueDate("");
    setDescription("");
    setLegalBasis("");
    setMessage("Obligación registrada correctamente.");

    router.refresh();
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <h2 className="text-2xl font-semibold text-white">
        Registrar nueva obligación
      </h2>

      <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Organización
          </label>
          <select
            value={organizationId}
            onChange={(e) => handleOrganizationChange(e.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-500"
          >
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
            value={titleId}
            onChange={(e) => setTitleId(e.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-500"
          >
            {availableTitles.map((title) => (
              <option key={title.id} value={title.id}>
                {title.code} - {title.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Código
          </label>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            type="text"
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-500"
            placeholder="OBL-ANM-005"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Nombre de la obligación
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-500"
            placeholder="Ej. Presentación de informe anual"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Autoridad
          </label>
          <select
            value={authority}
            onChange={(e) => setAuthority(e.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-500"
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
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
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
            value={status}
            onChange={(e) => setStatus(e.target.value)}
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
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            type="date"
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-500"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Descripción
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="min-h-28 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-500"
            placeholder="Describe la obligación y el seguimiento requerido."
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Fundamento jurídico o técnico
          </label>
          <textarea
            value={legalBasis}
            onChange={(e) => setLegalBasis(e.target.value)}
            className="min-h-24 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-500"
            placeholder="Norma, acto administrativo, obligación contractual, requerimiento, etc."
          />
        </div>

        <div className="md:col-span-2 flex items-center gap-4">
          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:opacity-60"
          >
            {loading ? "Guardando..." : "Guardar obligación"}
          </button>

          {message ? (
            <p className="text-sm text-slate-300">{message}</p>
          ) : null}
        </div>
      </form>
    </div>
  );
}