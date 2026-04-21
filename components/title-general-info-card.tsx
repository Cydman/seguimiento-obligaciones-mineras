import type { MiningTitleRecord } from "@/types/titles";

function hasValue(value?: string | null) {
  return Boolean(value && value.trim());
}

function joinParts(parts: Array<string | null | undefined>) {
  return parts.filter((item) => item && item.trim()).join(" · ");
}

function DataLine({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  if (!hasValue(value)) return null;

  return (
    <p className="text-sm leading-6 text-slate-200">
      <span className="font-semibold text-white">{label}: </span>
      {value}
    </p>
  );
}

export function TitleGeneralInfoCard({
  title,
}: {
  title: MiningTitleRecord;
}) {
  const hasSubcontractor =
    hasValue(title.subcontractor_name) ||
    hasValue(title.subcontractor_identification) ||
    hasValue(title.subcontractor_address) ||
    hasValue(title.subcontractor_phone) ||
    hasValue(title.subcontractor_email);

  const locationText = joinParts([
    title.village ? `Vereda ${title.village}` : null,
    title.municipality,
    title.department,
  ]);

  const titleMeta = joinParts([
    title.code ? `Placa ${title.code}` : null,
    title.mine_name || title.name,
  ]);

  return (
    <div
      className={`grid gap-3 ${
        hasSubcontractor ? "xl:grid-cols-3" : "xl:grid-cols-2"
      }`}
    >
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
        <div className="mb-3 border-b border-slate-800 pb-3">
          <p className="text-xs uppercase tracking-[0.18em] text-emerald-300">
            Titular
          </p>
          <h3 className="mt-1.5 text-2xl font-bold text-white">
            {title.holder_name || "Información del titular"}
          </h3>
          {hasValue(titleMeta) ? (
            <p className="mt-1 text-sm text-slate-400">{titleMeta}</p>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <DataLine label="Nombre del titular" value={title.holder_name} />
          <DataLine
            label="No. identificación"
            value={title.holder_identification}
          />
          <DataLine label="Dirección" value={title.holder_address} />
          <DataLine label="Teléfono" value={title.holder_phone} />
          <DataLine label="Email" value={title.holder_email} />
        </div>
      </div>

      {hasSubcontractor ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <div className="mb-3 border-b border-slate-800 pb-3">
            <p className="text-xs uppercase tracking-[0.18em] text-sky-300">
              Subcontratista
            </p>
            <h3 className="mt-1.5 text-2xl font-bold text-white">
              {title.subcontractor_name || "Información del subcontratista"}
            </h3>
            {hasValue(title.code) ? (
              <p className="mt-1 text-sm text-slate-400">Placa {title.code}</p>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <DataLine
              label="Nombre del subcontratista"
              value={title.subcontractor_name}
            />
            <DataLine
              label="No. identificación"
              value={title.subcontractor_identification}
            />
            <DataLine label="Dirección" value={title.subcontractor_address} />
            <DataLine label="Teléfono" value={title.subcontractor_phone} />
            <DataLine label="Email" value={title.subcontractor_email} />
          </div>
        </div>
      ) : null}

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
        <div className="mb-3 border-b border-slate-800 pb-3">
          <p className="text-xs uppercase tracking-[0.18em] text-amber-300">
            Información general del título
          </p>
          <h3 className="mt-1.5 text-2xl font-bold text-white">
            {title.code || "Título minero"}
          </h3>
          {hasValue(title.mine_name || title.name) ? (
            <p className="mt-1 text-sm text-slate-400">
              {title.mine_name || title.name}
            </p>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <DataLine label="Título" value={title.code} />
          <DataLine label="Nombre de la mina" value={title.mine_name} />
          <DataLine label="Mineral(es) a explotar" value={title.mineral} />
          <DataLine label="Ubicación" value={locationText} />
          <DataLine label="Modalidad del título" value={title.title_modality} />
          <DataLine label="Área otorgada" value={title.granted_area} />
          <DataLine
            label="Fecha inscripción RMN"
            value={title.rmn_registration_date}
          />
          <DataLine label="Etapa contractual" value={title.contract_stage} />
          <DataLine
            label="Fecha inscripción RMN - Subcontrato"
            value={title.subcontract_rmn_registration_date}
          />
          <DataLine label="Anualidad" value={title.annuality} />
        </div>
      </div>
    </div>
  );
}