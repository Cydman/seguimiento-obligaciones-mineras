import type { MiningTitle, Obligation, Organization } from "@/types/obligations";

export const organizationMock: Organization = {
  id: "org-001",
  name: "Mina Don Camilo S.A.S.",
  documentNumber: "900123456-7",
  subscriptionPlan: "profesional",
};

export const miningTitlesMock: MiningTitle[] = [
  {
    id: "title-001",
    code: "PDBA-00001",
    name: "Polígono No. 10 Don Camilo",
    mineral: "Carbón",
    municipality: "Sativanorte",
    department: "Boyacá",
    organizationId: "org-001",
  },
];

export const obligationsMock: Obligation[] = [
  {
    id: "obl-001",
    titleId: "title-001",
    organizationId: "org-001",
    code: "OBL-ANM-001",
    name: "Presentación de informe técnico semestral",
    authority: "ANM",
    status: "pendiente",
    priority: "alta",
    dueDate: "2026-05-20",
    description: "Cargar y radicar el informe técnico semestral del título.",
    legalBasis: "Contrato de concesión / requerimientos ANM",
    createdAt: "2026-04-10",
  },
  {
    id: "obl-002",
    titleId: "title-001",
    organizationId: "org-001",
    code: "OBL-ANLA-002",
    name: "Actualización de soporte ambiental",
    authority: "ANLA",
    status: "en_proceso",
    priority: "media",
    dueDate: "2026-05-30",
    description: "Actualizar documentación y soportes del componente ambiental.",
    legalBasis: "Instrumento ambiental aplicable",
    createdAt: "2026-04-10",
  },
  {
    id: "obl-003",
    titleId: "title-001",
    organizationId: "org-001",
    code: "OBL-CAR-003",
    name: "Entrega de reporte de vertimientos",
    authority: "CAR",
    status: "vencida",
    priority: "alta",
    dueDate: "2026-04-05",
    description: "Remitir reporte de vertimientos ante autoridad competente.",
    legalBasis: "Normativa ambiental regional",
    createdAt: "2026-04-10",
  },
  {
    id: "obl-004",
    titleId: "title-001",
    organizationId: "org-001",
    code: "OBL-MUN-004",
    name: "Renovación de requisito municipal",
    authority: "MUNICIPIO",
    status: "cumplida",
    priority: "baja",
    dueDate: "2026-03-28",
    description: "Actualizar requisito documental exigido por el municipio.",
    legalBasis: "Reglamentación municipal aplicable",
    createdAt: "2026-04-10",
  },
];