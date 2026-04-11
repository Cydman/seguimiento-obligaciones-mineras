export type ObligationStatus =
  | "pendiente"
  | "en_proceso"
  | "cumplida"
  | "vencida";

export type ObligationPriority = "alta" | "media" | "baja";

export type AuthorityCode = "ANM" | "ANLA" | "CAR" | "MUNICIPIO" | "OTRA";

export interface Organization {
  id: string;
  name: string;
  documentNumber: string;
  subscriptionPlan: "basico" | "profesional" | "empresarial";
}

export interface MiningTitle {
  id: string;
  code: string;
  name: string;
  mineral: string;
  municipality: string;
  department: string;
  organizationId: string;
}

export interface Obligation {
  id: string;
  titleId: string;
  organizationId: string;
  code: string;
  name: string;
  authority: AuthorityCode;
  status: ObligationStatus;
  priority: ObligationPriority;
  dueDate: string;
  description: string;
  legalBasis?: string;
  createdAt: string;
}