export type ObligationStatus =
  | "pendiente"
  | "en_proceso"
  | "cumplida"
  | "vencida";

export type ObligationPriority = "alta" | "media" | "baja";

export type ObligationCategory =
  | "tecnica"
  | "juridica"
  | "economica"
  | "social"
  | "ambiental";

export interface Organization {
  id: string;
  name: string;
  documentNumber: string;
  subscriptionPlan: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MiningTitle {
  id: string;
  organizationId: string;
  code: string;
  name: string;
  mineral: string;
  municipality: string;
  department: string;
  createdAt: string;
  updatedAt: string;
}

export interface Obligation {
  id: string;
  organizationId: string;
  titleId: string;
  code: string;
  name: string;
  authority: string;
  status: ObligationStatus;
  priority: ObligationPriority;
  category: ObligationCategory;
  dueDate: string;
  description: string;
  legalBasis: string | null;
  assignedProfileId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ObligationActivityLog {
  id: string;
  obligation_id: string;
  actor_profile_id: string | null;
  action: string;
  note: string | null;
  payload: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
  attachment_path: string | null;
  attachment_name: string | null;
  attachment_mime: string | null;
  attachment_size: number | null;
  is_system: boolean;
}